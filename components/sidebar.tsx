"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  AlertTriangle, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Panel Principal', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '#clientes', icon: Users, badge: '12' },
    { name: 'Calendario / Citas', href: '#citas', icon: Calendar },
    { name: 'Recordatorios', href: '#recordatorios', icon: Bell },
    { name: 'Alertas de Seguros', href: '#alertas', icon: AlertTriangle, badge: '3', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { name: 'Pólizas y Seguros', href: '#polizas', icon: ShieldCheck },
    { name: 'Configuración', href: '#configuracion', icon: Settings },
  ]

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 shadow-lg hover:bg-slate-800 transition-all duration-200 focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-45 flex flex-col w-64 bg-slate-950 text-slate-200 border-r border-slate-900 transition-all duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        {/* Branding & Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-md shadow-teal-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
              <div className="absolute inset-0 rounded-xl bg-teal-400/20 blur-[2px] -z-10 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Broker Seguros
              </span>
              <span className="block text-xs font-semibold text-teal-400 tracking-wider uppercase -mt-0.5">
                Dashboard v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade / Pro Accent card */}
        {/* <div className="px-4 py-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-950/40 via-emerald-950/30 to-slate-950 p-4 border border-teal-900/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-teal-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-teal-400" />
                Premium Activo
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium">Pro</span>
            </div>
            <p className="text-[11px] text-slate-400">Acceso ilimitado a alertas y recordatorios automáticos.</p>
          </div>
        </div> */}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-teal-600/90 to-emerald-600/90 text-white shadow-md shadow-teal-600/10" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-110 duration-200",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-teal-400"
                  )} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    item.badgeColor || "bg-slate-900 text-slate-300 border-slate-800 group-hover:border-slate-700"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Profile Section */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold text-sm">
                JG
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-slate-950" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">Jose Gaviño</p>
                <p className="text-[10px] text-slate-400 truncate">jose@broker.com</p>
              </div>
            </div>
            <button 
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
