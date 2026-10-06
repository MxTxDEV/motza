# MOTZA — DROP 01

Site oficial e base de e-commerce da MOTZA (streetwear premium).
**Disciplina constrói liberdade.**

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build && npm start
npm run lint      # tsc --noEmit
```

## Estrutura

```
src/
  app/                 rotas: / /shop /colecao /produto/[slug] /sobre /lookbook
                       /contato /favoritos /checkout /api/checkout + sitemap/robots
  components/
    layout/            Header, Footer, SearchOverlay, Providers, ContactForm
    home/              Hero, DropSection, Manifesto, Mindset, Lookbook, Lightbox, InstagramSection
    shop/              ProductCard, ProductGrid, Filters, Sort, ShopView (+ filters.ts)
    product/           ProductGallery, ProductInfo, SizeSelector, ColorSelector, ProductDetails, SizeGuide
    cart/              CartDrawer, CartItem, CartSummary
    checkout/          CheckoutView
    ui/                Button, Typography (RevealText), ImageReveal, Reveal, SectionTitle, Marquee…
  context/             CartContext (localStorage), WishlistContext, UIContext
  data/                products.ts (catálogo central), images.ts, sizeGuide.ts, types.ts
  lib/                 catalog.ts (acesso a dados), payments/ (checkout), format, useDialog
  config/site.ts       nome, URL, redes sociais, navegação
scripts/generate-art.mjs   gera as imagens de campanha (placeholders)
```

## Catálogo

Todos os produtos vivem em `src/data/products.ts` (preço em centavos). As
páginas só falam com `src/lib/catalog.ts` — para ligar um banco/CMS, reimplemente
essas funções (já são `async`). O carrinho guarda apenas `productId/tamanho/cor/qtd`
e recalcula preços a partir do catálogo.

## Imagens

Ainda não há fotografias reais. `npm run gen:art` gera um conjunto coeso de
imagens editoriais (montanha / cidade / concreto, modelo em silhueta, peças
planas) em `public/images`. Para usar fotos reais, substitua os arquivos mantendo
os nomes — ou edite `src/data/images.ts` e o helper `gallery()` em
`src/data/products.ts`. (O script usa as fontes Anton instalada no sistema; ele
só é necessário para regenerar os placeholders.)

## Checkout e pagamento

O frontend nunca fala com um gateway. `CheckoutView` envia o carrinho para
`POST /api/checkout`, que **revalida tudo no servidor** (`lib/payments/pricing.ts`)
e delega ao `PaymentProvider` ativo (`lib/payments/index.ts`, via
`PAYMENT_PROVIDER`). Mercado Pago e Stripe estão como stubs em
`lib/payments/providers/` — implemente `createPayment` (Pix, cartão, redirect) e
defina as variáveis de `.env.example`. Sem provedor, a API responde `501
not_configured` e a tela mostra “Pedido validado”, sem cobrar nada.
Frete: hoje `0` em `pricing.ts` (ponto de integração com transportadora).

## Acessibilidade e performance

Skip link, foco visível, diálogos com trap de foco/ESC, `aria-*` nos seletores,
`prefers-reduced-motion` respeitado, `next/image` com `sizes`, fontes locais
(`next/font/local`), animações com `LazyMotion` (bundle reduzido) e CSS puro
para a transição de página.
