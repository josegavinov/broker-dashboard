'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function solicitarReenvioAction(
  citaId: string,
  mensajeOriginal: string
) {
  const { error } = await supabase
    .from('recordatorios')
    .insert({
      cita_id: citaId,
      tipo: 'reenvio',
      estado: 'pendiente',
      mensaje: mensajeOriginal,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}