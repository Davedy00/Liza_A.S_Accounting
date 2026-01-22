import { redirect } from 'next/navigation';

export default function RootPage() {
  // This immediately sends the user to /homepage
  redirect('/homepage');
}