'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createPolizaAction, updatePolizaAction } from '@/app/actions/polizas'
import { toast } from 'sonner'

export function PolizaForm({ isOpen, setIsOpen, poliza, clientes }: {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  poliza?: any
  clientes: any[]
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    clienteId: '',
    numeroPoliza: '',
    fechaVencimiento: '',
    estado: 'activa'
  })

  useEffect(() => {
    if (poliza) {
      setFormData({
        clienteId: poliza.cliente_id || '',
        numeroPoliza: poliza.numero_poliza || '',
        fechaVencimiento: poliza.fecha_vencimiento || '',
        estado: poliza.estado || 'activa'
      })
    } else {
      setFormData({ clienteId: '', numeroPoliza: '', fechaVencimiento: '', estado: 'activa' })
    }
  }, [poliza, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (poliza) {
        const res = await updatePolizaAction(poliza.id, {
          numeroPoliza: formData.numeroPoliza,
          fechaVencimiento: formData.fechaVencimiento,
          estado: formData.estado
        })
        if (res.success) { toast.success('Póliza actualizada'); setIsOpen(false) }
        else toast.error(res.error || 'Error al actualizar')
      } else {
        const res = await createPolizaAction(formData)
        if (res.success) { toast.success('Póliza creada'); setIsOpen(false) }
        else toast.error(res.error || 'Error al crear')
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{poliza ? 'Editar Póliza' : 'Nueva Póliza'}</DialogTitle>
          <DialogDescription>
            {poliza ? 'Actualiza los datos de la póliza.' : 'Registra una nueva póliza para un cliente.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={formData.clienteId} onValueChange={(val) => setFormData({...formData, clienteId: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Número de Póliza</Label>
            <Input
              required
              value={formData.numeroPoliza}
              onChange={(e) => setFormData({...formData, numeroPoliza: e.target.value})}
              placeholder="Ej. POL-001"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de Vencimiento</Label>
            <Input
              type="date"
              required
              value={formData.fechaVencimiento}
              onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={formData.estado} onValueChange={(val) => setFormData({...formData, estado: val})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
                <SelectItem value="renovada">Renovada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}