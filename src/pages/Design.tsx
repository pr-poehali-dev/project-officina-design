import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const STATUS_COLORS: Record<string, string> = {
  'В продаже':  'bg-accent text-accent-foreground',
  'Скоро':      'bg-secondary text-secondary-foreground',
  'Концепт':    'bg-primary/20 text-primary',
  'Архив':      'bg-muted text-muted-foreground',
};

const projects = [
  {
    id: 1,
    name: 'Cabernet Interior',
    car: 'BMW E46',
    status: 'В продаже',
    desc: 'Полный интерьер в духе итальянского ателье: кожа каберне, медные вставки, авторская приборная панель.',
    price: 284000,
    discount: 12,
    tall: true,
    image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg',
    parts: ['Рукоятка КПП Sport', 'Накладка приборной панели', 'Кронштейн зеркала медь'],
  },
  {
    id: 2,
    name: 'Anthracite Edition',
    car: 'Audi A4 B8',
    status: 'Скоро',
    desc: 'Сдержанный антрацит с золотыми строчками. Минимализм как форма уважения.',
    price: 196000,
    discount: 0,
    tall: false,
    image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg',
    parts: ['Рукоятка ручника кожа', 'Панель управления климатом'],
  },
  {
    id: 3,
    name: 'Verde Corsa',
    car: 'Mercedes C-Class W204',
    status: 'Концепт',
    desc: 'British Racing Green снаружи — бежевая кожа внутри. Классика в новом прочтении.',
    price: 0,
    discount: 0,
    tall: false,
    image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg',
    parts: [],
  },
  {
    id: 4,
    name: 'Bianco Milano',
    car: 'BMW E39',
    status: 'Архив',
    desc: 'Белая кожа с серебряными вставками. Проект завершён, доступен для изучения.',
    price: 0,
    discount: 0,
    tall: true,
    image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg',
    parts: [],
  },
];

const statuses = ['Все', 'В продаже', 'Скоро', 'Концепт', 'Архив'];

export default function Design() {
  const [filter, setFilter] = useState('Все');
  const [notify, setNotify] = useState<number[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  const filtered = projects.filter(p => filter === 'Все' || p.status === filter);

  const addBundle = (project: typeof projects[0], e: React.MouseEvent) => {
    e.preventDefault();
    setCart(prev => [...prev, ...project.parts]);
  };

  const handleNotify = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setNotify(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-display text-2xl text-primary">OFFICINA</span>
        </Link>
        <p className="hidden md:block text-sm text-muted-foreground tracking-wide">Проекты стайлинга</p>
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
        <p className="text-sm uppercase tracking-[0.3em] text-accent mb-3">Проекты стайлинга</p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground">Design</h1>
        <p className="mt-3 text-muted-foreground max-w-lg">Концептуальные проекты для конкретных автомобилей. Готовые комплекты или отдельные детали.</p>
      </div>

      {/* Status filters */}
      <div className="px-6 md:px-12 py-5 flex flex-wrap gap-2 border-b border-border">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${filter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Pinterest-style grid */}
      <div className="px-6 md:px-12 py-10 columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {filtered.map(p => (
          <div key={p.id} className="group break-inside-avoid bg-card rounded-sm overflow-hidden border border-border hover:border-primary transition-all duration-300">
            <div className={`relative overflow-hidden ${p.tall ? 'h-72' : 'h-44'}`}>
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className={`absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${STATUS_COLORS[p.status]}`}>
                {p.status}
              </span>
            </div>
            <div className="p-5">
              <p className="text-[11px] text-muted-foreground tracking-wide mb-1">{p.car}</p>
              <h3 className="font-display text-2xl text-foreground mb-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>

              {p.parts.length > 0 && (
                <div className="mb-4 space-y-1">
                  {p.parts.map(part => (
                    <div key={part} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      {part}
                    </div>
                  ))}
                </div>
              )}

              {p.status === 'В продаже' && p.price > 0 && (
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="font-display text-2xl text-primary">{p.price.toLocaleString('ru')} ₽</span>
                    {p.discount > 0 && (
                      <span className="ml-2 text-xs text-accent">−{p.discount}% за комплект</span>
                    )}
                  </div>
                  <button
                    onClick={e => addBundle(p, e)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors"
                  >
                    <Icon name="Package" size={14} />
                    Весь комплект
                  </button>
                </div>
              )}

              {p.status === 'Концепт' && (
                <button
                  onClick={e => handleNotify(p.id, e)}
                  disabled={notify.includes(p.id)}
                  className={`w-full mt-2 py-2 rounded-sm text-sm border transition-colors ${notify.includes(p.id) ? 'border-accent text-accent cursor-default' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}
                >
                  {notify.includes(p.id) ? '✓ Вы подписались на выход' : 'Сообщить о выходе'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
