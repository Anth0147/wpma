
'use client';

import type { WhatsAppSession } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Trash2, Power, PowerOff } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; // For Spanish date formatting

interface SessionCardProps {
  session: WhatsAppSession;
  onScanQR: () => void;
  onDelete: () => void;
}

export function SessionCard({ session, onScanQR, onDelete }: SessionCardProps) {
  const formattedDate = format(parseISO(session.createdAt), "dd/MM/yyyy 'a las' HH:mm:ss", { locale: es });

  const getStatusBadgeVariant = () => {
    switch (session.status) {
      case 'conectado':
        return 'default'; // Default is primary color (purple)
      case 'desconectado':
        return 'destructive';
      case 'escaneando_qr':
        return 'secondary'; // A lighter purple or distinct color
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getStatusIcon = () => {
    switch (session.status) {
      case 'conectado':
        return <Power className="h-4 w-4 mr-1.5" />;
      case 'desconectado':
        return <PowerOff className="h-4 w-4 mr-1.5" />;
      case 'escaneando_qr':
        return <QrCode className="h-4 w-4 mr-1.5" />; // Or a specific scanning icon
      case 'error':
        return <PowerOff className="h-4 w-4 mr-1.5 text-destructive-foreground" />; // Example
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg border-border">
      <CardHeader className="pb-4 relative">
        <CardTitle className="text-xl font-semibold text-primary truncate">{session.name}</CardTitle>
        <CardDescription className="text-xs">Creado el {formattedDate}</CardDescription>
        <Badge 
          variant={getStatusBadgeVariant()} 
          className="absolute top-4 right-4 text-xs px-2 py-1 flex items-center"
        >
          {getStatusIcon()}
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm py-4">
        <div>
          <span className="font-medium text-muted-foreground">IDENTIFICACIÓN:</span>
          <p className="text-foreground truncate">{session.id}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Teléfono:</span>
          <p className="text-foreground">{session.phoneNumber || 'No disponible'}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex justify-end space-x-2 border-t">
        <Button variant="outline" onClick={onScanQR} size="sm" className="text-sm">
          <QrCode className="mr-2 h-4 w-4" /> Escanear QR
        </Button>
        <Button variant="destructive" onClick={onDelete} size="sm" className="text-sm">
          <Trash2 className="mr-2 h-4 w-4" /> Borrar
        </Button>
      </CardFooter>
    </Card>
  );
}
