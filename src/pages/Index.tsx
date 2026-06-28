import { useState } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/fa723ab3-0601-46a0-b67b-b945f941cd40.jpg';

const sections = [
  {
    id: 'officina',
    eyebrow: 'Каталог',
    title: 'Officina',
    desc: 'Технические изделия и тюнинг: приборки, ручки, крепления.',
    icon: 'Wrench',
    image: HERO_IMG,
  },
  {
    id: 'about',
    eyebrow: 'О бренде',
    title: 'О нас',
    desc: 'История, философия и команда. Блог, статьи и контакты.',
    icon: 'Feather',
    image: HERO_IMG,
  },
  {
    id: 'design',
    eyebrow: 'Проекты стайлинга',
    title: 'Design',
    desc: 'Концептуальные проекты для конкретных авто.',
    icon: 'Sparkles',
    image: HERO_IMG,
  },
];

const Index = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-anthracite">
      {/* Brand mark */}
      <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center">
        <span className="font-display text-3xl md:text-4xl tracking-tight text-background drop-shadow-lg">
          OFFICINA
        </span>
        <p className="hidden md:block text-[10px] uppercase tracking-[0.35em] text-background/70 mt-1">
          Итальянская душа · на русском языке
        </p>
      </div>

      {/* Three full-height columns */}
      <div className="flex flex-col md:flex-row h-full w-full">
        {sections.map((s, i) => {
          const active = hovered === s.id;
          const dimmed = hovered !== null && !active;
          return (
            <a
              key={s.id}
              id={s.id}
              href={`#${s.id}`}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative flex-1 overflow-hidden border-background/10 transition-all duration-700 ease-out
                ${i < sections.length - 1 ? 'md:border-r border-b md:border-b-0' : ''}
                ${active ? 'md:flex-[1.6]' : dimmed ? 'md:flex-[0.8]' : ''}`}
            >
              {/* Background image */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                  active ? 'scale-105' : 'scale-100'
                }`}
                style={{ backgroundImage: `url(${s.image})` }}
              />
              {/* Color veil */}
              <div
                className={`absolute inset-0 transition-all duration-700 ${
                  active
                    ? 'bg-primary/55'
                    : 'bg-anthracite/80 group-hover:bg-anthracite/70'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 via-transparent to-anthracite/40" />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="grain absolute inset-0 opacity-100" />
                <span
                  className={`mb-4 text-[11px] uppercase tracking-[0.35em] transition-colors duration-500 ${
                    active ? 'text-accent' : 'text-background/60'
                  }`}
                >
                  {s.eyebrow}
                </span>

                <Icon
                  name={s.icon}
                  size={34}
                  className={`mb-5 transition-all duration-500 ${
                    active ? 'text-accent scale-110' : 'text-background/80'
                  }`}
                />

                <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-background leading-none">
                  {s.title}
                </h2>

                <p
                  className={`mt-5 max-w-xs text-sm leading-relaxed text-background/70 transition-all duration-500 ${
                    active
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3 md:opacity-0'
                  }`}
                >
                  {s.desc}
                </p>

                <span
                  className={`mt-7 inline-flex items-center gap-2 text-sm tracking-wide text-background transition-all duration-500 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Войти
                  <Icon name="ArrowRight" size={16} />
                </span>

                {/* Idle hint line */}
                <span
                  className={`absolute bottom-10 h-px bg-accent transition-all duration-500 ${
                    active ? 'w-16' : 'w-8'
                  }`}
                />
              </div>
            </a>
          );
        })}
      </div>

      {/* Cart */}
      <button className="absolute top-6 right-6 z-30 flex items-center gap-2 text-background hover:text-accent transition-colors">
        <Icon name="ShoppingBag" size={22} />
        <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
          0
        </span>
      </button>
    </div>
  );
};

export default Index;
