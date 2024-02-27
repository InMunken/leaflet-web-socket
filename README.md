# Leaflet Web Socket

Este repositorio contiene una aplicación de mapas en tiempo real con Leaflet y Web Sockets. Los usuarios pueden crear una sesión, dibujar en el mapa y ver los dibujos de otros usuarios que se conecten con ellos en tiempo real.

## Estructura del proyecto

El proyecto está compuesto por tres archivos principales:

- `main.js`: Este archivo contiene la lógica del cliente. Se encarga de manejar los eventos del mapa y de comunicarse con el servidor a través de Web Sockets.
- `index.ejs`: Este archivo es la página principal de la aplicación. Contiene el mapa y los elementos de la interfaz de usuario.
- `sockets.js`: Este archivo contiene la lógica del servidor. Se encarga de manejar las conexiones de los clientes y de transmitir los dibujos entre ellos.

## Cómo usar

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto e instala las dependencias con `npm install`.
3. Inicia el servidor con `node src/index.js`.

## Ejemplo de uso desde la web
1. Navega hacia `http://localhost:3001`.
2. Ingresa un nombre (opcional) y un token (puede ser cualquier token).
3. Clickea el botón "Done" y acepta los permisos de ubicación.
4. Crea los dibujos que quieras con las herramientas de [Leaflet Draw](https://github.com/Leaflet/Leaflet.draw).
5. Al entrar desde otra instancia de navegador y colocar el mismo token serás capaz de visualizar los dibujos que hayas hecho en el primer visor a la vez que los dibujos que se vayan haciendo durante la sesión estando ambos conectaos.
