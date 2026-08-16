import './globals.css';
import Link from 'next/link';
export const metadata={title:'Lumera Beauty',description:'Gentle skincare for radiant routines'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="site-header"><Link className="brand" href="/">LUMERA</Link><nav aria-label="Main navigation"><Link href="/products">Shop</Link><Link href="/admin">Admin</Link><span className="muted">Cart · teammate</span></nav></header>{children}<footer>© 2026 Lumera Beauty · Thoughtful formulas, luminous skin.</footer></body></html>}
