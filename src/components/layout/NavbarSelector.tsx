'use client';
import { usePathname } from 'next/navigation';
import HomeHeader from './HomeHeader';
import ClientHeader from './ClientHeader';
import AdminHeader from './AdminHeader';

export default function NavbarSelector() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return <AdminHeader />;
  if (pathname === '/' || pathname === '/home') return <HomeHeader />;
  return <ClientHeader />;
}