import { Router } from 'express';
import { query } from './db.js';
import { authenticate } from './middleware.js';
import { cartItemSchema, quantitySchema } from './validation.js';

export const cartRouter = Router();
cartRouter.use(authenticate);

const cartSql = `SELECT ci.id, ci.product_id AS "productId", ci.quantity,
 p.name, p.slug, p.price::float, p.image_url AS "imageUrl", p.inventory,
 (p.price * ci.quantity)::float AS "lineTotal"
 FROM carts c JOIN cart_items ci ON ci.cart_id=c.id JOIN products p ON p.id=ci.product_id
 WHERE c.user_id=$1 AND p.active=TRUE ORDER BY ci.id`;

cartRouter.get('/', async (req, res, next) => {
  try {
    const items = (await query(cartSql, [req.user.id])).rows;
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    res.json({ data: { items, subtotal, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) } });
  } catch (error) { next(error); }
});

cartRouter.post('/items', async (req, res, next) => {
  try {
    const parsed = cartItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Choose a valid product quantity.' });
    const product = (await query('SELECT id,inventory,active FROM products WHERE id=$1', [parsed.data.productId])).rows[0];
    if (!product || !product.active) return res.status(404).json({ error: 'Product not found.' });
    const current = (await query(`SELECT COALESCE(ci.quantity,0) AS quantity FROM carts c LEFT JOIN cart_items ci ON ci.cart_id=c.id AND ci.product_id=$2 WHERE c.user_id=$1`, [req.user.id, parsed.data.productId])).rows[0];
    if (Number(current.quantity) + parsed.data.quantity > product.inventory) return res.status(409).json({ error: 'There is not enough inventory for that quantity.' });
    await query(`INSERT INTO cart_items(cart_id,product_id,quantity)
      SELECT id,$2,$3 FROM carts WHERE user_id=$1
      ON CONFLICT(cart_id,product_id) DO UPDATE SET quantity=cart_items.quantity+EXCLUDED.quantity`, [req.user.id, parsed.data.productId, parsed.data.quantity]);
    res.status(201).json({ message: 'Added to cart.' });
  } catch (error) { next(error); }
});

cartRouter.patch('/items/:productId', async (req, res, next) => {
  try {
    const parsed = quantitySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Quantity must be between 1 and 20.' });
    const result = await query(`UPDATE cart_items ci SET quantity=$3 FROM carts c, products p
      WHERE ci.cart_id=c.id AND ci.product_id=p.id AND c.user_id=$1 AND ci.product_id=$2 AND $3<=p.inventory RETURNING ci.id`, [req.user.id, req.params.productId, parsed.data.quantity]);
    if (!result.rowCount) return res.status(409).json({ error: 'Quantity unavailable or item not found.' });
    res.json({ message: 'Cart updated.' });
  } catch (error) { next(error); }
});

cartRouter.delete('/items/:productId', async (req, res, next) => {
  try {
    await query('DELETE FROM cart_items USING carts WHERE cart_items.cart_id=carts.id AND carts.user_id=$1 AND cart_items.product_id=$2', [req.user.id, req.params.productId]);
    res.status(204).end();
  } catch (error) { next(error); }
});
