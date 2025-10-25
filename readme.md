# 🧩 PertinDeTu - MVP de Avaliação

> MVP acadêmico desenvolvido com **Spring Boot**, demonstrando arquitetura em camadas, persistência de dados e integração com serviços externos.

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![MinIO](https://img.shields.io/badge/MinIO-S3%20Compatible-red.svg)](https://min.io/)

---

## 📋 Sobre o Projeto

Este projeto é um MVP desenvolvido como avaliação acadêmica, implementando uma aplicação completa em **Java + Spring Boot** com foco em boas práticas de desenvolvimento, arquitetura de software e integração com tecnologias modernas.

### ⚡ Principais Características

- 🏗️ **Arquitetura em camadas** (Controller → Service → Repository)
- 💾 **Persistência com JPA/Hibernate** e PostgreSQL
- ☁️ **Armazenamento de imagens** com MinIO (S3-compatible)
- 📚 **Documentação automática** com Swagger/OpenAPI
- 🐳 **Ambiente containerizado** com Docker Compose
- ✅ **Separação de responsabilidades** e código limpo

---

## 🚀 Início Rápido

### Pré-requisitos

- Java 21+
- Maven 3.8+
- Docker & Docker Compose

### 1. Clone o repositório

```bash
git clone <repositorio-pertindetu>
cd pertindetu
```

### 2. Suba os serviços auxiliares

```bash
docker-compose up -d
```

Isso iniciará:

- **PostgreSQL** na porta `5432`
- **MinIO** na porta `9000` (API) e `9001` (Console)

### 3. Configure o bucket do MinIO

Acesse: http://localhost:9001

**Credenciais:**

- Usuário: `pertindetu`
- Senha: `pertindetu123`

Crie o bucket `pertindetu-images` através do console.

### 4. Execute a aplicação

```bash
./mvnw spring-boot:run
```

**Windows:**

```bash
mvnw.cmd spring-boot:run
```

### 5. Acesse os serviços

- 🌐 **API**: http://localhost:8080
- 📖 **Swagger UI**: http://localhost:8080/swagger-ui.html
- 📄 **API Docs JSON**: http://localhost:8080/api-docs

---

## 📁 Estrutura do Projeto

```
dev/
├── docker-compose.yml          # Orquestração dos serviços
├── entidades.excalidraw        # Diagrama ER do banco
├── pom.xml                     # Dependências Maven
└── src/
    ├── main/
    │   ├── java/com/pertindetu/dev/
    │   │   ├── DevApplication.java       # Entry point
    │   │   ├── config/                   # Configurações
    │   │   │   ├── MinioConfig.java
    │   │   │   └── OpenAPIConfig.java
    │   │   ├── controller/               # Endpoints REST
    │   │   ├── model/                    # Entidades e DTOs
    │   │   │   ├── entity/
    │   │   │   └── dto/
    │   │   ├── repository/               # Camada de dados
    │   │   └── service/                  # Lógica de negócio
    │   └── resources/
    │       └── application.properties    # Configurações da app
    └── test/                             # Testes automatizados
```

---

## 🏛️ Arquitetura em Camadas

A aplicação segue o padrão **MVC + Service Layer**:

| Camada         | Responsabilidade                                   |
| -------------- | -------------------------------------------------- |
| **Controller** | Exposição de endpoints REST e validação de entrada |
| **Service**    | Regras de negócio, validações e orquestração       |
| **Repository** | Acesso a dados via Spring Data JPA                 |
| **Model**      | Entidades JPA e DTOs                               |
| **Config**     | Configurações de integração (MinIO, Swagger, etc)  |

### Fluxo de Dados

```
HTTP Request → Controller → Service → Repository → Database
                    ↓           ↓
                  DTO      MinIO (imagens)
```

---

## 🗄️ Banco de Dados

### Diagrama ER

O diagrama conceitual está disponível em:
📄 `entidades.excalidraw`

Abra no [Excalidraw](https://excalidraw.com/) para visualizar as relações entre entidades.

### Configuração PostgreSQL

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pertindetu_db
spring.datasource.username=pertindetu_user
spring.datasource.password=pertindetu_pass
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## ☁️ Armazenamento de Imagens (MinIO)

### Por que MinIO?

- ✅ **Compatível com S3** - migração facilitada para AWS
- ✅ **Self-hosted** - ideal para desenvolvimento e MVPs
- ✅ **Leve e rápido** - baixo consumo de recursos
- ✅ **Seguro** - autenticação via access/secret keys
- ✅ **Integração nativa** com Spring Boot

### Casos de Uso

- Imagens de perfil de usuários
- Portfólios e anexos
- Qualquer arquivo binário que precise de armazenamento escalável

### Configuração

```properties
minio.url=http://localhost:9000
minio.access-key=pertindetu
minio.secret-key=pertindetu123
minio.bucket=pertindetu-images
```

---

## 🛠️ Stack Tecnológica

### Backend

- **Java 21** - Linguagem base
- **Spring Boot 3.5** - Framework principal
- **Spring Data JPA** - Persistência de dados
- **Spring Web** - APIs REST

### Banco de Dados

- **PostgreSQL 16** - Banco relacional

### Armazenamento

- **MinIO** - Object storage (S3-compatible)

### Documentação

- **SpringDoc OpenAPI 3** - Swagger UI

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **Maven** - Gerenciamento de dependências

---

## 📚 Documentação da API

A documentação interativa está disponível via **Swagger UI**:

👉 http://localhost:8080/swagger-ui.html

Você pode:

- Visualizar todos os endpoints
- Testar requisições diretamente no navegador
- Ver schemas de request/response
- Baixar a especificação OpenAPI

---

## 🧪 Testes

```bash
# Executar todos os testes
./mvnw test

# Executar com cobertura
./mvnw test jacoco:report
```

---

## 🐳 Serviços Docker

### Verificar status dos containers

```bash
docker ps
```

### Logs dos serviços

```bash
# PostgreSQL
docker logs pertindetu-postgres

# MinIO
docker logs pertindetu-minio
```

### Parar os serviços

```bash
docker-compose down
```

### Remover volumes (limpar dados)

```bash
docker-compose down -v
```

---

## 🔧 Troubleshooting

### Aplicação não conecta ao banco

- Verifique se o PostgreSQL está rodando: `docker ps`
- Teste a conexão: `docker exec -it pertindetu-postgres psql -U pertindetu_user -d pertindetu_db`

### MinIO retorna erro 403

- Verifique se o bucket foi criado no console
- Confirme as credenciais em `application.properties`
- Verifique as policies do bucket

### Porta já em uso

Altere a porta da aplicação em `application.properties`:

```properties
server.port=8081
```

---

## 👥 Contribuindo

Este é um projeto acadêmico, mas sugestões são bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

<!--
## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

## 👨‍💻 Autor

Desenvolvido como parte de avaliação acadêmica em Engenharia de Software.

---

## 📞 Contato

Para dúvidas sobre o projeto:
- 📧 Email: [seu-email]
- 💼 LinkedIn: [seu-linkedin]
- 🐙 GitHub: [seu-github] -->
