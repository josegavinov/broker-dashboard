'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ShieldCheck, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PolizaForm } from './poliza-form'
import { deletePolizaAction } from '@/app/actions/polizas'
import { toast } from 'sonner'

export function PolizasManager({ initialPolizas, clientes }: {
  initialPolizas: any[]
  clientes: any[]
}) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPoliza, setSelectedPoliza] = useState<any>(null)

  const handleEdit = (poliza: any) => {
    setSelectedPoliza(poliza)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedPoliza(null)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta póliza?')) {
      const res = await deletePolizaAction(id)
      if (res.success) toast.success('Póliza eliminada')
      else toast.error('Error al eliminar')
    }
  }

  const getDiasRestantes = (fecha: string) => {
    const hoy = new Date()
    const vencimiento = new Date(fecha)
    const diff = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-slate-700">Pólizas Registradas</h4>
        <Button onClick={handleCreate} size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Nueva Póliza
        </Button>
      </div>

      <div className="space-y-3">
        {initialPolizas.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
            <ShieldCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No hay pólizas registradas.</p>
          </div>
        ) : initialPolizas.map((poliza: any) => {
          const diasRestantes = getDiasRestantes(poliza.fecha_vencimiento)
          const esUrgente = diasRestantes <= 30 && diasRestantes > 0
          const estaVencida = diasRestantes <= 0

          return (
            <div key={poliza.id} className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border transition-all group bg-white ${
              estaVencida ? 'border-red-200 bg-red-50/20' :
              esUrgente ? 'border-amber-200 bg-amber-50/20' :
              'border-slate-100 hover:border-teal-200 hover:bg-teal-50/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 ${
                  estaVencida ? 'bg-red-50 text-red-600 border-red-100' :
                  esUrgente ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-teal-50 text-teal-600 border-teal-100'
                }`}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{poliza.numero_poliza}</p>
                  <p className="text-xs text-slate-500">{poliza.clientes?.nombre || 'Cliente'}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    Vence: {new Date(poliza.fecha_vencimiento).toLocaleDateString('es-EC')}
                    {esUrgente && <span className="text-amber-600 font-semibold ml-1">({diasRestantes} días)</span>}
                    {estaVencida && <span className="text-red-600 font-semibold ml-1">(Vencida)</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                <Badge className={`text-[11px] rounded-full px-2.5 border ${
                  poliza.estado === 'activa' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                  poliza.estado === 'vencida' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {poliza.estado}
                </Badge>
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg" onClick={() => handleEdit(poliza)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(poliza.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <PolizaForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        poliza={selectedPoliza}
        clientes={clientes}
      />
    </>
  )
}