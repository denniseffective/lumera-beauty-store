'use client';
import Link from 'next/link';import {useEffect,useState} from 'react';import {api,type Order} from '@/lib/api';
const statuses=['processing','shipped','delivered','cancelled'];
export default function AdminOrders(){
 const [orders,setOrders]=useState<Order[]>([]);const [error,setError]=useState('');
 const load=()=>{void api<{data:Order[]}>('/admin/orders').then(r=>setOrders(r.data)).catch(e=>setError(e instanceof Error?e.message:'Unable to load orders.'))};useEffect(load,[]);
 const change=async(id:number,status:string)=>{await api(`/admin/orders/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});load()};
 return <main className="section admin"><span className="eyebrow">STORE MANAGEMENT</span><h1 className="page-title">Customer orders</h1><p><Link href="/admin">← Product administration</Link></p>{error&&<div className="notice error">{error}</div>}<div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>#{o.id}</td><td>{o.customerName}<br/><small>{o.email}</small></td><td>{new Date(o.createdAt).toLocaleDateString()}</td><td>${o.subtotal.toFixed(2)}</td><td>{o.paymentStatus}</td><td><select value={o.status} onChange={e=>change(o.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></main>
}
