
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


export default function ConfiguracionIaPage() {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [forwardingNumber, setForwardingNumber] = useState("");
  const [notificationTemplate, setNotificationTemplate] = useState("");

  const handleSaveGeminiConfig = () => {
    // TODO: Implement saving Gemini API configuration
    console.log("Saving Gemini API config:", { geminiApiKey, isAiEnabled });
  };

  const handleSaveBehaviorConfig = () => {
    // TODO: Implement saving AI behavior configuration
    console.log("Saving AI behavior config:", { forwardingNumber, notificationTemplate });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Configuración de IA</h1>
      <p>Administra y configura las funcionalidades de Inteligencia Artificial.</p>

      {/* Gemini API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de la API de Google Gemini</CardTitle>
          <CardDescription>Configura tu clave API de Google Gemini para las capacidades del asistente de IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-api-key">Clave de API</Label>
            <Input
              id="gemini-api-key"
              placeholder="Ingresa tu clave API de Google Gemini"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Puedes obtener tu clave API en{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google AI Studio
              </a>
            </p>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enable-ai">Habilitar el Asistente de IA</Label>
            <Switch
              id="enable-ai"
              checked={isAiEnabled}
              onCheckedChange={setIsAiEnabled}
            />
          </div>
          <Button onClick={handleSaveGeminiConfig}>Guardar configuración de la API</Button>
        </CardContent>
      </Card>

      {/* AI Behavior Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Comportamiento de la IA</CardTitle>
          <CardDescription>Define cómo interactuará el asistente de IA y a dónde enviará las notificaciones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forwarding-number">Número para reenviar avisos</Label>
            <Input
              id="forwarding-number"
              placeholder="Ej. +1234567890"
              value={forwardingNumber}
              onChange={(e) => setForwardingNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-template">Plantilla de mensaje de aviso</Label>
            <Textarea
              id="notification-template"
              placeholder="Escribe la plantilla del mensaje de aviso aquí..."
              value={notificationTemplate}
              onChange={(e) => setNotificationTemplate(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={handleSaveBehaviorConfig}>Guardar configuración de comportamiento</Button>
        </CardContent>
      </Card>
    </div>
  );
}
