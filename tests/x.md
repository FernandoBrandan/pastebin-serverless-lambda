bueno vamos de nuevo,

objetivos: aws - sls - lambdas
Problemas: no voy a pagar ni loco servicios aws
Soluciones: minio, localstack, redis..

---

# Estrcutura de proyecto

docker-compose.yml

- Servicios
- - redis: image: redis:7
- - minio: image: inio/minio
- - localstack: image: localstack/localstack:3

serverless.yml (en resumen)

- service: pastebin-local
- frameworkVersion: '3'
- provider:
  stage: local
- plugins:
  - serverless-localstack
  - serverless-offline
- custom:
  - localstack:
  - serverless-offline:
  - dynamodb:
  - s3:
- functions:

# Pruebas local

- levantar docker compose
- levantar offline sls : sls offline start
- se realizan las pruebas con postman/curl o lo que sea.

Notas 1: se apunta a localhost,
dentro de las lambdas cuando consulto a redis,
como no esta en la misma red, la configuracion apunta a localhost.

# Siguiente paso pruebas con test local..

- De base
- - levantar docker compose
- - levantar offline sls : sls offline start
- Con jest y supertest: apuntando a localhost

se utiliza del script "test": "jest test"

# Siguiente paso pruebas en git actions..

Pregunta 1 : deberia ser localhost? - en referencia a la (notas 1)

.1 Se crea test-localstack.yml

.2 Se debe olvidar totalmente de docker-compose. O por lo menos entiendo que no se usa. Capas test-localstack.yml puede detectar el archivo como para disminuir codigo.

.3 Antes: Las siguientes lineas necesito breve explicacion.

```
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
```

.4 Luego se detallan los pasos
por defecto: - name: Checkout code
uses: actions/checkout@v3

        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '20'

        - name: Install dependencies
          run: npm install

.5 se deben levantar los servicios?

        - name: Start Serverless Offline
        run: |
        npx serverless offline &
        sleep 10

.6 se ejecutan los test ?

      - name: Run tests with LocalStack
        run: |
          echo "Test env running on LocalStack"
          npm run test

---

Preguntas.. githubaction, como le digo que solo ejecute un archivo osea quiero test-localstack.yml, y que ignore deploy.yml
