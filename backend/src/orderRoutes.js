import { Router } from 'express';
import { pool, query } from './db.js';
import { authenticate, requireAdmin } from './middleware.js';
import { checkoutSchema, orderStatusSchema } from './validation.js';

export const orderRouter = Router();

orderRouter.post('/orders', authenticate, async (req, res, next) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Complete all required shipping fields.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const items = (await client.query(`SELECT ci.product_id,ci.quantity,p.name,p.price,p.inventory,p.active
      FROM carts c JOIN cart_items ci ON ci.cart_id=c.id JOIN products p ON p.id=ci.product_id
      WHERE c.user_id=$1 FOR UPDATE OF p`, [req.user.id])).rows;
    if (!items.length) throw Object.assign(new Error('Your cart is empty.'), { status: 400 });
    if (items.some(item => !item.active || item.quantity > item.inventory)) throw Object.assign(new Error('One or more items are no longer available in that quantity.'), { status: 409 });
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const s = parsed.data;
    const order = (await client.query(`INSERT INTO orders(user_id,customer_name,email,address_line1,address_line2,city,state,postal_code,subtotal)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,status,payment_status AS "paymentStatus",subtotal::float,created_at AS "createdAt"`,
      [req.user.id,s.customerName,s.email,s.addressLine1,s.addressLine2||null,s.city,s.state,s.postalCode,subtotal])).rows[0];
    for (const item of items) {
      await client.query('INSERT INTO order_items(order_id,product_id,product_name,unit_price,quantity) VALUES($1,$2,$3,$4,$5)', [order.id,item.product_id,item.name,item.price,item.quantity]);
      await client.query('UPDATE products SET inventory=inventory-$1,updated_at=NOW() WHERE id=$2', [item.quantity,item.product_id]);
    }
    await client.query('DELETE FROM cart_items USING carts WHERE cart_items.cart_id=carts.id AND carts.user_id=$1', [req.user.id]);
    await client.query('COMMIT');
    res.status(201).json({ data: order });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.status) return res.status(error.status).json({ error: error.message });
    next(error);
  } finally { client.release(); }
});

orderRouter.get('/orders/my-orders', authenticate, async (req, res, next) => {
  try { res.json({ data: (await query(`SELECT id,subtotal::float,status,payment_status AS "paymentStatus",created_at AS "createdAt" FROM orders WHERE user_id=$1 ORDER BY created_at DESC`, [req.user.id])).rows }); } catch(error) { next(error); }
});

orderRouter.get('/orders/my-orders/:id', authenticate, async (req, res, next) => {
  try {
    const order = (await query(`SELECT id,customer_name AS "customerName",email,address_line1 AS "addressLine1",address_line2 AS "addressLine2",city,state,postal_code AS "postalCode",subtotal::float,status,payment_status AS "paymentStatus",created_at AS "createdAt" FROM orders WHERE id=$1 AND user_id=$2`, [req.params.id, req.user.id])).rows[0];
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    order.items = (await query(`SELECT product_id AS "productId",product_name AS "productName",unit_price::float AS "unitPrice",quantity,(unit_price*quantity)::float AS "lineTotal" FROM order_items WHERE order_id=$1`, [order.id])).rows;
    res.json({ data: order });
  } catch(error) { next(error); }
});

orderRouter.get('/admin/orders', authenticate, requireAdmin, async (req, res, next) => {
  try { res.json({ data: (await query(`SELECT o.id,o.customer_name AS "customerName",o.email,o.subtotal::float,o.status,o.payment_status AS "paymentStatus",o.created_at AS "createdAt",COUNT(oi.id)::int AS "itemLines" FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id GROUP BY o.id ORDER BY o.created_at DESC`)).rows }); } catch(error) { next(error); }
});

orderRouter.patch('/admin/orders/:id/status', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const parsed = orderStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Select a valid order status.' });
    const result = await query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING id,status', [parsed.data.status,req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Order not found.' });
    res.json({ data: result.rows[0] });
  } catch(error) { next(error); }
});
