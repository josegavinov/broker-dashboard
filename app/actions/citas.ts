"use server"

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createCitaAction(data: {
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  fechaHora: string;
  estado: string;
}) {
  try {
    // 1. Verificar si el cliente existe por email
    let clienteId;
    const { data: existingClient } = await supabase
      .from('clientes')
      .select('id')
      .eq('email', data.clienteEmail)
      .single()

    if (existingClient) {
      clienteId = existingClient.id;
      // Actualizar datos del cliente si es necesario
      
    } else {
      // Crear nuevo cliente
      const { data: newClient, error: clientError } = await supabase
        .from('clientes')
        .insert({
          nombre: data.clienteNombre,
          email: data.clienteEmail,
          telefono: data.clienteTelefono || 'sin-telefono'
        })
        .select()
        .single()
      
      if (clientError) throw new Error(`Error al crear cliente: ${clientError.message}`)
      clienteId = newClient.id;
    }

    // 2. Crear cita
    const { data: citaInsertada, error: citaError } = await supabase
      .from('citas')
      .insert({
        cliente_id: clienteId,
        fecha_hora: data.fechaHora +':00-05:00', // Ajuste para zona horaria de Ecuador
        estado: data.estado || 'enviado'
      })
      .select()
      .single()
      // 3. Crear recordatorio automático
    await supabase
      .from('recordatorios')
      .insert({
        cita_id: citaInsertada.id,
        tipo: 'confirmacion',
        estado: 'pendiente',
        mensaje: `Hola ${data.clienteNombre}, tienes una cita confirmada para el ${new Date(data.fechaHora).toLocaleString('es-EC', { dateStyle: 'full', timeStyle: 'short' })}. ¡Te esperamos!`
      })

    if (citaError) throw new Error(`Error al crear cita: ${citaError.message}`)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateCitaAction(
  citaId: string, 
  data: {
    fechaHora: string;
    estado: string;
    clienteId: string;
    clienteNombre: string;
    clienteEmail: string;
    clienteTelefono: string;
  }
) {
  try {
    // 1. Actualizar datos del cliente
    const { error: clientError } = await supabase
      .from('clientes')
      .update({
        nombre: data.clienteNombre,
        email: data.clienteEmail,
        telefono: data.clienteTelefono
      })
      .eq('id', data.clienteId)

    if (clientError) throw new Error(`Error al actualizar cliente: ${clientError.message}`)

    // 2. Actualizar cita
    const { error: citaError } = await supabase
      .from('citas')
      .update({
        fecha_hora: data.fechaHora,
        estado: data.estado
      })
      .eq('id', citaId)

    if (citaError) throw new Error(`Error al actualizar cita: ${citaError.message}`)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteCitaAction(id: string) {
  try {
    const { error } = await supabase
      .from('citas')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Error al eliminar cita: ${error.message}`)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
