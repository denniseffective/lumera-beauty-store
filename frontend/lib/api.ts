export type Product={id:number;categoryId:number;categoryName:string;categorySlug:string;name:string;slug:string;description:string;price:number;imageUrl:string;inventory:number;featured:boolean;active:boolean};
export type Category={id:number;name:string;slug:string};
const API=process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function api<T>(path:string,options?:RequestInit):Promise<T>{const response=await fetch(`${API}${path}`,{...options,headers:{'Content-Type':'application/json',...(options?.headers||{})},cache:'no-store'});if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||'Request failed.');}if(response.status===204)return undefined as T;return response.json();}
