export type Product={id:number;categoryId:number;categoryName:string;categorySlug:string;name:string;slug:string;description:string;price:number;imageUrl:string;inventory:number;featured:boolean;active:boolean};
export type Category={id:number;name:string;slug:string};
export type User={id:number;name:string;email:string;role:'customer'|'admin'};
export type CartItem={id:number;productId:number;quantity:number;name:string;slug:string;price:number;imageUrl:string;inventory:number;lineTotal:number};
export type Cart={items:CartItem[];subtotal:number;itemCount:number};
export type Order={id:number;customerName?:string;email?:string;subtotal:number;status:string;paymentStatus:string;createdAt:string;itemLines?:number;items?:Array<{productId:number;productName:string;unitPrice:number;quantity:number;lineTotal:number}>};
const API = '/api';
export async function api<T>(path:string,options?:RequestInit):Promise<T>{const response=await fetch(`${API}${path}`,{...options,credentials:'include',headers:{'Content-Type':'application/json',...(options?.headers||{})},cache:'no-store'});if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||'Request failed.');}if(response.status===204)return undefined as T;return response.json();}
