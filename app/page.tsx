import { redirect } from 'next/navigation';
import { getSession } from '@/lib/lib';
import { JWTPayload } from 'jose';

export default async function Page() {
  const session: JWTPayload | null = await getSession();

  // Check if the user is logged in
  if (!session) {
    redirect('/login');
    return;
  }

  // Redirect based on the user's role
  switch ((session.user as { role: string }).role) {
    case 'admin':
      redirect('/admin');
      break;
    case 'storekeeper':
      redirect('/store');
      break;
    case 'shopkeeper':
      redirect('/shopkeeper');
      break;
    default:
      redirect('/unauthorized');
      break;
  }
}
