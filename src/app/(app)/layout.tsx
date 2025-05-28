
import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Settings, Bell, UserCircle2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile sidebar toggle can be added here if needed */}
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Label htmlFor="ai-assistant-toggle" className="text-sm font-medium">Asistente de IA</Label>
            <Switch id="ai-assistant-toggle" />
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificaciones</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <UserCircle2 className="h-5 w-5" />
            <span className="sr-only">Perfil</span>
          </Button>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
