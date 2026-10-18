SALÓN DE BELLEZA - SPA | Programación Web - UIS 2026-II | Fase I
Integrantes: Isabel Sofía García Joya, María Camila Cervera Rey,
             Nicolás Alberto Arciniegas Rincón

REQUISITOS
- Node.js 22 LTS (mínimo 20.19). Verificar con:  node -v
- Conexión a internet (solo para instalar dependencias)

EJECUCIÓN EN COMPUTADOR LOCAL
1. Descomprimir el .zip y abrir una terminal dentro de la carpeta 03_salon
2. Instalar dependencias:     npm install
3. Iniciar el servidor:       npm run dev
4. Abrir en el navegador la URL que muestra la terminal
   (normalmente http://localhost:5173)

NOTA PARA WINDOWS
Si PowerShell indica que no se permite ejecutar scripts, abrir
PowerShell como administrador y ejecutar:
   Set-ExecutionPolicy RemoteSigned
Cerrar la terminal, abrirla de nuevo y repetir el paso 3.
No abrir index.html con doble clic: la app solo funciona con npm run dev.

PRUEBA DEL LOGIN (simulado, sin base de datos)
Botón "Iniciar sesión" > Usuario: Admin | Contraseña: 1234
y resolver la suma de verificación (captcha).
Al ingresar aparece "Mi panel" (ruta privada /panelPrivado).
Si se escribe /panelPrivado en la barra de direcciones sin haber
iniciado sesión, el sistema redirige al inicio.

RUTAS
Públicas:  /  /contacto  /servicios/manicura  /servicios/peluqueria
           /servicios/maquillaje  /servicios/spa  /servicios/depilacion
Privada:   /panelPrivado

VERSIÓN EN LA NUBE (RESPALDO)
Si la aplicación no puede ejecutarse en local, está publicada en:
   <https://05-salon.vercel.app/>
Repositorio GitHub (código fuente):
   <https://github.com/Mcamilacr/05_salon.git>

