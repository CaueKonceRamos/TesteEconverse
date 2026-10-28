import { useEffect, useRef, useState } from 'react';

type Product = {
  productName: string;
  descriptionShort: string;
  photo: string;
  price: number;
};

type ProductResponse = {
  success: boolean;
  products: Product[];
};

const categories = ['Celular', 'Acessórios', 'Tablets', 'Notebooks', 'TVs', 'Ver todos'];

const shortcuts = [
  { icon: '▣', label: 'Celulares' },
  { icon: '♧', label: 'Eletrodomésticos' },
  { icon: '▤', label: 'Informática' },
  { icon: '⚒', label: 'Ferramentas' },
  { icon: '⌕', label: 'Esporte e lazer' },
  { icon: '♧', label: 'Casa e decoração' },
  { icon: '♧', label: 'Mais categorias' },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(price);
}

function Logo() {
  return (
    <a className="logo" href="#" aria-label="Econverse, página inicial">
      <span className="logo-mark" aria-hidden="true">e</span>
      <span>econverse</span>
    </a>
  );
}

function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const installments = Math.floor(product.price / 10);

  return (
    <article className="product-card">
      <button
        className="product-card__open"
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`Ver detalhes de ${product.productName}`}
      >
        <img className="product-card__image" src={product.photo} alt={product.productName} />
        <span className="product-card__description">{product.descriptionShort}</span>
      </button>
      <div className="product-card__price">
        <strong>{formatPrice(product.price)}</strong>
        <span>ou 10x de {formatPrice(installments)} sem juros</span>
        <span className="product-card__shipping">Frete grátis</span>
      </div>
      <button
        className="button button--primary product-card__buy"
        type="button"
        onClick={() => onSelect(product)}
      >
        Comprar
      </button>
    </article>
  );
}

function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <button
          ref={closeButtonRef}
          className="product-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
        >
          ×
        </button>
        <img className="product-modal__image" src={product.photo} alt={product.productName} />
        <div className="product-modal__content">
          <p className="eyebrow">Produto em destaque</p>
          <h2 id="modal-title">{product.productName}</h2>
          <p id="modal-description" className="product-modal__description">
            {product.descriptionShort}
          </p>
          <p className="product-modal__price">{formatPrice(product.price)}</p>
          <p className="product-modal__installments">
            Em até 10x de {formatPrice(Math.floor(product.price / 10))} sem juros
          </p>
          <button className="button button--primary" type="button" onClick={onClose}>
            Adicionar à sacola
          </button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [loadError, setLoadError] = useState('');
  const productsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch('/products.json', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Não foi possível carregar os produtos (${response.status}).`);
        }

        const data = (await response.json()) as ProductResponse;
        if (!data.success || !Array.isArray(data.products)) {
          throw new Error('A resposta de produtos está em um formato inválido.');
        }
        setProducts(data.products);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadError(
          error instanceof Error ? error.message : 'Ocorreu um erro ao carregar os produtos.',
        );
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, []);

  function moveProducts(direction: -1 | 1) {
    productsTrackRef.current?.scrollBy({
      left: direction * productsTrackRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  }

  return (
    <>
      <header className="site-header">
        <div className="utility-bar">
          <span>Bem-vindo à Econverse!</span>
          <span>Compre com segurança e praticidade</span>
          <a href="#footer">Atendimento</a>
        </div>
        <div className="header-main page-container">
          <button className="icon-button menu-button" type="button" aria-label="Abrir menu">
            <span />
            <span />
            <span />
          </button>
          <Logo />
          <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
            <label className="visually-hidden" htmlFor="search-input">Buscar produtos</label>
            <input id="search-input" type="search" placeholder="O que você está buscando?" />
            <button type="submit" aria-label="Buscar">⌕</button>
          </form>
          <div className="header-actions">
            <button className="icon-button account-button" type="button" aria-label="Minha conta">♙</button>
            <button className="icon-button cart-button" type="button" aria-label="Sacola de compras">
              ♧<span className="cart-count">0</span>
            </button>
          </div>
        </div>
        <nav className="main-nav page-container" aria-label="Navegação principal">
          <a href="#categorias">Todas as categorias</a>
          <a href="#ofertas">Ofertas</a>
          <a href="#produtos">Celulares</a>
          <a href="#produtos">Eletrodomésticos</a>
          <a href="#produtos">Informática</a>
          <a href="#produtos">TVs e áudio</a>
          <a href="#produtos">Casa e decoração</a>
        </nav>
      </header>

      <main>
        <section className="hero page-container" aria-label="Ofertas em destaque">
          <div className="hero-copy">
            <p className="eyebrow">É hora de aproveitar</p>
            <h1>Venha conhecer nossas <span>promoções</span></h1>
            <p>As melhores ofertas para você aproveitar hoje.</p>
            <a className="button button--yellow" href="#produtos">Ver produtos</a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="hero-art__label">BLACK<br />FRIDAY</span>
            <span className="hero-art__device hero-art__device--one" />
            <span className="hero-art__device hero-art__device--two" />
          </div>
          <div className="hero-dots" aria-hidden="true"><i /><i /><i /></div>
        </section>

        <section className="category-shortcuts page-container" id="categorias" aria-label="Categorias">
          {shortcuts.map((shortcut) => (
            <a className="category-shortcut" href="#produtos" key={shortcut.label}>
              <span className="category-shortcut__icon" aria-hidden="true">{shortcut.icon}</span>
              <span>{shortcut.label}</span>
            </a>
          ))}
        </section>

        <section className="catalog-section page-container" id="produtos">
          <div className="section-heading">
            <span />
            <h2>Produtos relacionados</h2>
            <span />
          </div>
          <div className="category-tabs" role="tablist" aria-label="Categorias de produtos">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={activeCategory === category ? 'category-tabs__tab is-active' : 'category-tabs__tab'}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loadError ? (
            <p className="load-message load-message--error" role="alert">{loadError}</p>
          ) : products.length === 0 ? (
            <p className="load-message" role="status">Carregando produtos...</p>
          ) : (
            <div className="product-carousel">
              <button
                className="carousel-arrow carousel-arrow--previous"
                type="button"
                onClick={() => moveProducts(-1)}
                aria-label="Ver produtos anteriores"
              >
                ‹
              </button>
              <div className="product-track" ref={productsTrackRef}>
                {products.map((product, index) => (
                  <ProductCard
                    key={`${product.productName}-${index}`}
                    product={product}
                    onSelect={setSelectedProduct}
                  />
                ))}
              </div>
              <button
                className="carousel-arrow carousel-arrow--next"
                type="button"
                onClick={() => moveProducts(1)}
                aria-label="Ver próximos produtos"
              >
                ›
              </button>
            </div>
          )}
        </section>

        <section className="promo-banners page-container" id="ofertas" aria-label="Ofertas especiais">
          <a className="promo-banner" href="#produtos">
            <span className="promo-banner__copy"><strong>Paixão por tecnologia</strong><small>Encontre seu próximo favorito</small><b>Conferir</b></span>
            <span className="promo-banner__art promo-banner__art--one" aria-hidden="true" />
          </a>
          <a className="promo-banner promo-banner--second" href="#produtos">
            <span className="promo-banner__copy"><strong>Ofertas imperdíveis</strong><small>Descontos para aproveitar</small><b>Conferir</b></span>
            <span className="promo-banner__art promo-banner__art--two" aria-hidden="true" />
          </a>
        </section>

        <section className="brand-section page-container" aria-labelledby="brand-title">
          <div className="section-heading">
            <span />
            <h2 id="brand-title">Navegue por marcas</h2>
            <span />
          </div>
          <div className="brand-list">
            {['Samsung', 'Apple', 'Motorola', 'Xiaomi', 'Lenovo'].map((brand) => (
              <a className="brand-bubble" href="#produtos" key={brand} aria-label={`Produtos ${brand}`}>
                <span className="brand-bubble__mark" aria-hidden="true">●</span>{brand}
              </a>
            ))}
          </div>
        </section>
      </main>

      <section className="newsletter">
        <div className="page-container newsletter__inner">
          <div><h2>Inscreva-se em nossa newsletter</h2><p>Receba novidades e ofertas exclusivas.</p></div>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="visually-hidden" htmlFor="newsletter-email">Seu melhor e-mail</label>
            <input id="newsletter-email" type="email" placeholder="Seu melhor e-mail" />
            <button className="button button--yellow" type="submit">Enviar</button>
          </form>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="page-container footer-main">
          <div className="footer-about">
            <Logo />
            <p>Conectando você às melhores experiências de compra.</p>
            <div className="social-links" aria-label="Redes sociais"><a href="#footer" aria-label="Instagram">◎</a><a href="#footer" aria-label="Facebook">f</a><a href="#footer" aria-label="YouTube">▶</a></div>
          </div>
          <div><h2>Institucional</h2><a href="#footer">Quem somos</a><a href="#footer">Nossas lojas</a><a href="#footer">Trabalhe conosco</a></div>
          <div><h2>Ajuda</h2><a href="#footer">Central de atendimento</a><a href="#footer">Trocas e devoluções</a><a href="#footer">Política de privacidade</a></div>
          <div><h2>Minha conta</h2><a href="#footer">Meus pedidos</a><a href="#footer">Meus dados</a><a href="#footer">Acompanhar pedido</a></div>
        </div>
        <div className="footer-bottom"><p>© Econverse. Todos os direitos reservados.</p></div>
      </footer>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}

export default App;
