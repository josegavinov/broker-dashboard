"use client"

import { useState, useEffect, Suspense } from 'react'
import { Plus, Calendar, Clock, Mail, Phone, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CitaForm } from './cita-form'
import { deleteCitaAction } from '@/app/actions/citas'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'

export function getInitials(name: string) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase()
}

function CitasManagerInner({ citas }: { citas: any[] }) {
  const [selectedCita, setSelectedCita] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (searchParams.get('new_cita')) {
      handleCreate()
      router.replace('/')
    }
  }, [searchParams, router])

  const handleEdit = (cita: any) => {
    setSelectedCita(cita)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedCita(null)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      const result = await deleteCitaAction(id)
      if (result.success) {
        toast.success('Cita eliminada correctamente')
      } else {
        toast.error('Error al eliminar la cita')
      }
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-slate-700">Administrar Citas</h4>
        <Button onClick={handleCreate} size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Nueva Cita
        </Button>
      </div>

      <div className="space-y-3">
        {citas.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
            <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No hay citas registradas.</p>
          </div>
        ) : citas.map((cita: any) => (
          <div key={cita.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 transition-all group bg-white">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-center justify-center h-14 w-14 bg-teal-50 border border-teal-100 rounded-xl text-center group-hover:bg-teal-100 transition-colors">
                <span className="text-[10px] uppercase font-bold text-teal-500">
                  {isMounted ? new Date(cita.fecha_hora).toLocaleString('es-EC', {  month: 'short' }) : '--'}
                </span>
                <span className="text-xl font-extrabold text-teal-700 leading-none">
                  {isMounted ? new Date(cita.fecha_hora).toLocaleString('es-EC', { day: 'numeric' }) : '--'}
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                {getInitials(cita.clientes?.nombre || 'NA')}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{cita.clientes?.nombre || 'Cliente'}</p>
                <div className="flex flex-wrap gap-x-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{cita.clientes?.email}</span>
                  {cita.clientes?.telefono && cita.clientes.telefono !== 'sin-telefono' && (
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{cita.clientes.telefono}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-end md:items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {isMounted ? new Date(cita.fecha_hora).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
                <Badge className={`text-[11px] rounded-full px-2.5 border ${
                  cita.estado === 'confirmada' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                  cita.estado === 'cancelada' ? 'bg-red-50 text-red-700 border-red-200' :
                  cita.estado === 'completada' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {cita.estado}
                </Badge>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg" onClick={() => handleEdit(cita)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(cita.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CitaForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen} 
        cita={selectedCita} 
      />
    </>
  )
}

export function CitasManager({ citas }: { citas: any[] }) {
  return (
    <Suspense fallback={<div>Cargando administrador de citas...</div>}>
      <CitasManagerInner citas={citas} />
    </Suspense>
  )
}
