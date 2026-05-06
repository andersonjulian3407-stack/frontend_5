# Orders Frontend — Next.js + Ant Design

Frontend para la Orders REST API (Actividad 2).

## Stack
- **Next.js 14** (Pages Router)
- **Ant Design 5**
- **Axios** para llamadas HTTP
- **Day.js** para fechas

## Instalación

```bash
cd orders-frontend
npm install
```

## Desarrollo

Primero asegúrate de que el backend esté corriendo en `http://localhost:3000`.

```bash
# Terminal 1 — Backend
cd ..
npm run dev

# Terminal 2 — Frontend
cd orders-frontend
npm run dev
```

El frontend corre en **http://localhost:3001**.

## Variables de entorno

Edita `.env.local` si tu API corre en otro puerto:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/` | Dashboard — resumen de pedidos, ingresos, productos |
| `/orders` | Listado con búsqueda, filtros y paginación |
| `/orders/[id]` | Detalle de pedido |
| `/orders/new` | Crear pedido |
| `/orders/[id]/edit` | Editar pedido |
| `/products` | Gestión de productos |
| `/health` | Estado del sistema + casos de prueba |
