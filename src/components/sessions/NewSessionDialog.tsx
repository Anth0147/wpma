
'use client';

import { useState, type FormEvent } from 'react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NewSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession: (sessionName: string) => Promise<void>; // Make it async
}

export function NewSessionDialog({ open, onOpenChange, onCreateSession }: NewSessionDialogProps) {
  const [sessionName, setSessionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre de la sesión no puede estar vacío.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await onCreateSession(sessionName.trim());
      setSessionName('');
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      console.error("Failed to create session:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nueva sesión</DialogTitle>
            <DialogDescription>
              Crear una nueva sesión de WhatsApp con un nombre único.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sessionName" className="text-right">
                Nombre
              </Label>
              <Input
                id="sessionName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="col-span-3"
                placeholder="ej., Cuenta de empresa"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading || !sessionName.trim()}
            >
              {isLoading ? "Creando..." : "Crear sesión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
