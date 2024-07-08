import { cookies } from 'next/headers';

export function checkAuth() {
  const session = cookies().get('session')?.value;
  if (!session) {
    return false;
  }
  return true;
}
export function checkAdmin() {
  const session = cookies().get('session')?.value;
  const role = cookies().get('role')?.value;

  if (!session || role !== 'admin') {
    return false;
  }
  return true;
}

export function checkUser() {
  const session = cookies().get('session')?.value;
  const role = cookies().get('role')?.value;

  if (!session || role !== 'user') {
    return false;
  }
  return true;
}

export function checkShop() {
  const session = cookies().get('session')?.value;
  const role = cookies().get('role')?.value;

  if (!session || role !== 'shop') {
    return false;
  }
  return true;
}

export function checkStore() {
  const session = cookies().get('session')?.value;
  const role = cookies().get('role')?.value;

  if (!session || role !== 'store') {
    return false;
  }
  return true;
}

export function checkShopkeeper() {
  const session = cookies().get('session')?.value;
  const role = cookies().get('role')?.value;

  if (!session || role !== 'shopkeeper') {
    return false;
  }
  return true;
}

export function checkStorekeeper() {
  const session = cookies().get('session')?.value;
  const role = cookies().get('role')?.value;

  if (!session || role !== 'storekeeper') {
    return false;
  }
  return true;
}
