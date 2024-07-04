'use client';

export default function Store() {
  // want to protect this page for unlogged users and redirect to login page
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = '/login';
    return;
  }

  // user is logged in
  // check user is shopkeeper
  // this page is only for shopkeeper
  // if not shopkeeper or admin redirect to unauthorized page
  const data = JSON.parse(user);
  if (data.user.role !== 'shopkeeper' && data.user.role !== 'admin') {
    window.location.href = '/unauthorized';
    return;
  }

  return <div>Shop</div>;
}
