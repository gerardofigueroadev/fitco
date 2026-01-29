# Notes App (Full Stack)

Aplicación web para gestionar notas personales. Incluye autenticación y operaciones básicas sobre una libreta de notas.

## Funcionalidades
- Autenticación (Login)
- Crear notas
- Editar notas
- Listar notas

## Stack
- **Backend:** NestJS + PostgreSQL + Prisma  
- **Frontend:** Angular  
- **Testing:** Jest + Supertest (backend)

---

## Estructura del repositorio
```
/back     -> API NestJS
/front    -> App Angular
```

---

## Requisitos
- Node.js **v18**
- PostgreSQL (local o Docker)

---

## Backend (NestJS)

### 1) Instalación
```bash
cd back
npm install
```

### 2) Variables de entorno
Crear `back/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
JWT_SECRET="cambia_este_secreto"
PORT=3000
```

### 3) Migraciones
```bash
npm run prisma:migrate
```

### 4) Levantar API
```bash
npm run start:dev
```

API en: `http://localhost:3000`

### Tests (Backend)
```bash
# Unit tests
npm run test

# Integration tests (API)
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## Frontend (Angular)

### 1) Instalación
```bash
cd front
npm install
```

### 2) Configuración de API
Configurar la URL del backend en `front/src/environments/environment.ts` (recomendado):

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

### 3) Levantar app Angular
```bash
ng serve
```

Frontend en: `http://localhost:4200`

### Tests (Frontend)
```bash
ng test
```

---

## Ejecutar todo (rápido)
En dos terminales:

**Terminal 1**
```bash
cd back
npm run start:dev
```

**Terminal 2**
```bash
cd front
ng serve
```

---

## Tip de verificación rápida
1. Abre `http://localhost:4200`
2. Inicia sesión
3. Crea una nota y verifica que aparezca en el listado
