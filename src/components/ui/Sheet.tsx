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
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="sheet-content fixed inset-y-0 right-0 z-[81] flex w-full max-w-2xl flex-col bg-cream shadow-[-30px_0_80px_-20px_rgb(27_31_59/0.45)] outline-none md:rounded-l-[2rem]"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close
            className="absolute top-4 right-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-[0_4px_0_rgb(27_31_59/0.15)] ring-2 ring-ink/10 transition hover:rotate-90"
            aria-label="Tutup"
          >
            <X size={18} />
          </Dialog.Close>
          <div data-lenis-prevent className="relative flex-1 overflow-y-auto overscroll-contain md:rounded-l-[2rem]">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
