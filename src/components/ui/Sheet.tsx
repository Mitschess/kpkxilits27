import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

/** Side panel (full screen on phones) built on Radix Dialog: focus trap, Escape, aria. */
export default function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  useScrollLock(open);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[80] bg-night-950/75 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="sheet-content fixed inset-y-0 right-0 z-[81] flex w-full max-w-2xl flex-col border-l border-paper/10 bg-night-900 shadow-[-40px_0_120px_-20px_rgb(0_0_0/0.7)] outline-none"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close
            className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-night-950/70 text-paper ring-1 ring-paper/15 backdrop-blur transition hover:bg-night-700 hover:ring-paper/30"
            aria-label="Tutup"
          >
            <X size={18} />
          </Dialog.Close>
          <div data-lenis-prevent className="relative flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
