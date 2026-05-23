'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createPolizaAction(data: {
  clienteId: string
  numeroPoliza: string
  fechaVencimiento: string
  estado: string
}) {
  try {
    const { error } = await supabase
      .from('polizas')
      .insert({
        cliente_id: data.clienteId,
        numero_poliza: data.numeroPoliza,
        fecha_vencimiento: data.fechaVencimiento,
        estado: data.estado || 'activa'
      })

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updatePolizaAction(id: string, data: {
  numeroPoliza: string
  fechaVencimiento: string
  estado: string
}) {
  try {
    const { error } = await supabase
      .from('polizas')
      .update({
        numero_poliza: data.numeroPoliza,
        fecha_vencimiento: data.fechaVencimiento,
        estado: data.estado
      })
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deletePolizaAction(id: string) {
  try {
    const { error } = await supabase
      .from('polizas')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}