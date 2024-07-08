// logout api
import { redirect } from 'next/navigation';
import { logout } from '@/lib/lib';

export async function GET() {
  await logout();
  redirect('/');
}
