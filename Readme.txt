SALÓN DE BELLEZA - SPA | Programación Web - UIS 2026-II | Fase I y Fase II
Subgrupo 05
Integrantes: Isabel Sofía García Joya, María Camila Cervera Rey,
             Nicolás Alberto Arciniegas Rincón

ESTRUCTURA
  05_salon/
    frontEnd/   Fase I: aplicación React + Vite (interfaz)
    backEnd/    Fase II: servidor Express + MySQL (API REST)

REQUISITOS (instalar una sola vez)
1. Node.js 22 LTS (mínimo 20.19). Verificar con:  node -v
2. XAMPP con MySQL y phpMyAdmin.
3. Conexión a internet para instalar dependencias.

PASO 1. BASE DE DATOS (XAMPP)
1. Abrir el XAMPP Control Panel y dar Start a Apache y a MySQL.
2. Entrar a http://localhost/phpmyadmin
3. Cuentas de usuarios > Agregar cuenta de usuario:
     Nombre de usuario: un_usr
     Nombre del host: Local (localhost)
     Contraseña: una_clave
     Privilegios globales: Seleccionar todo
   > Continuar.
   NO es necesario crear la base de datos ni las tablas: el backEnd crea
   automáticamente la base de datos "salon_db", sus 4 tablas (usuarios,
   servicios, citas, archivos) y los datos de prueba la primera vez que
   se ejecuta.

PASO 2. BACKEND (primera terminal)
1. Abrir una terminal dentro de la carpeta 05_salon/backEnd
2. Instalar dependencias: npm install
3. Iniciar el servidor: npm run dev
4. Debe aparecer:  Base de datos "salon_db" lista
                   Servidor activo en http://localhost:3000
   (El archivo .env ya trae la configuración)

PASO 2B. IMÁGENES DEL SERVIDOR DE CONTENIDOS (express.static)
Poner 3 fotos de trabajos realizados en backEnd/publico/imagenes con
los nombres trabajo1.jpg, trabajo2.jpg y trabajo3.jpg.
Quedan disponibles en http://localhost:3000/imagenes/trabajo1.jpg
y se muestran en la página de inicio, sección "Trabajos realizados".

PASO 2C. ASISTENTE VIRTUAL CON IA (Google Gemini)
1. Entrar a https://aistudio.google.com/apikey con una cuenta de Google
   y crear una API key (es gratuita).
2. Abrir backEnd/.env y pegarla después de  GEMINI_API_KEY=
3. Reiniciar el backEnd (Ctrl + C y npm run dev).
Si no se configura la llave, la página funciona igual; solo el asistente
responde que no está configurado. Si Google cambia el nombre del modelo,
se ajusta en GEMINI_MODELO dentro del mismo .env.

En la implementación actual .env tiene la API key de un integrante del 
grupo (no es necesario crear otra). Si el modelo no funciona, en la terminal del backEnd aparece el 
error, si dice que el modelo no existe o que está en alta demanda, se
cambia a otro modelo de gemini disponible en google ai studio y se pone
el nombre en el .env despues de GEMINI_MODELO=.

ARCHIVOS DE EJEMPLO
La carpeta backEnd/archivosEjemplo tiene 3 fotos que se copian a
backEnd/subidas y se registran en la tabla "archivos" la primera vez que
arranca el backend (solo si esa tabla está vacía). Así la página
/archivos muestra archivos listos para descargar desde el inicio.

PASO 3. FRONTEND (segunda terminal, sin cerrar la primera)
1. Abrir otra terminal dentro de la carpeta 05_salon/frontEnd
2. Instalar dependencias:  npm install
3. Iniciar:                npm run dev
4. Abrir en el navegador http://localhost:5173

NOTA PARA WINDOWS
Si PowerShell indica que no se permite ejecutar scripts, abrir
PowerShell como administrador y ejecutar:
   Set-ExecutionPolicy RemoteSigned
Cerrar la terminal, abrirla de nuevo y repetir el comando.

USUARIOS DE PRUEBA (usuario | password)
Botón "Iniciar sesión", escribir correo, contraseña y resolver la suma.
  Administrador: admin@05salon.com | Admin2026_salon
  Personal:      mariapar@gmail.com | parramaria6879568
  Cliente:       carlosrop@gmail.com | carlosrodriguez1098
También se puede crear una cuenta de cliente con "Registrarse".

RUTAS DEL FRONTEND
Públicas (visitantes): /  /contacto  /registro  /servicios/manicura
   /servicios/peluqueria  /servicios/maquillaje  /servicios/spa
   /servicios/depilacion
Privadas (requieren login):
   /panelPrivado               redirige al panel según el rol
   /panelCliente               rol cliente
   /panelPersonal              rol personal
   /panelAdministrador         rol administrador, con:
      /panelAdministrador/crearPersonal
      /panelAdministrador/personal    (listar, buscar, modificar, eliminar)
      /panelAdministrador/clientes    (listar, buscar, modificar, eliminar)
      /panelAdministrador/servicios   (listar, buscar, crear, modificar, eliminar)
   /citas      cliente: agenda y cancela | personal: cambia estado
               administrador: crea, modifica y elimina
   /archivos   (personal y administrador) subir, descargar, buscar,
               modificar y eliminar archivos. Trae 3 fotos de ejemplo.

API REST DEL BACKEND (http://localhost:3000)
Autenticación
   POST   /api/auth/registro            registrar cliente
   POST   /api/auth/login               iniciar sesión (devuelve token JWT)
Usuarios (solo administrador)
   POST   /api/admin/personal           crear personal
   GET    /api/admin/personal?buscar=   listar / buscar personal
   PUT    /api/admin/personal/:id       modificar personal
   DELETE /api/admin/personal/:id       eliminar personal
   GET    /api/admin/clientes?buscar=   listar / buscar clientes
   PUT    /api/admin/clientes/:id       modificar cliente
   DELETE /api/admin/clientes/:id       eliminar cliente
Servicios
   GET    /api/servicios?buscar=        listar / buscar (público)
   POST   /api/servicios                crear       (administrador)
   PUT    /api/servicios/:id            modificar   (administrador)
   DELETE /api/servicios/:id            eliminar    (administrador)
Citas (requieren login)
   GET    /api/citas?buscar=            listar / buscar (según el rol)
   GET    /api/citas/empleados          personal disponible
   POST   /api/citas                    agendar     (cliente, administrador)
   PUT    /api/citas/:id                modificar / cancelar / cambiar estado
   DELETE /api/citas/:id                eliminar    (administrador)
Archivos (requieren login como personal o administrador)
   GET    /api/archivos?buscar=         listar / buscar
   POST   /api/archivos                 subir (campo "archivo", máx. 50 MB)
   GET    /api/archivos/:id/descargar   descargar
   PUT    /api/archivos/:id             modificar descripción
   DELETE /api/archivos/:id             eliminar
Asistente con IA (público)
   POST   /api/asistente                { mensaje, historial } -> { respuesta }
Servidor de contenidos
   GET    /imagenes/<archivo>           imágenes de backEnd/publico/imagenes

CADUCIDAD DE LA SESIÓN
Después de 1 minuto sin actividad (sin mover el mouse, escribir ni hacer
clic) la sesión se cierra sola y se regresa al inicio con un aviso.
El tiempo se cambia en frontEnd/src/datos/configuracionApi.js
(TIEMPO_INACTIVIDAD_MS).

SI ALGO FALLA
- "Error de conexión con MySQL": MySQL no está encendido en XAMPP o no
  existe el usuario un_usr / una_clave.
- Si ya existía una base de datos "salon_db" creada a mano con otra
  estructura, eliminarla en phpMyAdmin (pestaña Operaciones > Eliminar la
  base de datos) y volver a ejecutar npm run dev en backEnd.
- El login muestra "No fue posible conectar con el servidor": el backEnd
  no está corriendo.

Repositorio GitHub: https://github.com/Mcamilacr/05_salon

Nota: En GitHub no se puede poner la API key de gemini porque google lo detecta y la desactivaría, si se descarga el proyecto
desde el repositorio, no funcionará esa parte