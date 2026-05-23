"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createCitaAction, updateCitaAction } from '@/app/actions/citas'
import { toast } from 'sonner'

export function CitaForm({ isOpen, setIsOpen, cita }: { isOpen: boolean, setIsOpen: (val: boolean) => void, cita?: any }) {
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteEmail: '',
    clienteTelefono: '',
    fechaHora: '',
    estado: 'confirmada'
  })

  useEffect(() => {
    if (cita) {
      const dateObj = new Date(cita.fecha_hora)
      dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
      const formattedDate = dateObj.toISOString().slice(0, 16)

      setFormData({
        clienteNombre: cita.clientes?.nombre || '',
        clienteEmail: cita.clientes?.email || '',
        clienteTelefono: cita.clientes?.telefono === 'sin-telefono' ? '' : (cita.clientes?.telefono || ''),
        fechaHora: formattedDate,
        estado: cita.estado || 'confirmada'
      })
    } else {
      setFormData({
        clienteNombre: '',
        clienteEmail: '',
        clienteTelefono: '',
        fechaHora: '',
        estado: 'confirmada'
      })
    }
  }, [cita, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const submissionData = {
        ...formData,
        fechaHora: formData.fechaHora
      }

      if (cita) {
        const res = await updateCitaAction(cita.id, {
          ...submissionData,
          clienteId: cita.clientes?.id
        })
        if (res.success) {
          toast.success('Cita actualizada correctamente')
          setIsOpen(false)
        } else {
          toast.error(res.error || 'Error al actualizar cita')
        }
      } else {
        const res = await createCitaAction(submissionData)
        if (res.success) {
          toast.success('Cita agendada correctamente')
          setIsOpen(false)
        } else {
          toast.error(res.error || 'Error al agendar cita')
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{cita ? 'Editar Cita' : 'Agendar Nueva Cita'}</DialogTitle>
          <DialogDescription>
            {cita ? 'Actualiza los datos de la cita y del cliente.' : 'Ingresa los datos para programar una nueva cita con el cliente.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="clienteNombre">Nombre del Cliente</Label>
            <Input 
              id="clienteNombre" 
              required 
              value={formData.clienteNombre}
              onChange={(e) => setFormData({...formData, clienteNombre: e.target.value})}
              placeholder="Ej. Juan Pérez"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clienteEmail">Correo Electrónico</Label>
            <Input 
              id="clienteEmail" 
              type="email" 
              required 
              value={formData.clienteEmail}
              onChange={(e) => setFormData({...formData, clienteEmail: e.target.value})}
              placeholder="Ej. juan@correo.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clienteTelefono">Teléfono (Opcional)</Label>
            <Input 
              id="clienteTelefono" 
              type="tel" 
              value={formData.clienteTelefono}
              onChange={(e) => setFormData({...formData, clienteTelefono: e.target.value})}
              placeholder="Ej. +593 99 999 9999"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fechaHora">Fecha y Hora</Label>
            <Input 
              id="fechaHora" 
              type="datetime-local" 
              required 
              value={formData.fechaHora}
              onChange={(e) => setFormData({...formData, fechaHora: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select 
              value={formData.estado} 
              onValueChange={(val) => setFormData({...formData, estado: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
              {loading ? 'Guardando...' : 'Guardar Cita'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
