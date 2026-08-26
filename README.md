# PROYECTO_BASE_RENDER
---

## ☁️ DESPLIEGUE EN NUBE RENDER

Esta guía detalla el procedimiento paso a paso para desplegar la arquitectura completa de manera gratuita y sin necesidad de introducir datos bancarios ni tarjeta de crédito en Render.

---

### 📌 Paso 1: Crear la Base de Datos PostgreSQL

1. Accede al panel de control de [Render](https://dashboard.render.com/).
2. Haz clic en el botón **New +** (arriba a la derecha) y selecciona **PostgreSQL**.
3. Rellena los campos con la siguiente configuración:
   * **Name:** `app-db`
   * **Database:** `app_db`
   * **User:** `app_user`
   * **Instance Type:** Selecciona **Free**.
4. Haz clic en **Create Database**.
5. Una vez que la base de datos pase a estado **Available**, ve a la pestaña **Info** y copia los siguientes valores:
   * **Internal Database URL** *(se usará para la conexión interna de la API)*.
   * **External Database URL** *(se usará para la inicialización del esquema SQL)*.

---

### 📌 Paso 2: Crear el servicio Web para el Backend (`app`)

1. Haz clic en **New +** $\rightarrow$ **Web Service**.
2. Conecta tu repositorio de GitHub (`PROYECTO_BASE_RENDER`).
3. Ajusta los siguientes parámetros de configuración:
   * **Name:** `app`
   * **Language / Environment:** `Docker`
   * **Dockerfile Path:** `./backend/Dockerfile`
   * **Docker Context:** `./backend`
   * **Instance Type:** **Free**
4. En el apartado **Environment Variables**, añade la siguiente variable:
   * **Key:** `DATABASE_URL`
   * **Value:** *(Pega la **Internal Database URL** copiada en el Paso 1)*.
5. Haz clic en **Create Web Service**.

---

### 📌 Paso 3: Crear el servicio Web para el Proxy (`proxy`)

1. Haz clic en **New +** $\rightarrow$ **Web Service**.
2. Selecciona de nuevo el repositorio de GitHub (`PROYECTO_BASE_RENDER`).
3. Configura los parámetros:
   * **Name:** `proxy`
   * **Language / Environment:** `Docker`
   * **Dockerfile Path:** `./nginx/Dockerfile`
   * **Docker Context:** `./nginx`
   * **Instance Type:** **Free**
4. Haz clic en **Create Web Service**.

---

### 📌 Paso 4: Poblado Inicial de la Base de Datos (`init.sql`)

Ejecuta el script SQL de inicialización desde la terminal local usando la **External Database URL**:

```bash
psql "TU_EXTERNAL_DATABASE_URL" -f sql/init.sql