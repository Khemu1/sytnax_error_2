import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import React from "react";

const WarningDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  message: string;
}> = ({ isOpen, onClose, message }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-[300px] max-w-md rounded-xl bg-base-300 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-red-600 text-center">
              Warning
            </span>
            <p className="mt-2 text-sm text-white font-semibold">{message}</p>
          </div>

          <div className="flex justify-center gap-5 mt-4 px-4 font-semibold text-white">
            <Link
              href={process.env.NEXT_PUBLIC_BASE_URL as string}
              className="bg-blue-600 py-2 px-4 rounded"
              type="button"
            >
              Close
            </Link>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default WarningDialog;
