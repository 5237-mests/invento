import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Store',
};

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
