# 🚀 Proyecto Base Multi-Contenedor (Node.js + Nginx + PostgreSQL)

Plantilla genérica y educativa para desplegar una arquitectura de microservicios básica en **Render** usando el plan gratuito y sin necesidad de introducir tarjeta de crédito.

---

## 🏗️ Arquitectura del Proyecto

* **Proxy (`nginx`):** Servidor web de cara al público que gestiona las peticiones y hace de proxy inverso.
* **Backend (`app`):** API REST en Node.js / Express conectada a la base de datos.
* **Base de Datos (`app-db`):** PostgreSQL gestionado para persistencia de datos.

---

## ☁️ DESPLIEGUE EN NUBE RENDER

Guía paso a paso para desplegar la aplicación manualmente en Render sin tarjeta bancaria.

---

### 📌 Paso 1: Crear la Base de Datos PostgreSQL

1. Entra en tu panel de control de [Render](https://dashboard.render.com/).
2. Haz clic en **New +** $\rightarrow$ **PostgreSQL**.
3. Configura los datos:
   * **Name:** `app-db`
   * **Database:** `app_db`
   * **User:** `app_user`
   * **Instance Type:** Selecciona **Free**.
4. Haz clic en **Create Database**.
5. Cuando pase a estado **Available**, ve a la pestaña **Info** y copia:
   * **Internal Database URL** *(para conectar la API backend)*.
   * **External Database URL** *(para inicializar las tablas mediante psql)*.

---

### 📌 Paso 2: Crear el Web Service del Backend (`app`)

1. En Render, haz clic en **New +** $\rightarrow$ **Web Service**.
2. Selecciona tu repositorio de GitHub.
3. Ajusta la configuración del servicio:
   * **Name:** `app`
   * **Language / Environment:** `Docker`
   * **Dockerfile Path:** `./backend/Dockerfile`
   * **Docker Context:** `./backend`
   * **Instance Type:** **Free**
4. En **Environment Variables**, añade:
   * **Key:** `DATABASE_URL`
   * **Value:** *(Pega la **Internal Database URL** copiada en el Paso 1)*.
5. Haz clic en **Create Web Service**.
6. Una vez desplegado, toma nota de la dirección pública HTTPS que Render le asigna a tu API (ejemplo: `https://app-xxxx.onrender.com`).

---

### 📌 Paso 3: Configurar el Proxy Nginx (`nginx/default.conf`)

En Render, los contenedores arrancan de forma independiente y Nginx necesita resolver la dirección de la API dinámicamente mediante DNS.

Abre el archivo `nginx/default.conf` en tu VS Code y asegúrate de incluir el solucionador DNS y la URL pública asignada a tu backend en el Paso 2:

```nginx
server {
    listen 80;

    location / {
        # Resolver DNS para resolver dominios dinámicamente en Render
        resolver 8.8.8.8 valid=30s;
        
        # Reemplaza 'app-xxxx.onrender.com' por el dominio exacto de tu backend
        proxy_pass [https://app-xxxx.onrender.com](https://app-xxxx.onrender.com);
        
        proxy_set_header Host app-xxxx.onrender.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Habilitar manejo de SNI para la conexión SSL con el backend
        proxy_ssl_server_name on;
    }
}