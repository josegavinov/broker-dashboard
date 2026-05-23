import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Calendar, Bell, AlertTriangle, Clock,
  Mail, Phone, CheckCircle2, XCircle,
  ShieldCheck, TrendingUp, Activity
} from 'lucide-react'
import { PolizasManager } from '@/components/polizas/polizas-manager'
import { CitasManager } from '@/components/citas/citas-manager'
import { RecordatoriosManager } from '@/components/recordatorios/recordatorios-manager'
import { AlertasManager } from '@/components/alertas/alertas-manager'
async function getCitas() {
  const { data } = await supabase
    .from('citas')
    .select('*, clientes(id, nombre, email, telefono)')
    .order('fecha_hora', { ascending: false })
  return data || []
}

async function getRecordatorios() {
  const { data } = await supabase
    .from('recordatorios')
    .select('*, citas(fecha_hora, clientes(nombre, email))')
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
async function getPolizas() {
  const { data } = await supabase
    .from('polizas')
    .select('*, clientes(nombre)')
    .order('fecha_vencimiento', { ascending: true })
  return data || []
}

async function getClientes() {
  const { data } = await supabase
    .from('clientes')
    .select('id, nombre')
    .order('nombre', { ascending: true })
  return data || []
}

export default async function Dashboard() {
  const [citas, recordatorios, alertas, polizas, clientes] = await Promise.all([
  getCitas(), getRecordatorios(), getAlertas(), getPolizas(), getClientes()
])

  const activeCitas = citas.filter((c: any) => c.estado === 'confirmada').length
  const pendingAlerts = alertas.filter((a: any) => a.estado !== 'gestionado').length
  const successReminders = recordatorios.filter((r: any) => r.estado === 'enviado').length

  return (
    <div className="space-y-6">

      {/* Hero Banner */}
      {/* <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white p-6 md:p-8 shadow-lg">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 -mr-20 -mt-20" />
        <div className="absolute right-24 bottom-0 h-40 w-40 rounded-full bg-white/5 -mb-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Sistema Activo</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Panel de Control — Broker Seguros
          </h2>
          <p className="text-teal-100 text-sm max-w-xl">
            Tienes <strong className="text-white">{activeCitas} citas confirmadas</strong> y{' '}
            <strong className="text-yellow-300">{pendingAlerts} alertas pendientes</strong> que requieren atención.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium">
              <Activity className="h-3.5 w-3.5 text-emerald-300" />
              Automatizaciones activas
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Alertas en tiempo real
            </div>
          </div>
        </div>
      </div> */}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-teal-100 shadow-sm hover:shadow-md transition-all rounded-2xl group p-0 gap-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Citas Agendadas</p>
                <p className="text-4xl font-extrabold text-slate-800">{citas.length}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
              <TrendingUp className="h-3.5 w-3.5 text-teal-500" />
              <span className="font-semibold text-teal-600">{activeCitas} confirmadas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-100 shadow-sm hover:shadow-md transition-all rounded-2xl group p-0 gap-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Recordatorios</p>
                <p className="text-4xl font-extrabold text-slate-800">{recordatorios.length}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Bell className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-semibold text-emerald-600">{successReminders} enviados</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-100 shadow-sm hover:shadow-md transition-all rounded-2xl group p-0 gap-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alertas de Seguros</p>
                <p className="text-4xl font-extrabold text-slate-800">{alertas.length}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-semibold text-amber-600">{pendingAlerts} pendientes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Tabs - Left */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="citas">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Operaciones en Detalle</h3>
              <TabsList className="bg-teal-50 border border-teal-100 p-1 rounded-xl">
                <TabsTrigger value="citas" className="text-xs rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white px-4">
                  Citas
                </TabsTrigger>
                <TabsTrigger value="recordatorios" className="text-xs rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white px-4">
                  Recordatorios
                </TabsTrigger>
                <TabsTrigger value="alertas" className="text-xs rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white px-4">
                  Alertas
                </TabsTrigger>
                <TabsTrigger value="polizas" className="text-xs rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white px-4">
                  Pólizas
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Citas */}
            <TabsContent value="citas">
              <Card className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-0 gap-0">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-5 rounded-none">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-500" />
                    Citas Agendadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <CitasManager citas={citas} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Recordatorios */}
            <TabsContent value="recordatorios">
              <Card className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-0 gap-0">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-5 rounded-none">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-teal-500" />
                    Recordatorios
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <RecordatoriosManager initialRecordatorios={recordatorios} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Alertas */}
            <TabsContent value="alertas">
              <Card className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-0 gap-0">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-5 rounded-none">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Alertas de Seguros Próximos a Vencer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <AlertasManager initialAlertas={alertas} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="polizas">
              <Card className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-0 gap-0">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-5 rounded-none">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-teal-500" />
                    Pólizas Activas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <PolizasManager initialPolizas={polizas} clientes={clientes} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 space-y-4">

          {/* Alertas urgentes */}
          <Card className="border border-amber-200 rounded-2xl shadow-sm overflow-hidden p-0 gap-0">
            <CardHeader className="bg-amber-500 text-white py-4 px-5 rounded-none">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Acción Requerida
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 bg-amber-50/30">
              {alertas.filter((a: any) => a.estado !== 'gestionado').slice(0, 3).length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">Sin alertas urgentes 🎉</p>
              ) : alertas.filter((a: any) => a.estado !== 'gestionado').slice(0, 3).map((a: any) => (
                <div key={a.id} className="p-3 bg-white border border-amber-100 rounded-xl">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-slate-700 truncate max-w-[160px]">{a.cliente_nombre || 'Desconocido'}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">URGENTE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{a.asunto_correo}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Vence: {a.fecha_vencimiento || 'Inmediato'}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resumen rápido */}
          <Card className="border border-teal-100 rounded-2xl shadow-sm overflow-hidden p-0 gap-0">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-5 rounded-none">
              <CardTitle className="text-sm font-bold text-slate-700">Resumen del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { label: 'Formulario de Citas', status: 'Activo', color: 'text-teal-600 bg-teal-50 border-teal-200' },
                { label: 'Supabase DB', status: 'Online', color: 'text-teal-600 bg-teal-50 border-teal-200' },
                { label: 'n8n Workflows', status: 'Activo', color: 'text-teal-600 bg-teal-50 border-teal-200' },
                { label: 'Twilio Whatsapp', status: 'Activo', color: 'text-teal-600 bg-teal-50 border-teal-200' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">{item.label}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}