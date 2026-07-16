# Logística Inversa — Frontend

Frontend en **React 18 + TypeScript**, construido con **Vite** y **Tailwind CSS**. Consume la API expuesta por el [backend](../PortafolioProject-LogisticaInversa-backend) (API Gateway) para la gestión de devoluciones (clientes, almacén y administración).

## Requisitos previos

- **Node.js 18+**
- **Yarn** (el proyecto usa `yarn.lock`; si no lo tenés: `npm install -g yarn`)
- El [backend](../PortafolioProject-LogisticaInversa-backend) corriendo (al menos el `api-gateway` en `http://localhost:8080`) para que las peticiones a la API funcionen.

## Instalación

```bash
yarn install
```

## Configuración

Copiá el archivo de variables de entorno de ejemplo:

```bash
cp .env.example .env
```

| Variable        | Descripción                          | Default                 |
|-----------------|----------------------------------------|--------------------------|
| `VITE_API_URL`  | URL base del API Gateway del backend  | `http://localhost:8080` |

Si dejás `VITE_API_URL` vacío o no creás el `.env`, el frontend igual apunta a `http://localhost:8080` por defecto. Además, en desarrollo Vite ya proxea `/api/**` hacia `http://localhost:8080` (ver `vite.config.ts`), así que en la mayoría de los casos no hace falta tocar nada.

## Correr en desarrollo

Con el backend ya levantado ([ver guía](../PortafolioProject-LogisticaInversa-backend/README.md)):

```bash
yarn dev
```

Esto abre el servidor de desarrollo en http://localhost:5173 con hot-reload.

## Scripts disponibles

| Comando           | Qué hace                                                                 |
|--------------------|---------------------------------------------------------------------------|
| `yarn dev`         | Levanta el servidor de desarrollo (Vite)                                 |
| `yarn typecheck`   | Corre `tsc --noEmit` para chequear tipos sin generar archivos             |
| `yarn build`       | Typecheck + build de producción, genera la carpeta `dist/`               |
| `yarn preview`     | Sirve localmente el build de `dist/` para probarlo antes de desplegar    |

## Primer uso

No hay usuarios de prueba precargados: entrá a `/register` para crear una cuenta (`CUSTOMER` o `WAREHOUSE_STAFF`). Los usuarios `ADMIN` no se pueden crear desde el formulario público; hay que darlos de alta directamente en la base de datos de `auth-service` o vía API con el rol correspondiente.

## Estructura del proyecto

```
src/
├── api/            # Clientes Axios por dominio (auth, returns, warehouse)
├── components/      # Componentes reutilizables (common, layout, returns)
├── context/         # AuthContext (usuario logueado, login/logout)
├── pages/           # Páginas por rol: auth, customer, warehouse, admin
├── routes/          # PrivateRoute (guards por rol)
├── types.ts         # Tipos de dominio compartidos
└── utils/           # Helpers (ej. manejo de errores de Axios)
```
