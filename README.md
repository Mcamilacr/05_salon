# Salón de Belleza - SPA

Proyecto de Programación Web - UIS 2026-II, subgrupo 05.

- `frontEnd/`: Fase I, React + Vite + React-Bootstrap.
- `backEnd/`: Fase II, Express + MySQL (XAMPP) con API REST y login con JWT.

## Ejecutar en local

1. En XAMPP, encender MySQL y crear en phpMyAdmin el usuario `un_usr` con clave `una_clave` (privilegios globales). La base de datos y las tablas se crean solas.
2. Backend:
   ```bash
   cd backEnd
   npm install
   npm run dev
   ```
3. Frontend (otra terminal):
   ```bash
   cd frontEnd
   npm install
   npm run dev
   ```
4. Abrir http://localhost:5173

Requiere Node.js 22 LTS (mínimo 20.19). Las instrucciones completas y los usuarios de prueba están en `Readme.txt`.

## Integrantes
- Isabel Sofía García Joya
- María Camila Cervera Rey
- Nicolás Alberto Arciniegas Rincón

Nota: En GitHub no se puede poner la API key de gemini porque google lo detecta y la desactivaría, si se descarga el proyecto
desde el repositorio, no funcionará esa parte