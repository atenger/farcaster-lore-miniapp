'use client';

import { MiniAppProvider } from '@neynar/react';

interface MiniAppWrapperProps {
  children: React.ReactNode;
}

export default function MiniAppWrapper({ children }: MiniAppWrapperProps) {
  return (
    <MiniAppProvider analyticsEnabled={true}>
      {children}
    </MiniAppProvider>
  );
} 