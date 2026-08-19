import { Router } from 'express';
import { query } from './db.js';
import { authenticate, requireAdmin } from './middleware.js';
import { productSchema } from './validation.js';

export const productRouter = Router();
const fields = `p.id, p.name, p.slug, p.description, p.price::float, p.image_url AS "imageUrl",
 p.inventory, p.featured, p.active, p.category_id AS "categoryId", c.name AS "categoryName", c.slug AS "categorySlug"`;

productRouter.get('/categories', async (req, res, next) => {
  try { res.json({ data: (await query('SELECT id, name, slug FROM categories ORDER BY name')).rows }); } catch (e) { next(e); }
});

productRouter.get('/products', async (req, res, next) => {
  try {
    const { search='', category='', sort='newest', featured } = req.query;
    const values = []; const where = ['p.active = TRUE'];
    if (search) { values.push(`%${search}%`); where.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`); }
    if (category) { values.push(category); where.push(`c.slug = $${values.length}`); }
    if (featured === 'true') where.push('p.featured = TRUE');
    const sorts = { newest:'p.created_at DESC', 'price-asc':'p.price ASC', 'price-desc':'p.price DESC', name:'p.name ASC' };
    const sql = `SELECT ${fields} FROM products p JOIN categories c ON c.id=p.category_id WHERE ${where.join(' AND ')} ORDER BY ${sorts[sort] || sorts.newest}`;
    res.json({ data: (await query(sql, values)).rows });
  } catch (e) { next(e); }
});

productRouter.get('/products/:slug', async (req, res, next) => {
  try {
    const result = await query(`SELECT ${fields} FROM products p JOIN categories c ON c.id=p.category_id WHERE p.slug=$1 AND p.active=TRUE`, [req.params.slug]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found.' });
    res.json({ data: result.rows[0] });
  } catch (e) { next(e); }
});

productRouter.get('/admin/products', authenticate, requireAdmin, async (req, res, next) => {
  try { res.json({ data: (await query(`SELECT ${fields} FROM products p JOIN categories c ON c.id=p.category_id ORDER BY p.created_at DESC`)).rows }); } catch(e) { next(e); }
});

productRouter.post('/admin/products', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error:'Please correct the product fields.', details:parsed.error.flatten().fieldErrors });
    const p=parsed.data;
    const result=await query(`INSERT INTO products(category_id,name,slug,description,price,image_url,inventory,featured,active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,[p.categoryId,p.name,p.slug,p.description,p.price,p.imageUrl,p.inventory,p.featured,p.active]);
    res.status(201).json({ data:{ id:result.rows[0].id, ...p } });
  } catch(e){ next(e); }
});

productRouter.put('/admin/products/:id', authenticate, requireAdmin, async (req,res,next)=>{
  try {
    const parsed=productSchema.safeParse(req.body);
    if(!parsed.success) return res.status(400).json({error:'Please correct the product fields.',details:parsed.error.flatten().fieldErrors});
    const p=parsed.data;
    const result=await query(`UPDATE products SET category_id=$1,name=$2,slug=$3,description=$4,price=$5,image_url=$6,inventory=$7,featured=$8,active=$9,updated_at=NOW() WHERE id=$10 RETURNING id`,[p.categoryId,p.name,p.slug,p.description,p.price,p.imageUrl,p.inventory,p.featured,p.active,req.params.id]);
    if(!result.rowCount) return res.status(404).json({error:'Product not found.'});
    res.json({data:{id:Number(req.params.id),...p}});
  } catch(e){next(e);}
});

productRouter.delete('/admin/products/:id', authenticate, requireAdmin, async(req,res,next)=>{
  try { const result=await query('UPDATE products SET active=FALSE,updated_at=NOW() WHERE id=$1 RETURNING id',[req.params.id]); if(!result.rowCount)return res.status(404).json({error:'Product not found.'}); res.status(204).end(); } catch(e){next(e);}
});
