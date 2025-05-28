
'use client';

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface QrCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionName: string;
  qrCodeUrl: string;
}

export function QrCodeModal({ open, onOpenChange, sessionName, qrCodeUrl }: QrCodeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escanear Código QR para "{sessionName}"</DialogTitle>
          <DialogDescription>
            Usa WhatsApp en tu teléfono para escanear este código.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-4">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt={`Código QR para la sesión ${sessionName}`}
              width={256}
              height={256}
              data-ai-hint="qr code"
              className="rounded-lg border border-border shadow-md"
            />
          ) : (
            <p className="text-muted-foreground">No se pudo cargar el código QR.</p>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
