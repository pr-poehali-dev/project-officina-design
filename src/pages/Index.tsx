import { useState } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/fa723ab3-0601-46a0-b67b-b945f941cd40.jpg';

const sections = [
  {
    id: 'officina',
    eyebrow: 'Каталог',
    title: 'Officina',
    desc: 'Технические изделия и тюнинг: приборки, ручки, крепления. С фильтрами и корзиной.',
    icon: 'Wrench',
  },
  {
    id: 'design',
    eyebrow: 'Проекты стайлинга',
    title: 'Design',
    desc: 'Концептуальные проекты для конкретных авто. Купить деталь или весь комплект.',
    icon: 'Sparkles',
  },
  {
    id: 'about',
    eyebrow: 'О бренде',
    title: 'О нас',
    desc: 'История, философия и команда. Блог, статьи и контакты.',
    icon: 'Feather',
  },
];

const Index = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl tracking-tight text-primary">OFFICINA</span>
          <span className="hidden sm:inline text-[11px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
            Atelier
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-foreground/70 hover:text-primary transition-colors">
              {s.title}
            </a>
          ))}
        </nav>
        <button className="relative flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <Icon name="ShoppingBag" size={20} />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
            0
          </span>
        </button>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-10 md:pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left text */}
          <div className="lg:col-span-6 relative z-10">
            <div className="h-px w-24 bg-accent animate-line mb-8" />
            <p
              className="text-sm uppercase tracking-[0.35em] text-accent mb-6 animate-float-up"
              style={{ animationDelay: '0.1s' }}
            >
              Итальянская душа
            </p>
            <h1
              className="font-display text-5xl md:text-7xl xl:text-8xl leading-[0.95] text-foreground animate-float-up"
              style={{ animationDelay: '0.2s' }}
            >
              говорит
              <br />
              <span className="italic text-primary">на русском</span>
              <br />
              языке
            </h1>
            <p
              className="mt-8 max-w-md text-base md:text-lg text-muted-foreground text-balance animate-float-up"
              style={{ animationDelay: '0.35s' }}
            >
              Премиальный автомобильный стайлинг и собственные технические изделия.
              Три мира — каталог, проекты и философия бренда.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-float-up" style={{ animationDelay: '0.5s' }}>
              <a
                href="#officina"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-sm tracking-wide hover:bg-[hsl(351,41%,26%)] transition-colors"
              >
                Смотреть каталог
                <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#design"
                className="inline-flex items-center gap-3 border border-primary/40 text-primary px-8 py-4 rounded-sm tracking-wide hover:border-primary hover:bg-primary/5 transition-colors"
              >
                Проекты стайлинга
              </a>
            </div>
          </div>

          {/* Right image */}
          <div className="lg:col-span-6 relative animate-float-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative grain rounded-sm overflow-hidden shadow-2xl">
              <img
                src={HERO_IMG}
                alt="Премиальный автомобильный интерьер"
                className="w-full h-[340px] md:h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-anthracite/50 to-transparent" />
              <div className="absolute bottom-5 left-5 text-background">
                <p className="text-[11px] uppercase tracking-[0.3em] opacity-80">Atelier № 01</p>
                <p className="font-display text-2xl">Cabernet Edition</p>
              </div>
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 bg-card border border-border rounded-sm px-6 py-4 shadow-xl">
              <p className="font-display text-3xl text-primary leading-none">12+</p>
              <p className="text-xs text-muted-foreground tracking-wide mt-1">проектов в работе</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three sections */}
      <section className="px-6 md:px-12 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {sections.map((s, i) => (
            <a
              key={s.id}
              id={s.id}
              href={`#${s.id}`}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative flex flex-col justify-between min-h-[280px] p-8 rounded-sm border border-border bg-card overflow-hidden transition-all duration-500 hover:border-primary animate-float-up"
              style={{ animationDelay: `${0.5 + i * 0.12}s` }}
            >
              <div
                className="absolute inset-0 bg-primary transition-transform duration-500 ease-out"
                style={{
                  transform: hovered === s.id ? 'translateY(0)' : 'translateY(101%)',
                }}
              />
              <div className="relative z-10 flex items-center justify-between">
                <span
                  className={`text-xs uppercase tracking-[0.3em] transition-colors duration-500 ${
                    hovered === s.id ? 'text-primary-foreground/70' : 'text-accent'
                  }`}
                >
                  {s.eyebrow}
                </span>
                <Icon
                  name={s.icon}
                  size={22}
                  className={`transition-colors duration-500 ${
                    hovered === s.id ? 'text-primary-foreground' : 'text-primary'
                  }`}
                />
              </div>
              <div className="relative z-10">
                <h2
                  className={`font-display text-4xl mb-3 transition-colors duration-500 ${
                    hovered === s.id ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {s.title}
                </h2>
                <p
                  className={`text-sm leading-relaxed transition-colors duration-500 ${
                    hovered === s.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}
                >
                  {s.desc}
                </p>
                <span
                  className={`mt-5 inline-flex items-center gap-2 text-sm tracking-wide transition-colors duration-500 ${
                    hovered === s.id ? 'text-primary-foreground' : 'text-primary'
                  }`}
                >
                  Перейти
                  <Icon name="ArrowUpRight" size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-2xl text-primary">OFFICINA</span>
        <p className="text-sm text-muted-foreground tracking-wide">
          Итальянская душа говорит на русском языке
        </p>
        <div className="flex items-center gap-5 text-primary">
          <a href="#" className="hover:text-accent transition-colors"><Icon name="Send" size={18} /></a>
          <a href="#" className="hover:text-accent transition-colors"><Icon name="Instagram" size={18} /></a>
          <a href="#" className="hover:text-accent transition-colors"><Icon name="Mail" size={18} /></a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
