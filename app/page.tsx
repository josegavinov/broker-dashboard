import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar, Bell, AlertTriangle } from 'lucide-react'

async function getCitas() {
  const { data } = await supabase
    .from('citas')
    .select('*, clientes(nombre, email, telefono)')
    .order('fecha_hora', { ascending: false })
  return data || []
}

async function getRecordatorios() {
  const { data } = await supabase
    .from('recordatorios')
    .select('*, citas(fecha_hora)')
    .order('enviado_at', { ascending: false })
  return data || []
}

async function getAlertas() {
  const { data } = await supabase
    .from('alertas_seguros')
    .select('*')
    .order('detectado_at', { ascending: false })
  return data || []
}

export default async function Dashboard() {
  const [citas, recordatorios, alertas] = await Promise.all([
    getCitas(),
    getRecordatorios(),
    getAlertas()
  ])

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Panel del Broker</h1>
        <p className="text-muted-foreground mb-6">Vista general de citas, recordatorios y alertas de seguros</p>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Citas Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{citas.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recordatorios Enviados</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recordatorios.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total enviados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Seguros</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{alertas.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Próximos a vencer</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="citas">
          <TabsList className="mb-4">
            <TabsTrigger value="citas">Citas</TabsTrigger>
            <TabsTrigger value="recordatorios">Recordatorios</TabsTrigger>
            <TabsTrigger value="alertas">Alertas de Seguros</TabsTrigger>
          </TabsList>

          {/* Tab Citas */}
          <TabsContent value="citas">
            <Card>
              <CardHeader>
                <CardTitle>Citas Agendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {citas.length === 0 && (
                    <p className="text-muted-foreground text-sm">No hay citas registradas.</p>
                  )}
                  {citas.map((cita: any) => (
                    <div key={cita.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-medium">{cita.clientes?.nombre || 'Cliente'}</p>
                        <p className="text-sm text-muted-foreground">{cita.clientes?.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(cita.fecha_hora).toLocaleString('es-EC', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                      <Badge variant={
                        cita.estado === 'confirmada' ? 'default' :
                          cita.estado === 'cancelada' ? 'destructive' : 'secondary'
                      }>
                        {cita.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Recordatorios */}
          <TabsContent value="recordatorios">
            <Card>
              <CardHeader>
                <CardTitle>Recordatorios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recordatorios.length === 0 && (
                    <p className="text-muted-foreground text-sm">No hay recordatorios registrados.</p>
                  )}
                  {recordatorios.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-medium">{r.tipo}</p>
                        <p className="text-sm text-muted-foreground">{r.mensaje}</p>
                        <p className="text-sm text-muted-foreground">
                          {r.enviado_at ? new Date(r.enviado_at).toLocaleString('es-EC') : 'Pendiente'}
                        </p>
                      </div>
                      <Badge variant={
                        r.estado === 'enviado' ? 'default' :
                          r.estado === 'fallido' ? 'destructive' : 'secondary'
                      }>
                        {r.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Alertas */}
          <TabsContent value="alertas">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Seguros Próximos a Vencer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertas.length === 0 && (
                    <p className="text-muted-foreground text-sm">No hay alertas registradas.</p>
                  )}
                  {alertas.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-medium">{a.cliente_nombre || 'Cliente desconocido'}</p>
                        <p className="text-sm text-muted-foreground">{a.asunto_correo}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence: {a.fecha_vencimiento || 'No especificado'}
                        </p>
                      </div>
                      <Badge variant={
                        a.estado === 'notificado' ? 'default' :
                          a.estado === 'gestionado' ? 'secondary' : 'destructive'
                      }>
                        {a.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}