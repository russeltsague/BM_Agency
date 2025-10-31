import { redirect } from 'next/navigation';

export default function AdminCatchAll() {
  // Default to 'fr' locale
  redirect('/fr/admin/login');
}
