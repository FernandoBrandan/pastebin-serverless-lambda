# Primer paso - test-localstack.yml:

- Corre en GitHub Actions.
- Levanta Redis, MinIO, LocalStack como servicios.
- Usa tu app y testea si puede interactuar con eso (e2e o integración).
- Ideal para aprender sobre servicios, ambientes, mocks y cómo tu backend responde.

# Segundo paso - ci.yml:

- Este puede incluir:
  - Linter (eslint, prettier).
  - Type check si usás TS.
  - Unit tests (sin depender de infra).
  - Coverage (jest --coverage).
- Puede correr en paralelo o antes del Test with LocalStack.

# Tercer paso - deploy.yml:

- Este workflow corre solo si los anteriores pasan.
- Sube funciones a AWS (via Serverless Framework o aws-cli).
- Requiere claves configuradas como secrets (AWS_ACCESS_KEY_ID, etc).
