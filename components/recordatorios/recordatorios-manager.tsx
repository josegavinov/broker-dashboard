'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { solicitarReenvioAction } from '@/app/actions/recordatorios'
import { toast } from 'sonner'

export function RecordatoriosManager({ initialRecordatorios }: { initialRecordatorios: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleReenvio = async (r: any) => {
    setLoadingId(r.id)
    const result = await solicitarReenvioAction(
      r.cita_id,
      r.mensaje || `Recordatorio de cita para ${r.citas?.clientes?.nombre || 'cliente'}`
    )
    if (result.success) {
      toast.success('Reenvío programado — n8n lo procesará en breve')
    } else {
      toast.error(result.error || 'Error al programar reenvío')
    }
    setLoadingId(null)
  }

  if (initialRecordatorios.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
        <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">No hay recordatorios registrados.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {initialRecordatorios.map((r: any) => (
        <div key={r.id} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-all">
          <div className="flex items-start gap-3">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 ${
              r.estado === 'enviado' ? 'bg-teal-50 text-teal-600 border-teal-100' :
              r.estado === 'fallido' ? 'bg-red-50 text-red-600 border-red-100' :
              'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {r.estado === 'enviado' ? <CheckCircle2 className="h-4 w-4" /> :
               r.estado === 'fallido' ? <XCircle className="h-4 w-4" /> :
               <Clock className="h-4 w-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{r.tipo}</p>
                {r.citas?.clientes?.nombre && (
                  <span className="text-xs text-slate-400">— {r.citas.clientes.nombre}</span>
                )}
              </div>
              <p className="text-sm text-slate-600">{r.mensaje}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {r.enviado_at ? new Date(r.enviado_at).toLocaleString('es-EC',{timeZone: 'America/Guayaquil'}) : 'Pendiente de envío'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={`text-[11px] rounded-full px-2.5 border ${
              r.estado === 'enviado' ? 'bg-teal-50 text-teal-700 border-teal-200' :
              r.estado === 'fallido' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {r.estado}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              disabled={loadingId === r.id}
              onClick={() => handleReenvio(r)}
              className="h-8 text-xs rounded-lg border-slate-200 hover:border-teal-200 hover:text-teal-600 hover:bg-teal-50"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loadingId === r.id ? 'animate-spin' : ''}`} />
              {loadingId === r.id ? 'Enviando...' : 'Reenviar'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}