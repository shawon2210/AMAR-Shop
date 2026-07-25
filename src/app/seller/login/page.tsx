import { redirect } from 'next/navigation';

export default function SellerLoginPage() {
  redirect('/auth/login');
}
