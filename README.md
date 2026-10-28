# Econverse — vitrine de produtos

Vitrine responsiva desenvolvida em React, TypeScript e Sass. Os produtos são carregados por `fetch` a partir de `public/products.json`, e cada produto pode ser aberto em um modal de detalhes.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalar dependências

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

O Vite informará a URL local (normalmente `http://localhost:5173`).

## Compilar para produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`. Para visualizar a compilação localmente:

```bash
npm run preview
```

## Produtos

Edite `public/products.json` para adicionar ou atualizar produtos. Cada item deve conter `productName`, `descriptionShort`, `photo` e `price` (valor em reais). O carregamento e o estado de erro são tratados na aplicação.
