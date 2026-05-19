'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
  side = 'left',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
        <Dialog.Content
          className={cn(
            'fixed top-0 z-50 flex h-full w-[min(100%,360px)] flex-col bg-white shadow-xl lg:hidden',
            side === 'left' ? 'left-0' : 'right-0',
          )}
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            {title ? <Dialog.Title className="font-semibold">{title}</Dialog.Title> : <span />}
            <Dialog.Close className="rounded-md p-1 hover:bg-stone-100" aria-label="Fermer">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-hidden">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
