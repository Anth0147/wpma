
"use client";

import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadCloud } from 'lucide-react';

export default function MensajesMasivosPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [schedulingOption, setSchedulingOption] = useState('immediate'); // 'immediate' or 'scheduled'
  const [messagesPerMinute, setMessagesPerMinute] = useState('10');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleStartCampaign = () => {
    // Implement campaign start logic here
    console.log("Starting campaign with:", {
      selectedFile,
      messageTemplate,
      campaignName,
      selectedSession,
      schedulingOption,
      messagesPerMinute,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Mensajes Masivos</h1>
      <p className="text-muted-foreground">Envía mensajes a múltiples contactos a la vez.</p>

      {/* Alert for inactive sessions */}
      <Alert variant="destructive">
        <AlertTitle>¡No hay sesiones activas!</AlertTitle>
        <AlertDescription>
          Debes conectar al menos una sesión de WhatsApp antes de crear campañas. Ve a la página <a href="/sesiones" className="underline">Sesiones</a> para configurar una conexión.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Campaign Section */}
        <Card>
          <CardHeader>
            <CardTitle>Nueva campaña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contact-list">Subir lista de contactos</Label>
              <p className="text-sm text-muted-foreground">Sube un archivo CSV con tus contactos</p>
              <div className="flex items-center space-x-2">
                <Input id="contact-list" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                <Label htmlFor="contact-list" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <UploadCloud className="h-5 w-5 mr-2" />
                  Seleccionar archivo CSV
                </Label>
                {selectedFile && <span className="text-sm text-muted-foreground">{selectedFile.name}</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">El archivo CSV debe incluir columnas para el nombre y el número de teléfono. Los números de teléfono deben incluir el código de país (por ejemplo, +1234567890).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-template">Plantilla de mensaje</Label>
              <p className="text-sm text-muted-foreground">Tu mensaje:</p>
              <Textarea
                id="message-template"
                placeholder="Escribe tu mensaje aquí. Usa {{nombre}} para personalizar."
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Campaign Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de la campaña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nombre de la campaña</Label>
              <Input id="campaign-name" placeholder="Introduce un nombre para tu campaña" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-session">Sesión de WhatsApp</Label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger id="whatsapp-session">
                  <SelectValue placeholder="Seleccionar una sesión" />
                </SelectTrigger>
                <SelectContent>
                  {/* Replace with actual sessions */}
                  <SelectItem value="session1">Sesión 1</SelectItem>
                  <SelectItem value="session2">Sesión 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Planificación</Label>
              <RadioGroup value={schedulingOption} onValueChange={setSchedulingOption} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="schedule-immediate" />
                  <Label htmlFor="schedule-immediate">Enviar de inmediato</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="schedule-scheduled" />
                  <Label htmlFor="schedule-scheduled">Programar para más tarde</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="messages-per-minute">Mensajes por minuto</Label>
              <Input id="messages-per-minute" type="number" value={messagesPerMinute} onChange={(e) => setMessagesPerMinute(e.target.value)} min="1" />
              <p className="text-xs text-muted-foreground">10 mensajes/minuto (recomendado)</p>
            </div>

            <Button className="w-full" onClick={handleStartCampaign}>Iniciar campaña ahora</Button>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vista previa de la campaña</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Los detalles de la campaña se mostrarán aquí después de la configuración.</p>
          {/* Implement campaign preview logic here */}
        </CardContent>
      </Card>

      {/* My Campaigns Section (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aquí se listarán tus campañas anteriores.</p>
          {/* Implement list of campaigns here */}
        </CardContent>
      </Card>
    </div>
  );
}
