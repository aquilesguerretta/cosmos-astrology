# COSMOS — Premium Astrology Platform
# LEIA ESTE ARQUIVO INTEIRO ANTES DE FAZER QUALQUER COISA

## O que é este projeto
Plataforma de astrologia premium chamada Cosmos. Design já foi criado no Figma Make
e o código exportado está na pasta `/figma-export/` deste repositório.
O objetivo é transformar esse código estático em uma aplicação Next.js 15
totalmente funcional, com cálculos astrológicos reais, IA, auth e banco de dados.

## Stack Final
- Framework: Next.js 15 (App Router)
- Linguagem: TypeScript strict
- Estilização: Tailwind CSS + CSS variables do design original
- Animações: Framer Motion
- Cálculos astrológicos: swisseph-v2 (Swiss Ephemeris via WASM)
- Auth: NextAuth.js v5
- Banco de dados: PostgreSQL via Prisma ORM
- IA: Anthropic Claude API (claude-sonnet-4-6)
- Geocoding: OpenCage API (cidade → lat/lng)
- Deploy: Vercel
- Repo: https://github.com/aquilesguerretta/cosmos-astrology

## Design System (extraído do Figma)
Fontes: Cormorant Garamond (display) + DM Sans (body)
Tema: dark luxury — deep space com gold e violet

Cores principais:
  --bg-primary: #0A0A0F
  --bg-secondary: #12121A
  --bg-card: rgba(255,255,255,0.04)
  --accent-gold: #C9A84C
  --accent-gold-light: #E8C97A
  --purple-deep: #2D1B69
  --purple-mid: #4A2D9E
  --text-primary: #F0EDE8
  --text-secondary: #9B97A8
  --border-subtle: rgba(201,168,76,0.15)
  --border-active: rgba(201,168,76,0.5)

## Estrutura de Páginas (já desenhadas no Figma)
1. Landing Page — hero com star field, form de dados natais, CTAs
2. Sanctum (Dashboard) — visão geral cósmica, posições planetárias, cards
3. Natal Chart — roda SVG interativa, tabela de planetas, grade de aspectos, IA
4. Daily Reading — 12 cards de signos, leitura expandida, "Ask the Stars"
5. Synastry — comparação de dois mapas, score de ressonância, aspectos
6. Profile — dados natais, notificações, mapas salvos, plano

## Estrutura de Pastas (após setup)
cosmos-astrology/
├── figma-export/          ← código original do Figma (NÃO APAGAR)
├── app/
│   ├── (marketing)/       ← landing page (sem auth)
│   ├── (auth)/            ← login, register, onboarding
│   ├── (dashboard)/       ← páginas autenticadas
│   │   ├── sanctum/       ← dashboard principal
│   │   ├── chart/         ← mapa natal
│   │   ├── reading/       ← horóscopo diário
│   │   ├── synastry/      ← compatibilidade
│   │   └── profile/       ← perfil
│   ├── api/               ← API routes
│   └── globals.css
├── components/
│   ├── ui/                ← Button, Card, Input, Badge...
│   ├── chart/             ← BirthChartWheel, PlanetTable, AspectGrid
│   ├── reading/           ← ZodiacCards, HoroscopePanel
│   ├── synastry/          ← ResonanceRing, SynastryAspects
│   └── layout/            ← Navbar, Sidebar, StarField
├── lib/
│   ├── astrology/         ← ephemeris.ts, houses.ts, aspects.ts
│   ├── ai/                ← claude.ts (interpretações)
│   └── utils/
├── prisma/
│   └── schema.prisma
└── CLAUDE.md

## Regras de Código
- NUNCA apagar ou modificar a pasta figma-export/
- SEMPRE usar TypeScript — zero arquivos .js
- NUNCA usar inline styles — só className com Tailwind
- Todo async com error boundaries
- Zod para validação de forms e APIs
- Commits por feature: "feat: birth chart wheel" não "update stuff"

## Comandos
- Dev: npm run dev
- Build: npm run build  
- DB migrate: npx prisma migrate dev
- Type check: npm run type-check

## Variáveis de Ambiente necessárias (.env.local)
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ANTHROPIC_API_KEY=
OPENCAGE_API_KEY=

## IMPORTANTE — Precisão dos Cálculos
Usar Swiss Ephemeris (swisseph-v2) — mesmo motor do Astro-Seek
Sistema de casas: Placidus (padrão), com opção Whole Sign
Zodíaco Tropical (astrologia ocidental)
Sempre armazenar em UTC, exibir no fuso local do usuário
