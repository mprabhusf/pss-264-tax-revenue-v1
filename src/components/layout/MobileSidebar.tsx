import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import type { NavKey } from "./navConfig";
import { Sidebar } from "./Sidebar";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
  active: NavKey;
  onNavigate: (key: NavKey) => void;
};

export function MobileSidebar({
  open,
  onClose,
  active,
  onNavigate,
}: MobileSidebarProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-stone-900/35 backdrop-blur-[2px] data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex w-full max-w-xs">
        <DialogPanel
          transition
          className="flex h-full w-full max-w-xs transform flex-col bg-white shadow-xl transition data-closed:-translate-x-full"
        >
          <Sidebar
            active={active}
            onNavigate={(k) => {
              onNavigate(k);
              onClose();
            }}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
