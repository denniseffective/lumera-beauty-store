import './globals.css';
import './features.css';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
export const metadata={title:'Lumera Beauty',description:'Gentle skincare for radiant routines'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="site-header"><Link className="brand" href="/">LUMERA</Link><Nav/></header>{children}<footer>© 2026 Lumera Beauty · Thoughtful formulas, luminous skin.</footer></body></html>}
