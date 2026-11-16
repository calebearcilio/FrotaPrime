<div align="center">

# 🚗 FrotaPrime — Frontend

**Interface web do sistema de locação de veículos FrotaPrime**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)

</div>

---

## 📑 Sumário

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Rotas da aplicação](#-rotas-da-aplicação)
- [Autenticação no cliente](#-autenticação-no-cliente)
- [Integração com a API](#-integração-com-a-api)
- [Componentes e páginas](#-componentes-e-páginas)
- [Interface e acessibilidade](#-interface-e-acessibilidade)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Como executar](#-como-executar)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Fluxo de uso](#-fluxo-de-uso)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📖 Sobre

O **Frontend FrotaPrime** é uma SPA (*Single Page Application*) construída com **React 19 + TypeScript + Vite** que consome a [API FrotaPrime](../api/README.md). Por meio dela, o usuário cria sua conta, gerencia a frota de veículos e registra, acompanha e finaliza locações.

---

## ✨ Funcionalidades

### 🔑 Acesso
- **Cadastro** de conta com nome, e-mail, senha e confirmação de senha;
- **Login** com e-mail e senha;
- Sessão persistida no navegador — o usuário continua logado ao recarregar a página;
- **Logout** e encerramento automático da sessão quando o token expira (resposta `401`).

### 🚙 Veículos
- **Cadastro** de veículos (marca, modelo, placa, ano e valor da diária);
- Placa normalizada automaticamente (sem espaços, em maiúsculas);
- Aviso específico quando a placa já está cadastrada;
- **Listagem** da frota com filtro de disponibilidade: *Todos*, *Disponíveis* ou *Indisponíveis*.

### 📋 Locações
- **Registro** de locação escolhendo um veículo disponível e o período;
- Validação de datas no cliente (devolução posterior ao início);
- Exibição do **valor total calculado pela API** logo após o registro;
- **Histórico** das locações do usuário com status *Ativa* / *Finalizada*;
- Ação **Finalizar** para devolver o veículo, que volta a ficar disponível.

---

## 🛠 Tecnologias

| Categoria | Tecnologia | Versão |
| --- | --- | --- |
| Biblioteca de UI | [React](https://react.dev/) | ^19.3 |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) | ~6.0 |
| Build / Dev server | [Vite](https://vite.dev/) + `@vitejs/plugin-react` | ^8.3 |
| Roteamento | [React Router](https://reactrouter.com/) | ^7.18 |
| Cliente HTTP | [Axios](https://axios-http.com/) | ^1.21 |
| Formulários | [React Hook Form](https://react-hook-form.com/) (disponível) | ^7.91 |
| Lint | [ESLint](https://eslint.org/) + `typescript-eslint` + plugins React Hooks/Refresh | ^10.14 |
| Estilos | CSS puro (`src/styles.css`) | — |
| Containerização | Docker / Docker Compose | — |

---

## 📂 Estrutura de pastas

```
frontend/
├── src/
│   ├── api/
│   │   └── api.ts              # Instância do Axios, interceptors, tipos e helper de erros
│   ├── assets/                 # Imagens estáticas
│   ├── auth/
│   │   ├── AuthContext.tsx     # AuthProvider (estado da sessão)
│   │   ├── authContext.ts      # Definição do contexto e tipagem
│   │   ├── sessionStorage.ts   # Leitura/escrita da sessão no localStorage
│   │   └── useAuth.ts          # Hook de acesso ao contexto
│   ├── components/
│   │   ├── Layout.tsx          # Cabeçalho, navegação e área autenticada
│   │   ├── ProtectedRoute.tsx  # Guardas de rota (ProtectedRoute / GuestOnlyRoute)
│   │   ├── RentalForm.tsx      # Formulário de nova locação
│   │   ├── RentalList.tsx      # Tabela de locações
│   │   ├── VehicleForm.tsx     # Formulário de cadastro de veículo
│   │   └── VehicleList.tsx     # Tabela de veículos
│   ├── page/
│   │   ├── AutomobilePage.tsx  # Página de veículos
│   │   ├── LoginPage.tsx       # Página de login
│   │   ├── RegisterPage.tsx    # Página de cadastro
│   │   ├── RentalsPage.tsx     # Página de locações
│   │   └── NotFoundPage.tsx    # Página 404
│   ├── App.tsx                 # Definição das rotas e layout de autenticação
│   ├── main.tsx                # Ponto de entrada (render do React)
│   └── styles.css              # Estilos globais
├── index.html
├── Dockerfile
├── eslint.config.js
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── package.json
```

---

## 🧭 Rotas da aplicação

| Rota | Página | Acesso | Descrição |
| --- | --- | --- | --- |
| `/login` | `LoginPage` | Somente visitantes | Login do usuário |
| `/cadastro` | `RegisterPage` | Somente visitantes | Criação de conta |
| `/veiculos` | `AutomobilePage` | Autenticado | Cadastro e listagem de veículos |
| `/locacoes` | `RentalsPage` | Autenticado | Registro, histórico e finalização de locações |
| `/` e `*` | — | Todos | Redireciona para `/veiculos` (logado) ou `/login` (visitante) |

**Guardas de rota** (`src/components/ProtectedRoute.tsx`):

- **`ProtectedRoute`** — se o usuário não estiver autenticado, redireciona para `/login`, guardando a rota de origem. Após o login, o usuário volta para onde estava.
- **`GuestOnlyRoute`** — impede que um usuário já autenticado acesse `/login` e `/cadastro`, redirecionando para `/veiculos`.

As rotas autenticadas são renderizadas dentro do **`Layout`**, que exibe o cabeçalho com a marca, a navegação (*Veículos* / *Locações*), os dados do usuário logado e o botão **Sair**.

---

## 🔐 Autenticação no cliente

```
LoginPage / RegisterPage
        │  POST /auth/login | /auth/cadastro
        ▼
  AuthProvider.login()  ──►  localStorage["frotaprime.auth"] = { user, token }
        │
        ▼
 Interceptor de requisição (Axios)  ──►  Authorization: Bearer <token>
        │
        ▼
 Interceptor de resposta: status 401?
        └─► limpa a sessão + dispara o evento "frotaprime:unauthorized"
                 └─► AuthProvider zera o estado → redirecionamento para /login
```

- **`AuthProvider`** (`src/auth/AuthContext.tsx`) mantém `user`, `token` e `isAuthenticated`, além das ações `login()` e `logout()`.
- **`useAuth()`** dá acesso ao contexto em qualquer componente (lança erro se usado fora do provider).
- **`sessionStorage.ts`** lê, valida e grava a sessão no `localStorage` sob a chave `frotaprime.auth`. Sessões corrompidas ou com formato inválido são descartadas automaticamente.
- As rotas públicas de autenticação (`/auth/login`, `/auth/cadastro`) **não** recebem o header `Authorization` e um `401` nelas não encerra a sessão.

---

## 🔌 Integração com a API

Toda a comunicação HTTP passa por [`src/api/api.ts`](./src/api/api.ts):

- Instância do Axios com `baseURL` definida por `VITE_API_URL` (padrão `http://localhost:3000`);
- Interceptors de requisição e resposta descritos acima;
- **Tipos compartilhados** espelhando as respostas da API: `AuthResponse`, `Vehicle`, `Rental` e `RentalStatus` (`"ACTIVE" | "COMPLETED"`);
- **`getApiErrorMessage(error, fallback)`** — extrai a mensagem mais relevante de um erro: primeiro a descrição da validação Zod (`errors[0].description`), depois `message` e, por fim, o texto de fallback.

| Ação na interface | Requisição |
| --- | --- |
| Criar conta | `POST /auth/cadastro` |
| Entrar | `POST /auth/login` |
| Listar veículos (com filtro) | `GET /veiculos?disponivel=true\|false` |
| Cadastrar veículo | `POST /veiculos` |
| Carregar veículos disponíveis no formulário de locação | `GET /veiculos?disponivel=true` |
| Listar minhas locações | `GET /locacoes` |
| Registrar locação | `POST /locacoes` |
| Finalizar locação | `PATCH /locacoes/:id/finalizar` |

> A documentação completa dos endpoints está no [README da API](../api/README.md#-endpoints).

---

## 🧩 Componentes e páginas

| Componente | Responsabilidade |
| --- | --- |
| `Layout` | Estrutura da área autenticada: cabeçalho, navegação com `NavLink`, identidade do usuário, logout e exibição de mensagens de sucesso vindas da navegação |
| `ProtectedRoute` / `GuestOnlyRoute` | Controle de acesso às rotas |
| `VehicleForm` | Cadastro de veículo, normalização da placa e tratamento do erro `409` (placa duplicada) |
| `VehicleList` | Tabela de veículos com diária em BRL e badge *Disponível* / *Indisponível* |
| `RentalForm` | Seleção de veículo disponível, datas de início/devolução, validação local e resumo da locação criada com o valor total |
| `RentalList` | Tabela de locações com datas formatadas, valor total, status e botão *Finalizar* |
| `AutomobilePage` | Orquestra `VehicleForm` + `VehicleList` e o filtro de disponibilidade |
| `RentalsPage` | Orquestra `RentalForm` + `RentalList`, finalização e recarregamento dos dados |
| `LoginPage` / `RegisterPage` | Formulários de autenticação, exibidos dentro do `AuthFrame` (painel de marca + formulário) |

**Padrões adotados:**

- Estados explícitos de **carregamento**, **erro** e **lista vazia** em todas as listagens;
- Requisições em `useEffect` com flag `isActive` para evitar atualização de estado após desmontagem;
- Recarregamento controlado por uma `reloadKey` — após criar ou finalizar uma locação, a lista e os veículos disponíveis são atualizados;
- Botões desabilitados e com texto de progresso durante o envio (*"Cadastrando..."*, *"Finalizando..."*).

---

## 🎨 Interface e acessibilidade

- Tipografia **DM Sans** (texto) e **Space Grotesk** (títulos) via Google Fonts;
- Tela de acesso dividida em painel de marca e painel de formulário;
- Valores monetários formatados em **Real (BRL)** e datas no padrão **pt-BR** com `Intl`;
- Mensagens de erro com `role="alert"` e de sucesso com `role="status"`, anunciadas por leitores de tela;
- Campos com `label` associado, `autoComplete` adequado e `aria-invalid` / `aria-describedby` no erro de placa;
- Indicador de foco visível (`:focus-visible`) em botões e campos;
- Documento declarado como `lang="pt-BR"`.

---

## 🔧 Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | :---: | --- | --- |
| `VITE_API_URL` | ❌ | `http://localhost:3000` | URL base da API |
| `FRONTEND_PORT` | ❌ | `5173` | Porta exposta pelo Docker Compose (definida no `.env` da raiz) |

Para rodar localmente apontando para outra API, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

> Variáveis com prefixo `VITE_` são incorporadas ao bundle no build e ficam visíveis no navegador — nunca coloque segredos nelas.

---

## 🚀 Como executar

### Opção 1 — Docker (recomendado)

Na **raiz do repositório**:

```bash
docker compose up --build --watch
```

O frontend fica disponível em **http://localhost:5173**, já configurado para a API em `http://localhost:3000`. Alterações em `frontend/src` são sincronizadas e recarregadas automaticamente (HMR).

### Opção 2 — Localmente

Pré-requisitos: **Node.js 24+** e a [API](../api/README.md#-como-executar) em execução.

```bash
cd frontend
npm install
npm run dev
```

Acesse **http://localhost:5173**.

### Build de produção

```bash
npm run build     # verifica os tipos e gera os arquivos em dist/
npm run preview   # serve o build localmente para conferência
```

---

## 📜 Scripts disponíveis

| Script | Comando | Descrição |
| --- | --- | --- |
| `dev` | `vite` | Servidor de desenvolvimento com HMR |
| `build` | `tsc -b && vite build` | Checagem de tipos + build otimizado em `dist/` |
| `lint` | `eslint .` | Análise estática do código |
| `preview` | `vite preview` | Serve localmente o build de produção |

---

## 🧪 Fluxo de uso

1. Acesse `http://localhost:5173` — você será redirecionado para **/login**;
2. Clique em **Criar conta**, preencha seus dados e confirme — o login é feito automaticamente;
3. Em **Veículos**, cadastre um ou mais veículos e use o filtro de disponibilidade para conferir a frota;
4. Em **Locações**, escolha um veículo disponível, informe as datas e clique em **Registrar locação** — o valor total calculado pela API é exibido;
5. Na tabela **Minhas locações**, clique em **Finalizar** para devolver o veículo; ele volta a aparecer como disponível;
6. Clique em **Sair** para encerrar a sessão.

---

## 👥 Autores

| [calebearcilio](https://github.com/calebearcilio) | [luispaivaa](https://github.com/luispaivaa) | [matheushromao](https://github.com/matheushromao) |
| :---: | :---: | :---: |

---

## 📄 Licença

Distribuído sob a licença **ISC**.

<div align="center">

[⬅ Voltar para o README principal](../README.md) · [Ver README da API ➡](../api/README.md)

</div>
