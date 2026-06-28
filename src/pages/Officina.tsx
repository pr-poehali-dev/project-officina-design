import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const products = [
  { id: 1, article: 'OF-001', name: 'Рукоятка КПП Sport', price: 4800, category: 'Ручки', car: 'Universal', isNew: true, image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg' },
  { id: 2, article: 'OF-002', name: 'Накладка приборной панели', price: 12400, category: 'Приборки', car: 'BMW', isNew: false, image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg' },
  { id: 3, article: 'OF-003', name: 'Крепление антенны медь', price: 2200, category: 'Крепления', car: 'Audi', isNew: true, image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg' },
  { id: 4, article: 'OF-004', name: 'Рукоятка ручника кожа', price: 3600, category: 'Ручки', car: 'Mercedes', isNew: false, image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg' },
  { id: 5, article: 'OF-005', name: 'Панель управления климатом', price: 18900, category: 'Приборки', car: 'BMW', isNew: false, image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg' },
  { id: 6, article: 'OF-006', name: 'Кронштейн зеркала медь', price: 5100, category: 'Крепления', car: 'Universal', isNew: true, image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg' },
];

const categories = ['Все', 'Приборки', 'Ручки', 'Крепления'];
const cars = ['Все марки', 'Universal', 'BMW', 'Audi', 'Mercedes'];

export default function Officina() {
  const [cat, setCat] = useState('Все');
  const [car, setCar] = useState('Все марки');
  const [sort, setSort] = useState('new');
  const [cart, setCart] = useState<number[]>([]);

  const filtered = products
    .filter(p => cat === 'Все' || p.category === cat)
    .filter(p => car === 'Все марки' || p.car === car)
    .sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  const addToCart = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setCart(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-display text-2xl text-primary">OFFICINA</span>
        </Link>
        <p className="hidden md:block text-sm text-muted-foreground tracking-wide">Каталог</p>
        <Link to="/" className="relative text-primary hover:text-accent transition-colors">
          <Icon name="ShoppingBag" size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
      </header>

      <div className="px-6 md:px-12 pt-12 pb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-accent mb-3">Каталог</p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground">Officina</h1>
        <p className="mt-3 text-muted-foreground max-w-lg">Технические изделия и тюнинг собственного производства. Каждая деталь — характер.</p>
      </div>

      {/* Filters */}
      <div className="px-6 md:px-12 py-6 flex flex-wrap gap-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${cat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {cars.map(c => (
            <button
              key={c}
              onClick={() => setCar(c)}
              className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${car === c ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-foreground hover:border-secondary'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="ml-auto px-4 py-1.5 rounded-sm text-sm border border-border bg-background text-foreground focus:outline-none focus:border-primary"
        >
          <option value="new">Сначала новинки</option>
          <option value="asc">Цена ↑</option>
          <option value="desc">Цена ↓</option>
        </select>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="group relative bg-card rounded-sm overflow-hidden border border-border hover:border-primary transition-all duration-300">
            <div className="relative overflow-hidden h-52">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {p.isNew && (
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] bg-accent text-accent-foreground px-2 py-1">
                  Новинка
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-[11px] text-muted-foreground tracking-wide mb-1">{p.article} · {p.category} · {p.car}</p>
              <h3 className="font-display text-xl text-foreground mb-3">{p.name}</h3>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-primary">{p.price.toLocaleString('ru')} ₽</span>
                <button
                  onClick={e => addToCart(p.id, e)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors"
                >
                  <Icon name="ShoppingBag" size={15} />
                  В корзину
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-6 md:px-12 py-20 text-center text-muted-foreground">
          <Icon name="SearchX" size={36} className="mx-auto mb-4 opacity-40" />
          <p>По выбранным фильтрам товаров не найдено</p>
        </div>
      )}
    </div>
  );
}
