
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  UsersRound,
  Send,
  Mailbox,
  MessageSquare,
  FileText,
  Wand2,
  Settings,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/salpicadero', icon: LayoutDashboard, label: 'Salpicadero' },
  { href: '/sesiones', icon: UsersRound, label: 'Sesiones' },
  { href: '/enviar-mensaje', icon: Send, label: 'Enviar Mensaje' },
  { href: '/mensajes-masivos', icon: Mailbox, label: 'Mensajes Masivos' },
  { href: '/conversaciones', icon: MessageSquare, label: 'Conversaciones con Clientes' },
  { href: '/documentacion-api', icon: FileText, label: 'Documentación de la API' },
  { href: '/configuracion-ia', icon: Wand2, label: 'Configuración de IA' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/salpicadero"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Bot className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">WhatsApp API</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname === item.href && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings" // Example settings route
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Ajustes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Ajustes</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
