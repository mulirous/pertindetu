# 🎨 PertinDeTu - Frontend

> Interface moderna e responsiva para marketplace de serviços locais, construída com React 19 + TypeScript + Tailwind CSS.

[![React](https://img.shields.io/badge/React-19.1-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

---

## 📋 Sobre

Frontend da plataforma **PertinDeTu**, um marketplace que conecta prestadores de serviços a clientes. Desenvolvido com as tecnologias mais modernas do ecossistema React.

### ✨ Principais Características

- ⚡ **Vite** - Build tool extremamente rápida com HMR instantâneo
- 🎯 **TypeScript** - Type safety completo em toda aplicação
- 🎨 **Tailwind CSS** - Estilização utility-first responsiva
- 🧩 **shadcn/ui** - Componentes acessíveis e customizáveis
- 🔄 **React Router 7** - Navegação SPA com rotas dinâmicas
- 🌐 **Axios** - Cliente HTTP com interceptors
- 📱 **Responsivo** - Mobile-first design
- ♿ **Acessível** - Componentes Radix UI com ARIA

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm/yarn
- Backend PertinDeTu rodando em `http://localhost:8080`

### Instalação

```bash
# Clone o repositório (se ainda não fez)
git clone https://github.com/mulirous/pertindetu.git
cd pertindetu/frontend

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em: **http://localhost:5173**

### Scripts Disponíveis

```bash
pnpm dev       # Inicia servidor de desenvolvimento
pnpm build     # Build de produção (dist/)
pnpm preview   # Preview do build de produção
pnpm lint      # Executa ESLint
```

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/                      # Arquivos estáticos
│   └── placeholder-service.jpg  # Fallback de imagem
│
├── src/
│   ├── main.tsx                 # Entry point + React Router
│   ├── App.tsx                  # Componente raiz
│   ├── api.ts                   # Cliente Axios + tipos
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # Estado global de autenticação
│   │
│   ├── pages/                   # Páginas principais (rotas)
│   │   ├── Homepage.tsx         # Landing page dinâmica
│   │   ├── LoginPage.tsx        # Login de usuários
│   │   ├── RegisterPage.tsx     # Registro de novos usuários
│   │   ├── ServicesPage.tsx     # Listagem de serviços com filtros
│   │   ├── ServiceDetailPage.tsx # Detalhes do serviço + pedido
│   │   ├── PublicProviderPage.tsx # Perfil público do prestador
│   │   │
│   │   ├── DashboardPage.tsx    # Dashboard do cliente
│   │   ├── ProfilePage.tsx      # Perfil do usuário
│   │   ├── MyOrdersPage.tsx     # Pedidos do cliente
│   │   ├── MyReviewsPage.tsx    # Avaliações feitas
│   │   │
│   │   ├── ProviderCreatePage.tsx  # Criar perfil de prestador
│   │   ├── ServiceCreatePage.tsx   # Criar novo serviço
│   │   ├── ProviderOrdersPage.tsx  # Pedidos recebidos
│   │   ├── ProviderReviewsPage.tsx # Avaliações recebidas
│   │   │
│   │   └── AdminDashboardPage.tsx  # Dashboard administrativo
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── tabs.tsx
│   │   │
│   │   ├── Header.tsx           # Navegação principal
│   │   ├── Footer.tsx           # Rodapé
│   │   ├── RootLayout.tsx       # Layout padrão
│   │   │
│   │   ├── hero-section.tsx     # Hero da homepage
│   │   ├── categories-section.tsx # Categorias dinâmicas
│   │   ├── carousel-section.tsx # Carrossel de serviços
│   │   ├── announcements-carousel.tsx # Anúncios
│   │   │
│   │   ├── product-card.tsx     # Card de serviço
│   │   ├── OrderCard.tsx        # Card de pedido
│   │   ├── ReviewCard.tsx       # Card de avaliação
│   │   ├── StarRating.tsx       # Rating com estrelas
│   │   │
│   │   ├── OrderForm.tsx        # Formulário de pedido
│   │   ├── ServiceForm.tsx      # Formulário de serviço
│   │   ├── ProviderForm.tsx     # Formulário de prestador
│   │   ├── ReviewForm.tsx       # Formulário de avaliação
│   │   ├── RegisterForm.tsx     # Formulário de registro
│   │   │
│   │   ├── OrdersList.tsx       # Lista de pedidos
│   │   ├── ReviewsList.tsx      # Lista de avaliações
│   │   │
│   │   ├── AdminLayout.tsx      # Layout admin protegido
│   │   └── admin-sidebar.tsx    # Sidebar admin
│   │
│   ├── utils/
│   │   └── orderHelpers.ts      # Helpers de pedidos
│   │
│   ├── lib/
│   │   └── utils.ts             # Utilitários gerais (cn)
│   │
│   ├── assets/                  # Imagens e recursos
│   ├── index.css                # Estilos globais + Tailwind
│   └── App.css                  # Estilos do App
│
├── components.json              # Config shadcn/ui
├── tailwind.config.js           # Config Tailwind
├── vite.config.ts               # Config Vite
├── tsconfig.json                # Config TypeScript
├── eslint.config.js             # Config ESLint
└── package.json                 # Dependências
```

---

## 🎨 Tecnologias e Bibliotecas

### Core

- **React 19.1** - Biblioteca UI com hooks modernos
- **TypeScript 5.9** - Tipagem estática
- **Vite 7** - Build tool de próxima geração

### Roteamento e Estado

- **React Router DOM 7.9** - Navegação SPA
- **Context API** - Gerenciamento de estado global (AuthContext)

### Estilização

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **tailwindcss-animate** - Animações
- **class-variance-authority** - Variantes de componentes
- **clsx** + **tailwind-merge** - Merge de classes

### Componentes UI

- **shadcn/ui** - Sistema de componentes
  - `@radix-ui/react-avatar` - Avatares acessíveis
  - `@radix-ui/react-tabs` - Tabs acessíveis
  - `@radix-ui/react-slot` - Composição de componentes
- **lucide-react** - Biblioteca de ícones

### HTTP Client

- **Axios 1.13** - Cliente HTTP com interceptors

### Ferramentas de Desenvolvimento

- **ESLint 9** - Linter JavaScript/TypeScript
- **TypeScript ESLint** - Regras TypeScript
- **Vite Plugin React SWC** - Fast Refresh com SWC

---

## 🔌 Integração com Backend

### Configuração da API

O arquivo `src/api.ts` centraliza toda comunicação com o backend:

```typescript
const API_URL = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
```

### Módulos da API

```typescript
// Autenticação
authApi.register(data);
authApi.login(email, password);
authApi.getCurrentUser();

// Serviços
servicesApi.getPublic(filters, page, size);
servicesApi.getById(id);
servicesApi.create(data);
servicesApi.update(id, data);

// Pedidos
ordersApi.getMyOrders();
ordersApi.create(data);
ordersApi.updateStatus(id, status);

// Avaliações
reviewsApi.getByProvider(providerId);
reviewsApi.create(data);

// Categorias
categoriesApi.getAll();

// Admin
adminApi.users.getAll(page, size);
adminApi.providers.toggleVerification(id);
adminApi.services.toggleStatus(id);
// ... e mais
```

### Tipos TypeScript

Todos os tipos estão definidos em `api.ts`:

```typescript
interface UserData {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  providerProfile?: ProviderProfileData;
}

interface ServiceData {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  category: CategoryData;
  providerProfile: ProviderProfileData;
}

// ... e muitos outros
```

---

## 🔐 Autenticação

### AuthContext

O `AuthContext` gerencia o estado global de autenticação:

```typescript
const { user, login, logout, isAdmin } = useAuth();

// Login
await login(email, password);

// Verificar se é admin
if (isAdmin) {
  // Acesso admin
}

// Logout
logout();
```

### Proteção de Rotas

```typescript
// AdminLayout.tsx
useEffect(() => {
  if (!isAdmin) {
    navigate("/");
  }
}, [isAdmin, navigate]);
```

---

## 🎨 Sistema de Design

### Paleta de Cores (Tailwind)

```css
/* index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
  --destructive: 0 84.2% 60.2%;
  --border: 240 5.9% 90%;
  --radius: 0.5rem;
}
```

### Componentes Reutilizáveis

Todos os componentes UI seguem o padrão shadcn/ui:

```typescript
// Exemplo: Button
import { Button } from "@/components/ui/button";

<Button variant="default">Clique</Button>
<Button variant="outline">Secundário</Button>
<Button variant="ghost">Fantasma</Button>
```

### Responsividade

Design mobile-first com breakpoints Tailwind:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsivo automaticamente */}
</div>
```

---

## 📱 Páginas e Fluxos

### Fluxo do Usuário

1. **Homepage** → Serviços recentes + categorias dinâmicas
2. **Categoria** → Navega para `/services?category=X`
3. **ServicesPage** → Filtros (categoria, preço, busca)
4. **ServiceDetailPage** → Detalhes + criar pedido
5. **MyOrdersPage** → Acompanhar status
6. **MyReviewsPage** → Avaliar serviços

### Fluxo do Prestador

1. **ProviderCreatePage** → Criar perfil
2. **ServiceCreatePage** → Adicionar serviços
3. **ProviderOrdersPage** → Gerenciar pedidos
4. **ProviderReviewsPage** → Ver avaliações

### Fluxo Admin

1. **AdminDashboardPage** → Estatísticas
2. Gerenciar usuários, prestadores, serviços, categorias

---

## 🛠️ Desenvolvimento

### Adicionar Novo Componente shadcn/ui

```bash
# Exemplo: adicionar Dialog
npx shadcn@latest add dialog
```

### Estrutura de um Componente

```typescript
// components/MinhaFeature.tsx
import { useState } from "react";
import { Button } from "./ui/button";

interface MinhaFeatureProps {
  titulo: string;
  onAction: () => void;
}

export default function MinhaFeature({ titulo, onAction }: MinhaFeatureProps) {
  const [estado, setEstado] = useState(false);

  return (
    <div className="p-4 border rounded">
      <h2>{titulo}</h2>
      <Button onClick={onAction}>Ação</Button>
    </div>
  );
}
```

### Adicionar Nova Rota

```typescript
// main.tsx
{
  path: "/nova-rota",
  element: <NovaPage />,
}
```

---

## 🐛 Troubleshooting

### Erro de CORS

Verifique se o backend está com CORS configurado para `http://localhost:5173`.

### Imagens não carregam

1. Verifique MinIO no backend
2. Confirme `imageUrl` retornada pela API
3. Use fallback: `image || "/placeholder-service.jpg"`

### Build falha

```bash
# Limpar e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### TypeScript errors

```bash
# Verificar tipos
pnpm tsc --noEmit
```

---

## 🚀 Build e Deploy

### Build de Produção

```bash
pnpm build
```

Arquivos gerados em `dist/`.

### Variáveis de Ambiente

Crie `.env.production`:

```env
VITE_API_URL=https://api.pertindetu.com
```

Atualize `api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
```

### Servir Build

```bash
# Preview local
pnpm preview

# Ou com servidor estático
npx serve -s dist
```

### Deploy Recomendado

- **Vercel** - Zero config para Vite
- **Netlify** - Deploy automático
- **GitHub Pages** - Gratuito para repositórios públicos
- **Cloudflare Pages** - Edge network global

---

## 📈 Melhorias Futuras

- [ ] PWA (Service Workers + Manifest)
- [ ] Dark mode toggle
- [ ] Testes unitários (Vitest + Testing Library)
- [ ] Testes E2E (Playwright)
- [ ] Lazy loading de componentes
- [ ] Skeleton loaders
- [ ] Infinite scroll
- [ ] Otimização de imagens
- [ ] i18n (internacionalização)
- [ ] Analytics (Google Analytics/Plausible)
- [ ] Error boundary
- [ ] Acessibilidade WCAG 2.1

---

## 📝 Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (`MinhaFeature.tsx`)
- **Funções**: camelCase (`minhaFuncao()`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Tipos/Interfaces**: PascalCase (`UserData`)

### Estrutura de Imports

```typescript
// 1. React e hooks
import { useState, useEffect } from "react";

// 2. Libs externas
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 3. Contextos
import { useAuth } from "../context/AuthContext";

// 4. Componentes
import Header from "../components/Header";
import { Button } from "../components/ui/button";

// 5. Utils e tipos
import { api, type ServiceData } from "../api";
import { cn } from "../lib/utils";

// 6. Ícones
import { User, Settings } from "lucide-react";
```

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/MinhaFeature`
2. Commit: `git commit -m 'feat: Adiciona MinhaFeature'`
3. Push: `git push origin feature/MinhaFeature`
4. Abra um Pull Request

---

## 📄 Licença

Projeto acadêmico - Desenvolvimento Web 2

---

## 👨‍💻 Autor

Desenvolvido por **Murilo Rousano**

- GitHub: [@mulirous](https://github.com/mulirous)
- Repositório: [pertindetu](https://github.com/mulirous/pertindetu)

---

<p align="center">
  Construído com ⚡ Vite + ⚛️ React + 🎨 Tailwind CSS
</p>
