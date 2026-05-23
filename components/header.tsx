"use client"

import { Search, Bell, Sparkles, Plus, CheckCircle, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className="h-20 border-b border-slate-200/80 bg-white/75 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Breadcrumb & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-slate-800">Panel Principal</h1>
          <p className="text-xs text-slate-500">Resumen y estado de operaciones</p>
        </div>

        {/* Global Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Buscar clientes, citas, alertas..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Status, Notifications & Actions */}
      <div className="flex items-center gap-4">
        {/* Supabase connection indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium">
          <Database className="h-3.5 w-3.5 text-emerald-600" />
          <span>Supabase Conectado</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-600 ring-2 ring-white" />
        </button>

        {/* Create action button */}
        <Button asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-600/10 border-0 rounded-xl px-4 py-2 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer">
          <Link href="?new_cita=true">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Cita</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
