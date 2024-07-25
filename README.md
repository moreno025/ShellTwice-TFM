# ShellTwice-TFM

Este proyecto consiste en el desarrollo de una plataforma en la que los usuarios pueden poner anuncios de los artículos que desean vender.

## Características

- **Publicación de Anuncios**: Los usuarios pueden crear anuncios para vender artículos.
- **Clasificación de Artículos**: Los artículos pueden ser clasificados en categorías ofrecidas por la plataforma.
- **Uso de Hashtags**: De manera opcional, los usuarios pueden agregar hashtags para facilitar la búsqueda.
- **Valoración de Usuarios**: Los usuarios pueden valorar a otros usuarios.
- **Filtros de Búsqueda**: Los artículos pueden ser filtrados por categoría, rango de precios y/o texto.

## Requisitos del Sistema

- MongoDB
- Express
- React
- Node.js

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/tu_usuario/ShellTwice-TFM.git
    ```

2. Navega al directorio del proyecto:
    ```sh
    cd ShellTwice-TFM
    ```

3. Instala las dependencias:
    ```sh
    npm install
    ```
4. Inicia la aplicación:
    ```sh
    npm start
    ```


## Uso

1. Regístrate o inicia sesión.
2. Publica un anuncio rellenando el formulario con los detalles del artículo.
3. Clasifica el artículo en la categoría adecuada.
4. (Opcional) Añade hashtags relevantes para facilitar la búsqueda.
5. Busca y filtra anuncios de otros usuarios por categoría, rango de precios o texto.
6. Valora a otros usuarios según tu experiencia.


## Estructura del Proyecto

```
📦 ShellTwice/

🖥️ cliente/
   ├── 📁 public/                     # Archivos estáticos
   └── 📁 src/                        # Archivos fuente
       ├── 📁 componentes/            # Componentes React
       └── 📄 App.js                  # Componente principal de la aplicación

⚙️ servidor/
   ├── 📁 controladores/              # Manipuladores de peticiones
   ├── 📁 modelos/                    # Modelos de base de datos
   ├── 📁 rutas/                      # Rutas de API
   ├── 📁 utilidades/                 # Funciones de utilidad
   └── 📄 server.js                   # Punto de entrada

🗃️ base_de_datos/
   └── 📄 schema.sql                  # Esquema de base de datos

📝 **README.md                        # Documentación del proyecto
📄 .gitignore                         # Archivo de ignorar de Git
```

## Licencia

Este proyecto está bajo la Licencia MIT LICENSE. Consulta el archivo `LICENSE` para más detalles.
