# 🛡️ Broker de Seguros — Dashboard de Automatización

Sistema SaaS de automatización para brokers de seguros. Gestiona citas, recordatorios automáticos vía WhatsApp y alertas de pólizas próximas a vencer.

## ✨ Características

- 📅 **Agendamiento de citas** — desde el dashboard o directamente por WhatsApp con IA
- 💬 **Notificaciones automáticas** — confirmaciones y recordatorios 24h antes vía WhatsApp
- 🛡️ **Gestión de pólizas** — alertas automáticas 30 días antes del vencimiento
- 📊 **Dashboard en tiempo real** — vista completa de citas, recordatorios y alertas
- 🤖 **IA integrada** — extracción inteligente de datos desde mensajes de WhatsApp

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 + Tailwind CSS + shadcn/ui |
| Base de datos | Supabase (PostgreSQL) |
| Automatización | n8n (self-hosted en Railway) |
| WhatsApp | Twilio API |
| IA | OpenRouter (GPT-4o-mini) |
| Deploy | Vercel |

## 🔄 Flujos Automatizados
Flujo 2 → Pólizas por vencer    → WhatsApp al broker (diario)
Flujo 3 → Cita agendada         → WhatsApp de confirmación (cada minuto)
Flujo 4 → Recordatorio 24h      → WhatsApp al cliente (cada hora)
Flujo 5 → Mensaje WhatsApp      → IA agenda la cita automáticamente

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- Cuenta en Supabase
- Cuenta en Twilio
- n8n desplegado en Railway
- Cuenta en OpenRouter

### Variables de entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### Instalación local

```bash
git clone https://github.com/tu-usuario/broker-dashboard
cd broker-dashboard
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🗄️ Estructura de Base de Datos

| Tabla | Descripción |
|---|---|
| clientes | Datos de clientes registrados |
| citas | Citas agendadas con estado y origen |
| recordatorios | Log de mensajes enviados |
| alertas_seguros | Alertas de pólizas detectadas |
| polizas | Pólizas activas con fecha de vencimiento |

## 📁 Estructura del Proyecto
| Ruta | Descripción |
|---|---|
| app/page.tsx | Dashboard principal |
| app/layout.tsx | Layout con sidebar y header |
| app/actions/citas.ts | Server actions de citas |
| app/actions/recordatorios.ts | Server actions de recordatorios |
| app/actions/polizas.ts | Server actions de pólizas |
| components/citas/ | Gestión de citas |
| components/recordatorios/ | Gestión de recordatorios |
| components/alertas/ | Gestión de alertas |
| components/polizas/ | Gestión de pólizas |
| lib/supabase.ts | Cliente Supabase |
## 👨‍💻 Desarrollado por

Jose Gaviño — [GitHub](https://github.com/josegavinov)