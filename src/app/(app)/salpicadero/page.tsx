
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UsersRound, Mail, CheckCircle2, XCircle, Clock, MessageCircle } from 'lucide-react';

const stats = [
  { title: 'Sesiones activas', value: '0', description: 'Conexiones de WhatsApp', icon: UsersRound, color: 'text-blue-500' },
  { title: 'Total de mensajes', value: '5', description: 'Mensajes enviados', icon: Mail, color: 'text-indigo-500' },
  { title: 'Entregado', value: '4', description: 'Enviado con éxito', icon: CheckCircle2, color: 'text-green-500' },
  { title: 'Fracasado', value: '0', description: 'Error en la entrega', icon: XCircle, color: 'text-red-500' },
  { title: 'Pendiente', value: '0', description: 'A la espera de ser enviado', icon: Clock, color: 'text-yellow-500' },
  { title: 'Conversaciones activas', value: '1', description: 'Chats actuales', icon: MessageCircle, color: 'text-purple-500' },
];

export default function SalpicaderoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Salpicadero</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            iconColor={stat.color}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenido a la plataforma de pruebas de API de WhatsApp</CardTitle>
          <CardDescription>Una herramienta para probar y automatizar la mensajería de WhatsApp con Baileys y Express</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Esta plataforma le permite probar las capacidades de mensajería de WhatsApp utilizando la biblioteca no oficial de Baileys. Puede crear sesiones de WhatsApp, enviar mensajes individuales o masivos y administrar conversaciones con clientes.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Empezar</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Crear una sesión de WhatsApp en la pestaña Sesiones</li>
                <li>Escanea el código QR con tu aplicación móvil de WhatsApp</li>
                <li>Empieza a enviar mensajes o configura campañas masivas</li>
                <li>Supervise las conversaciones con los clientes</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Funciones</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Múltiples sesiones de WhatsApp</li>
                <li>Mensajería individual y masiva</li>
                <li>Importaciones de contactos CSV</li>
                <li>Gestión de conversaciones</li>
                <li>Interacciones con los clientes impulsadas por IA</li>
                <li>API completa</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
