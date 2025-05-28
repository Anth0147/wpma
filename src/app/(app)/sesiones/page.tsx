
'use client';

import { useState } from 'react';
import type { WhatsAppSession } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SessionCard } from '@/components/sessions/SessionCard';
import { NewSessionDialog } from '@/components/sessions/NewSessionDialog';
import { QrCodeModal } from '@/components/sessions/QrCodeModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const initialSessions: WhatsAppSession[] = [
  {
    id: 'session_1748443190814_878',
    name: 'como',
    createdAt: new Date(2025, 4, 28, 9, 39, 50).toISOString(), // Month is 0-indexed (4 = May)
    status: 'desconectado',
    phoneNumber: 'No conectado',
  },
  {
    id: 'session_another_example_123',
    name: 'Cuenta de Empresa',
    createdAt: new Date().toISOString(),
    status: 'conectado',
    phoneNumber: '+1234567890',
  },
];

export default function SesionesPage() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>(initialSessions);
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [selectedSessionForQr, setSelectedSessionForQr] = useState<WhatsAppSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<WhatsAppSession | null>(null);
  const { toast } = useToast();

  const handleCreateSession = async (sessionName: string) => {
    // In a real app, this would call the backend API
    const newSession: WhatsAppSession = {
      id: `session_${Date.now()}`,
      name: sessionName,
      createdAt: new Date().toISOString(),
      status: 'desconectado',
      phoneNumber: 'No conectado', // Initial state
    };
    setSessions(prevSessions => [newSession, ...prevSessions]);
    toast({
      title: "Sesión creada",
      description: `La sesión "${sessionName}" ha sido creada.`,
    });
    return Promise.resolve();
  };

  const handleOpenDeleteConfirm = (session: WhatsAppSession) => {
    setSessionToDelete(session);
  };

  const handleDeleteSession = () => {
    if (sessionToDelete) {
      // In a real app, this would call the backend API
      setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionToDelete.id));
      toast({
        title: "Sesión eliminada",
        description: `La sesión "${sessionToDelete.name}" ha sido eliminada.`,
        variant: "destructive"
      });
      setSessionToDelete(null);
    }
  };

  const handleScanQr = (session: WhatsAppSession) => {
    // In a real app, you might fetch a new QR code if status is 'desconectado'
    // or show current QR if status is 'escaneando_qr'
    const qrUrl = session.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(`session_id:${session.id}`)}`;
    setSelectedSessionForQr({...session, qrCodeUrl: qrUrl});
    setIsQrCodeModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Sesiones de WhatsApp</h1>
        <Button onClick={() => setIsNewSessionDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-5 w-5" /> Nueva sesión
        </Button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No hay sesiones activas. Crea una nueva para empezar.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onScanQR={() => handleScanQr(session)}
              onDelete={() => handleOpenDeleteConfirm(session)}
            />
          ))}
        </div>
      )}

      <NewSessionDialog
        open={isNewSessionDialogOpen}
        onOpenChange={setIsNewSessionDialogOpen}
        onCreateSession={handleCreateSession}
      />

      {selectedSessionForQr && (
        <QrCodeModal
          open={isQrCodeModalOpen}
          onOpenChange={setIsQrCodeModalOpen}
          sessionName={selectedSessionForQr.name}
          qrCodeUrl={selectedSessionForQr.qrCodeUrl || ''}
        />
      )}

      {sessionToDelete && (
        <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de que quieres borrar la sesión "{sessionToDelete.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la sesión.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSessionToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSession} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Borrar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
