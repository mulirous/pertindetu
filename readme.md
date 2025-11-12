# 🧩 PertinDeTu - Marketplace de Serviços Locais

> Plataforma completa de marketplace conectando prestadores de serviços a clientes, desenvolvida com **Spring Boot** + **React** e arquitetura moderna em camadas.

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![MinIO](https://img.shields.io/badge/MinIO-S3%20Compatible-red.svg)](https://min.io/)

---

## 📋 Sobre o Projeto

**PertinDeTu** é um marketplace completo que conecta prestadores de serviços locais a clientes, permitindo cadastro de serviços, sistema de pedidos, avaliações e painel administrativo.

### ⚡ Funcionalidades Principais

#### 👤 Para Usuários

- ✅ Autenticação completa (registro, login, perfil)
- 🔍 Busca e filtro de serviços por categoria, preço e localização
- 📦 Sistema de pedidos com 6 estados (pendente → entregue)
- ⭐ Sistema de avaliações e comentários
- 📊 Painel do cliente (meus pedidos, minhas avaliações)

#### 🏪 Para Prestadores

- ✅ Perfil público com portfólio
- ➕ Cadastro e gerenciamento de serviços
- 📋 Gestão de pedidos recebidos
- 💬 Visualização de avaliações recebidas
- 📸 Upload de imagens para serviços

#### 🔐 Para Administradores

- 👥 Gerenciamento de usuários (ativar/desativar)
- 🏪 Gerenciamento de prestadores (verificar/aprovar)
- 🛍️ Gerenciamento de serviços (aprovar/moderar)
- 📊 Dashboard com estatísticas completas
- 🏷️ Gerenciamento de categorias

### 🏗️ Características Técnicas

- �️ **Arquitetura em camadas** (Controller → Service → Repository)
- 💾 **Persistência com JPA/Hibernate** e PostgreSQL
- ☁️ **Armazenamento de imagens** com MinIO (S3-compatible)
- 🎨 **Frontend moderno** com React 19 + TypeScript + Tailwind CSS
- 🔄 **API RESTful** com validação de dados
- 📚 **Documentação automática** com Swagger/OpenAPI
- 🐳 **Ambiente containerizado** com Docker Compose
- 🔐 **Autenticação stateless** com contexto React

---

## 🚀 Início Rápido

### Pré-requisitos

**Backend:**

- Java 21+
- Maven 3.8+
- Docker & Docker Compose

**Frontend:**

- Node.js 18+
- pnpm (ou npm/yarn)

### 1. Clone o repositório

```bash
git clone https://github.com/mulirous/pertindetu.git
cd pertindetu
```

### 2. Suba os serviços auxiliares (PostgreSQL + MinIO)

```bash
docker-compose up -d
```

Isso iniciará:

- **PostgreSQL** na porta `5432`
- **MinIO** na porta `9000` (API) e `9001` (Console)

### 3. Configure o MinIO

Acesse: http://localhost:9001

**Credenciais:**

- Usuário: `pertindetu`
- Senha: `pertindetu123`

1. Faça login no console
2. Crie o bucket `pertindetu-images`
3. Configure a policy como **public** (ou ajuste conforme necessário)

### 4. Inicie o Backend

```bash
# Na raiz do projeto
./mvnw spring-boot:run

# Ou no Windows
mvnw.cmd spring-boot:run
```

O backend estará disponível em: http://localhost:8080

### 5. Inicie o Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

O frontend estará disponível em: http://localhost:5173

### 6. Acesse a aplicação

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **API Backend**: http://localhost:8080
- 📖 **Swagger UI**: http://localhost:8080/swagger-ui.html
- 📄 **API Docs**: http://localhost:8080/api-docs
- 🗄️ **MinIO Console**: http://localhost:9001

### 7. Criar primeiro usuário administrador

Por padrão, usuários não são administradores. Para criar o primeiro admin, execute no banco:

```sql
-- Conecte ao PostgreSQL
docker exec -it pertindetu-postgres psql -U pertindetu_user -d pertindetu_db

-- Promova um usuário a admin
UPDATE users SET is_admin = true WHERE email = 'seu-email@exemplo.com';
```

Ou crie um endpoint temporário de bootstrap no backend.

---

## 📁 Estrutura do Projeto

```
pertindetu/
├── docker-compose.yml              # PostgreSQL + MinIO
├── entidades.excalidraw            # Diagrama ER
├── pom.xml                         # Dependências backend
├── readme.md                       # Este arquivo
│
├── src/main/java/com/pertindetu/dev/
│   ├── DevApplication.java         # Entry point Spring Boot
│   │
│   ├── configs/                    # Configurações
│   │   ├── MinioConfig.java        # Cliente MinIO
│   │   ├── OpenAPIConfig.java      # Swagger
│   │   └── WebConfig.java          # CORS
│   │
│   ├── controllers/                # Endpoints REST
│   │   ├── AdminCategoryController.java
│   │   ├── AdminProviderController.java
│   │   ├── AdminServiceController.java
│   │   ├── AdminStatsController.java
│   │   ├── AdminUserController.java
│   │   ├── AuthController.java
│   │   ├── CategoryController.java
│   │   ├── OrderController.java
│   │   ├── ProviderController.java
│   │   ├── ReviewController.java
│   │   ├── ServiceController.java
│   │   └── UserController.java
│   │
│   ├── models/                     # Entidades JPA
│   │   ├── entity/
│   │   │   ├── Category.java
│   │   │   ├── Order.java
│   │   │   ├── ProviderProfile.java
│   │   │   ├── Review.java
│   │   │   ├── Service.java
│   │   │   └── User.java
│   │   └── dto/                    # Data Transfer Objects
│   │       ├── request/
│   │       └── response/
│   │
│   ├── repositories/               # Spring Data JPA
│   │   ├── CategoryRepository.java
│   │   ├── OrderRepository.java
│   │   ├── ProviderProfileRepository.java
│   │   ├── ReviewRepository.java
│   │   ├── ServiceRepository.java
│   │   └── UserRepository.java
│   │
│   ├── services/                   # Lógica de negócio
│   │   ├── CategoryService.java
│   │   ├── MinioService.java
│   │   ├── OrderService.java
│   │   ├── ProviderProfileService.java
│   │   ├── ReviewService.java
│   │   ├── ServiceService.java
│   │   └── UserService.java
│   │
│   └── exceptions/                 # Tratamento de erros
│       ├── GlobalExceptionHandler.java
│       └── ResourceNotFoundException.java
│
└── frontend/
    ├── package.json                # Dependências frontend
    ├── vite.config.ts              # Config Vite
    ├── tailwind.config.js          # Config Tailwind
    │
    └── src/
        ├── main.tsx                # Entry point + rotas
        ├── api.ts                  # Cliente Axios
        │
        ├── context/
        │   └── AuthContext.tsx     # Estado global autenticação
        │
        ├── pages/                  # Páginas principais
        │   ├── Homepage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── ServicesPage.tsx
        │   ├── ServiceDetailPage.tsx
        │   ├── PublicProviderPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── ProfilePage.tsx
        │   ├── MyOrdersPage.tsx
        │   ├── MyReviewsPage.tsx
        │   ├── ProviderCreatePage.tsx
        │   ├── ServiceCreatePage.tsx
        │   ├── ProviderOrdersPage.tsx
        │   ├── ProviderReviewsPage.tsx
        │   └── AdminDashboardPage.tsx
        │
        └── components/             # Componentes reutilizáveis
            ├── ui/                 # shadcn/ui components
            ├── Header.tsx
            ├── Footer.tsx
            ├── AdminLayout.tsx
            ├── AdminSidebar.tsx
            ├── OrderCard.tsx
            ├── ReviewCard.tsx
            ├── ProductCard.tsx
            └── ...
```

---

## 🏛️ Arquitetura em Camadas

### Backend: MVC + Service Layer

| Camada         | Responsabilidade                            |
| -------------- | ------------------------------------------- |
| **Controller** | Endpoints REST, validação de entrada, DTOs  |
| **Service**    | Regras de negócio, validações, orquestração |
| **Repository** | Acesso a dados via Spring Data JPA          |
| **Model**      | Entidades JPA e DTOs (Request/Response)     |
| **Config**     | Configurações (MinIO, Swagger, CORS, etc)   |

### Frontend: Component-Based Architecture

| Camada         | Responsabilidade                        |
| -------------- | --------------------------------------- |
| **Pages**      | Rotas principais da aplicação           |
| **Components** | UI reutilizável (cards, forms, layouts) |
| **Context**    | Estado global (autenticação, usuário)   |
| **API Client** | Comunicação com backend via Axios       |
| **Utils**      | Funções auxiliares e helpers            |

### Fluxo de Dados

````
┌─────────────┐      HTTP       ┌──────────────┐
│   React     │ ◄────────────── │   Browser    │
│  Frontend   │ ──────────────► │              │
└──────┬──────┘   REST API      └──────────────┘
       │
       │ Axios (api.ts)
       │
       ▼
┌─────────────────────────────────────────────┐
│           Spring Boot Backend               │
│                                             │
│  ┌──────────┐    ┌─────────┐    ┌────────┐ │
│  │Controller│───►│ Service │───►│  Repo  │ │
│  └──────────┘    └─────────┘    └────┬───┘ │
│                       │               │     │
│                       ▼               ▼     │
│                  ┌────────┐     ┌──────────┐│
│                  │ MinIO  │     │PostgreSQL││
│                  │(Images)│     │   (DB)   ││
│                  └────────┘     └──────────┘│
└─────────────────────────────────────────────┘
```---

## 🗄️ Modelo de Dados

### Entidades Principais

#### User (Usuário)
- `id`, `name`, `email`, `password`, `phone`, `cpf`
- `isAdmin` - Flag para administradores
- Relação: Um usuário pode ter um `ProviderProfile`

#### ProviderProfile (Perfil de Prestador)
- `id`, `bio`, `location`, `isVerified`
- Relação: Pertence a um `User`, possui múltiplos `Service`

#### Service (Serviço)
- `id`, `title`, `description`, `price`, `imageUrl`
- `isActive` - Status do serviço
- Relação: Pertence a `ProviderProfile` e `Category`

#### Category (Categoria)
- `id`, `name`, `description`
- Relação: Possui múltiplos `Service`

#### Order (Pedido)
- `id`, `totalPrice`, `status`, `createdAt`
- Status: `PENDING` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED` → `DELIVERED` → `CANCELLED`
- Relação: Pertence a `User` (cliente), `ProviderProfile` (prestador), `Service`

#### Review (Avaliação)
- `id`, `rating` (1-5), `comment`, `createdAt`
- Relação: Pertence a `User` (avaliador), `ProviderProfile` (avaliado)

### Diagrama ER

Visualize o diagrama completo em: `entidades.excalidraw`

Abra no [Excalidraw](https://excalidraw.com/) para ver relacionamentos.

---

## 🔌 API Endpoints

### Autenticação
````

POST /api/auth/register # Registrar novo usuário
POST /api/auth/login # Login (retorna UserData)
GET /api/auth/me # Dados do usuário logado

```

### Usuários
```

GET /api/users/{id} # Buscar usuário por ID
PUT /api/users/{id} # Atualizar perfil

```

### Prestadores
```

POST /api/providers # Criar perfil de prestador
GET /api/providers/{id} # Dados públicos do prestador
PUT /api/providers/{id} # Atualizar perfil
GET /api/providers/user/{userId} # Buscar por usuário

```

### Serviços
```

GET /api/services # Listar serviços (público, com filtros)
GET /api/services/{id} # Detalhes do serviço
POST /api/services # Criar serviço (prestador)
PUT /api/services/{id} # Atualizar serviço
DELETE /api/services/{id} # Deletar serviço
GET /api/services/provider/{providerId} # Serviços do prestador

```

### Pedidos
```

GET /api/orders # Meus pedidos (cliente)
POST /api/orders # Criar pedido
GET /api/orders/{id} # Detalhes do pedido
PUT /api/orders/{id}/status # Atualizar status
GET /api/orders/provider/{providerId} # Pedidos recebidos

```

### Avaliações
```

GET /api/reviews/provider/{providerId} # Avaliações do prestador
POST /api/reviews # Criar avaliação
GET /api/reviews/user/{userId} # Avaliações feitas por usuário

```

### Categorias
```

GET /api/categories # Listar todas categorias
GET /api/categories/{id} # Detalhes da categoria

```

### Admin
```

# Usuários

GET /api/admin/users # Listar todos usuários
PUT /api/admin/users/{id}/toggle-status # Ativar/desativar

# Prestadores

GET /api/admin/providers # Listar prestadores
PUT /api/admin/providers/{id}/toggle-verification # Verificar

# Serviços

GET /api/admin/services # Listar serviços
PUT /api/admin/services/{id}/toggle-status # Ativar/desativar

# Categorias

POST /api/admin/categories # Criar categoria
PUT /api/admin/categories/{id} # Atualizar categoria
DELETE /api/admin/categories/{id} # Deletar categoria

# Estatísticas

GET /api/admin/stats # Dashboard com todas estatísticas

````

📖 **Documentação interativa**: http://localhost:8080/swagger-ui.html

---

## 🛠️ Stack Tecnológica

### Backend
- **Java 21** - Linguagem base com features modernas
- **Spring Boot 3.5.7** - Framework principal
  - Spring Web - APIs REST
  - Spring Data JPA - Persistência de dados
  - Spring Validation - Validação de dados
- **PostgreSQL 16** - Banco de dados relacional
- **MinIO** - Object storage (S3-compatible) para imagens
- **SpringDoc OpenAPI** - Documentação Swagger

### Frontend
- **React 19.1** - Biblioteca UI com hooks modernos
- **TypeScript 5.9** - Type safety e melhor DX
- **Vite 7** - Build tool extremamente rápida
- **React Router 7** - Roteamento SPA
- **Axios** - Cliente HTTP
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Componentes acessíveis
  - Radix UI - Primitivos headless
  - Lucide React - Ícones
- **Context API** - Gerenciamento de estado

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **Maven** - Build tool Java
- **pnpm** - Gerenciador de pacotes rápido

---

## 📚 Documentação da API

A documentação interativa completa está disponível via **Swagger UI**:

👉 **http://localhost:8080/swagger-ui.html**

Recursos:
- ✅ Visualizar todos os endpoints organizados por controller
- ✅ Testar requisições diretamente no navegador
- ✅ Ver schemas de request/response com tipos
- ✅ Exemplos de payloads
- ✅ Códigos de status HTTP documentados
- ✅ Baixar especificação OpenAPI 3.0

---

## 🎨 Interface e Fluxos

### Fluxo do Cliente

1. **Homepage** → Visualiza serviços recentes e categorias dinâmicas
2. **Clica em categoria** → Navega para ServicesPage com filtro aplicado
3. **ServicesPage** → Filtra por categoria, preço, busca por texto
4. **ServiceDetailPage** → Vê detalhes, imagens, avaliações
5. **Criar pedido** → Envia solicitação para prestador
6. **MyOrdersPage** → Acompanha status do pedido
7. **MyReviewsPage** → Avalia serviço após conclusão

### Fluxo do Prestador

1. **Cria perfil** → ProviderCreatePage com bio e localização
2. **Adiciona serviços** → ServiceCreatePage com título, descrição, preço, imagem
3. **Gerencia pedidos** → ProviderOrdersPage com atualização de status
4. **Visualiza avaliações** → ProviderReviewsPage com ratings recebidos
5. **Perfil público** → PublicProviderPage acessível por clientes

### Fluxo do Admin

1. **Login como admin** → Acessa /admin
2. **Dashboard** → Visualiza estatísticas (usuários, serviços, pedidos)
3. **Gerencia usuários** → Ativa/desativa contas
4. **Gerencia prestadores** → Verifica/aprova prestadores
5. **Gerencia serviços** → Modera serviços inadequados
6. **Gerencia categorias** → CRUD completo de categorias

---

## � Autenticação e Autorização

### Sistema Atual

- ✅ **Registro e Login** via endpoints REST
- ✅ **AuthContext** no frontend mantém estado do usuário
- ✅ **Campo isAdmin** na entidade User
- ✅ **Proteção de rotas** no frontend (AdminLayout verifica isAdmin)
- ⚠️ **Sem JWT/Sessions** - autenticação stateless básica

### Melhorias Futuras

Para produção, recomenda-se:
- 🔒 Implementar **Spring Security** com JWT
- 🔒 Hash de senhas com **BCrypt**
- 🔒 Refresh tokens
- 🔒 Rate limiting
- 🔒 HTTPS obrigatório

---

## 🧪 Testes

```bash
# Backend - Executar todos os testes
./mvnw test

# Backend - Com relatório de cobertura
./mvnw test jacoco:report

# Frontend - Testes unitários
cd frontend
pnpm test

# Frontend - Testes E2E (se configurado)
pnpm test:e2e
````

---

## 🐳 Docker e Serviços

### Verificar status dos containers

```bash
docker ps
```

Containers ativos:

- `pertindetu-postgres` - PostgreSQL na porta 5432
- `pertindetu-minio` - MinIO nas portas 9000/9001

### Logs dos serviços

```bash
# PostgreSQL
docker logs -f pertindetu-postgres

# MinIO
docker logs -f pertindetu-minio
```

### Conectar ao PostgreSQL

```bash
# Via psql
docker exec -it pertindetu-postgres psql -U pertindetu_user -d pertindetu_db

# Listar tabelas
\dt

# Ver estrutura de uma tabela
\d users
```

### Gerenciar containers

```bash
# Parar serviços
docker-compose down

# Parar e remover volumes (APAGA DADOS!)
docker-compose down -v

# Reiniciar serviços
docker-compose restart

# Reconstruir imagens
docker-compose up -d --build
```

---

## 🔧 Troubleshooting

### Aplicação não conecta ao banco

**Sintomas:** Erro de conexão ao iniciar backend

**Soluções:**

```bash
# 1. Verifique se o PostgreSQL está rodando
docker ps | grep postgres

# 2. Teste conexão manual
docker exec -it pertindetu-postgres psql -U pertindetu_user -d pertindetu_db

# 3. Verifique as credenciais em application.properties
# 4. Reinicie o container
docker-compose restart pertindetu-postgres
```

### MinIO retorna erro 403 ou 404

**Sintomas:** Upload de imagens falha

**Soluções:**

1. Acesse http://localhost:9001
2. Faça login (pertindetu / pertindetu123)
3. Verifique se o bucket `pertindetu-images` existe
4. Configure policy do bucket como **public** ou ajuste permissões
5. Confirme credenciais em `application.properties`

### Porta já em uso

**Backend (8080):**

```properties
# application.properties
server.port=8081
```

**Frontend (5173):**

```bash
# vite.config.ts - adicione:
server: { port: 3000 }
```

### CORS bloqueando requisições

**Sintomas:** Erros de CORS no console do navegador

**Solução:** Verifique `WebConfig.java`:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins("http://localhost:5173") // URL do frontend
        .allowedMethods("*");
}
```

### Imagens não aparecem no frontend

**Diagnóstico:**

1. Verifique se MinIO está rodando: `docker ps`
2. Teste URL direta da imagem no navegador
3. Verifique se `imageUrl` no serviço está correta
4. Confirme policy pública do bucket

### Build do frontend falha

```bash
# Limpar cache e reinstalar
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar versão do Node
node --version  # Deve ser 18+
```

---

## 🚀 Deploy e Produção

### Considerações para Deploy

#### Backend

```bash
# Build production JAR
./mvnw clean package -DskipTests

# JAR gerado em: target/dev-0.0.1-SNAPSHOT.jar

# Executar
java -jar target/dev-0.0.1-SNAPSHOT.jar
```

#### Frontend

```bash
cd frontend
pnpm build

# Arquivos estáticos gerados em: dist/
# Servir com nginx, Apache, ou plataforma cloud
```

#### Variáveis de Ambiente

Backend (`application-prod.properties`):

```properties
# Database
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# MinIO
minio.url=${MINIO_URL}
minio.access-key=${MINIO_ACCESS_KEY}
minio.secret-key=${MINIO_SECRET_KEY}
```

Frontend (`.env.production`):

```env
VITE_API_URL=https://api.pertindetu.com
```

#### Checklist de Segurança

- [ ] Implementar Spring Security + JWT
- [ ] Hash de senhas com BCrypt
- [ ] HTTPS obrigatório
- [ ] Rate limiting
- [ ] Validação de uploads (tipo, tamanho)
- [ ] Sanitização de inputs
- [ ] CORS restritivo
- [ ] Secrets em variáveis de ambiente
- [ ] Backup automático do banco
- [ ] Monitoramento e logs


### Como Contribuir

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/SEU-USER/pertindetu.git`
3. **Crie uma branch**: `git checkout -b feature/MinhaFeature`
4. **Commit** suas mudanças: `git commit -m 'feat: Adiciona MinhaFeature'`
5. **Push**: `git push origin feature/MinhaFeature`
6. Abra um **Pull Request**

### Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: apenas documentação
style: formatação, sem mudança de código
refactor: refatoração de código
test: adicionar testes
chore: mudanças de build/config
```

---

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina de Desenvolvimento Web 2.

---

## 👨‍💻 Autores

Desenvolvido por **Eduardo Santos, João Victor Saraiva, Murilo Costa e Luigi Peixoto** como projeto de avaliação acadêmica.


- 📂 Repositório: [pertindetu](https://github.com/mulirous/pertindetu)

---


