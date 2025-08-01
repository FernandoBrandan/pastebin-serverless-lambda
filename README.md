# Pastebin Serverless

- Servicio API de pastebin ultra liviana construida con AWS Lambda, DynamoDB, MinIO y Redis.
- Contiene desarrollo backend en la nube, incluyendo autenticación, almacenamiento distribuido, y cacheo inteligente.

## Qué hace este sistema

- Los usuarios pueden crear "pastes" (fragmentos de texto o código) y compartirlos mediante una URL única.
- Soporta niveles de expiración, visibilidad (público, privado, oculto) y control de acceso por tipo de usuario (free/premium).
- Autenticación JWT y almacenamiento de usuarios en DynamoDB.
- Uso de MinIO como almacenamiento de objetos y Redis como sistema de cache.
- MinIO como reemplazo a S3

## Tecnologías utilizadas

| Tecnología               | Uso principal                          |
| ------------------------ | -------------------------------------- |
| **AWS Lambda**           | Lógica backend sin servidores          |
| **API Gateway**          | Exposición de endpoints HTTP           |
| **DynamoDB**             | Almacenamiento de usuarios y metadata  |
| **MinIO (S3-like)**      | Almacenamiento de contenidos           |
| **Redis**                | Cache de consultas populares           |
| **JWT**                  | Autenticación segura de usuarios       |
| **TypeScript**           | Tipado estricto y mantenibilidad       |
| **Serverless Framework** | Organización y despliegue de funciones |

## Funcionalidades destacadas

- **Autenticación y planes de usuario** (`free` o `premium`)
- **Alto rendimiento con cache en Redis**
- **Almacenamiento desacoplado** (texto en MinIO, metadata en DynamoDB)
- **Autorización por visibilidad y expiración**
- **Regeneración de IDs únicos tipo Base62**
- **Desplegable en AWS con Serverless Framework**

## Cómo probarlo localmente

1. **Requisitos**

   - Docker + docker-compose
   - Node.js 20+
   - Serverless Framework
   - `minio`, `redis` y `localstack` corriendo en local (simulan los servicios AWS)

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Levantar entorno**

   ```bash
   docker-compose up
   ```

4. **Ejecutar el backend**

   ```bash
   sls offline start
   ```

5. **Endpoints disponibles**

   - `POST /api/v1/register` → Crear usuario
   - `POST /api/v1/login` → Obtener JWT
   - `POST /api/v1/pastes` → Crear nuevo paste (con token)
   - `GET /api/v1/pastes?pasteId=xyz` → Obtener contenido (con cache)

# Test

1.  **Registro de usuario**

```bash
curl -X POST http://localhost:3000/local/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fer@example.com",
    "password": "123456"
  }'
```

2. **Login y obtener JWT**

```bash
curl -X POST http://localhost:3000/local/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fer@example.com",
    "password": "123456"
  }'
```

> Guardá el `token` JWT que te devuelve para los siguientes pasos.

3. **Crear un paste (anónimo / sin login)**

```bash
curl -X POST http://localhost:3000/local/api/v1/pastes/api/v1/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi paste público",
    "content": "Este es un paste público",
    "contentType": "text/plain",
    "visibility": "public",
    "expireType": "never"
  }'
```

4. **Crear paste privado (requiere login)**

```bash
curl -X POST http://localhost:3000/local/api/v1/pastes/api/v1/pastes \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Paste privado",
    "content": "Contenido secreto",
    "contentType": "text/plain",
    "visibility": "private",
    "expireType": "1d"
  }'
```

> Reemplazá `<JWT_TOKEN>` por el valor que obtuviste en el login.

5.  **Crear paste con expiración larga (requiere **usuario premium**)**

```bash
curl -X POST http://localhost:3000/local/api/v1/pastes/api/v1/pastes \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Paste premium",
    "content": "Contenido premium",
    "contentType": "text/plain",
    "visibility": "private",
    "expireType": "1m"
  }'
```

> Asegurate de que el usuario tenga `plan: "premium"` en DynamoDB, o simulalo manualmente por ahora.

6.  **Obtener paste (por ID)**

```bash
curl -X GET "http://localhost:3000/local/api/v1/pastes/api/v1/pastes?pasteId=<PASTE_ID>"
```

Reemplazá `<PASTE_ID>` por el ID que obtuviste en el paso 3, 4 o 5.

INTEGRAR

---

# Test CI/CD con GitHub Actions

Integración continua al hacer push/pull request sobre main, ejecutando tests de extremo a extremo con Jest y supertest.

---

- Uso de Serverless Framework con funciones Lambda, DynamoDB, S3 y Redis, emulados mediante LocalStack, MinIO y Redis.

---

Todos los servicios se levantan con docker-compose, lo cual permite replicar un entorno de producción local en segundos.

---

Testing Automatizado:
Se incluyen pruebas e2e (end-to-end) con usuarios reales (registro + login), validando que el flujo completo funcione correctamente.

---

Despliegue desacoplado:
Separación clara entre workflows de test (test-localstack.yml) y de deploy (deploy.yml, aún pendiente de activación), siguiendo buenas prácticas de CI/CD.
