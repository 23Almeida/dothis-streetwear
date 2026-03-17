# DOTHIS — Streetwear E-commerce

Site de e-commerce de streetwear masculino construído com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilo**: Tailwind CSS
- **Banco de Dados**: Supabase (PostgreSQL + Auth + Storage)
- **Estado Global**: Zustand (carrinho + auth)
- **Deploy**: Vercel (recomendado)

## Estrutura do Projeto

```
src/
├── app/                    # Rotas (App Router)
│   ├── page.tsx            # Homepage
│   ├── shop/               # Listagem de produtos
│   │   └── [slug]/         # Detalhe do produto
│   ├── cart/               # Página do carrinho
│   ├── checkout/           # Checkout
│   ├── login/              # Login
│   ├── register/           # Cadastro
│   ├── account/            # Conta do usuário
│   │   └── orders/         # Histórico de pedidos
│   ├── admin/              # Painel admin
│   └── api/                # API Routes
├── components/
│   ├── ui/                 # Componentes base (Button, Input, etc.)
│   ├── layout/             # Header, Footer, CartDrawer
│   ├── shop/               # ProductCard, ProductGrid, ShopFilters
│   └── home/               # Seções da homepage
├── lib/
│   └── supabase/           # Clientes Supabase (client, server, middleware)
├── hooks/                  # Custom hooks (useAuth, useSupabase)
├── store/                  # Zustand stores (cart, auth)
├── types/                  # TypeScript types + Database types
supabase/
└── migrations/
    ├── 001_initial_schema.sql  # Tabelas, RLS, triggers
    └── 002_seed_data.sql       # Dados iniciais de exemplo
```

## Setup

### 1. Criar projeto no Supabase

1. Acesse supabase.com e crie um novo projeto
2. Va em Settings > API e copie as chaves

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha com suas chaves do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 3. Executar migrations

No painel do Supabase, vá em SQL Editor e execute em ordem:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_seed_data.sql` (opcional - dados de exemplo)

### 4. Instalar dependências e rodar

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Funcionalidades

- **Homepage** — Hero, produtos em destaque, banner de categorias, newsletter
- **Shop** — Grid de produtos com filtros por categoria, tamanho e ordenação
- **Produto** — Galeria de imagens, seleção de variante, adicionar ao carrinho
- **Carrinho** — Drawer lateral, gerenciamento de quantidades
- **Checkout** — Formulário de endereço, resumo do pedido
- **Auth** — Login, cadastro via Supabase Auth
- **Conta** — Histórico de pedidos com timeline de status
- **Admin** — Dashboard com métricas e listagem de pedidos/produtos

## Tornar um usuário Admin

No SQL Editor do Supabase:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'seu@email.com';
```

## Deploy

```bash
npx vercel
```

Configure as variáveis de ambiente no painel da Vercel.
