'use client'

import { useState } from 'react'
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function AlertasManager({ initialAlertas }: { initialAlertas: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const handleGestionar = async (id: string) => {
    setLoadingId(id)
    const { error } = await supabase
      .from('alertas_seguros')
      .update({ estado: 'gestionado' })
      .eq('id', id)

    if (error) {
      toast.error('Error al gestionar la alerta')
    } else {
      toast.success('Alerta marcada como gestionada')
      router.refresh()
    }
    setLoadingId(null)
  }

  if (initialAlertas.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
        <ShieldCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">No hay alertas registradas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {initialAlertas.map((a: any) => (
        <div key={a.id} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all">
          <div className="flex items-start gap-3">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 ${
              a.estado === 'gestionado'
                ? 'bg-slate-100 text-slate-500 border-slate-200'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {a.estado === 'gestionado'
                ? <CheckCircle2 className="h-4 w-4" />
                : <ShieldCheck className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                {a.cliente_nombre || 'Cliente no identificado'}
              </p>
              <p className="text-xs text-teal-600 font-medium">{a.asunto_correo}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Vence: <strong className="text-slate-600">{a.fecha_vencimiento || 'No especificado'}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={`text-[11px] rounded-full px-2.5 border ${
              a.estado === 'gestionado' ? 'bg-slate-100 text-slate-600 border-slate-200' :
              a.estado === 'notificado' ? 'bg-teal-50 text-teal-700 border-teal-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {a.estado}
            </Badge>
            {a.estado !== 'gestionado' && (
              <Button
                variant="outline"
                size="sm"
                disabled={loadingId === a.id}
                onClick={() => handleGestionar(a.id)}
                className="h-8 text-xs rounded-lg bg-teal-600 text-white border-teal-600 hover:bg-teal-700 hover:border-teal-700"
              >
                {loadingId === a.id ? 'Guardando...' : 'Gestionar'}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}