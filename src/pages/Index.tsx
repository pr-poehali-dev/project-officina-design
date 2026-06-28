import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';
import { useAdmin } from '@/lib/admin-context';
import { api } from '@/lib/api';

const DEFAULTS = {
  brand_name: 'Paterno',
  brand_tagline: 'Итальянская душа говорит на русском языке',
  officina_title: 'Officina',
  officina_eyebrow: 'Производство и ресейл',
  officina_desc: 'Технические изделия собственного производства. Каждая деталь — характер.',
  officina_image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg',
  design_title: 'Design',
  design_eyebrow: 'Авторские проекты',
  design_desc: 'Концептуальные проекты для конкретных автомобилей.',
  design_image: 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/64a1bde8-7cbe-43b6-b460-d786185e4b24.jpg',
};

export default function Index() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [content, setContent] = useState(DEFAULTS);
  const [showLogin, setShowLogin] = useState(false);
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  // Секретный вход: 5 кликов по логотипу
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secretClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 2000);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      if (!isAdmin) setShowLogin(true);
    }
  };

  useEffect(() => {
    api.getContent().then(data => setContent(c => ({ ...c, ...data }))).catch(() => {});
  }, []);

  const sections = [
    { id: 'officina', href: '/officina', icon: 'Wrench',
      eyebrow: content.officina_eyebrow, title: content.officina_title,
      desc: content.officina_desc, image: content.officina_image },
    { id: 'design', href: '/design', icon: 'Sparkles',
      eyebrow: content.design_eyebrow, title: content.design_title,
      desc: content.design_desc, image: content.design_image },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-anthracite">
      {/* Brand */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center select-none">
        <button onClick={secretClick} className="font-display text-3xl md:text-4xl tracking-tight text-background drop-shadow-lg focus:outline-none">
          {content.brand_name}
        </button>
        <p className="hidden md:block text-[10px] uppercase tracking-[0.35em] text-background/70 mt-1">
          {content.brand_tagline}
        </p>
      </div>

      {/* Admin badge */}
      {isAdmin && (
        <div className="absolute top-6 left-6 z-30 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest bg-accent text-accent-foreground px-3 py-1 rounded-sm">
            Режим редактирования
          </span>
          <button onClick={logout} className="text-background/60 hover:text-background transition-colors" title="Выйти">
            <Icon name="LogOut" size={16} />
          </button>
        </div>
      )}

      {/* Two full-height columns */}
      <div className="flex flex-col md:flex-row h-full w-full">
        {sections.map((s, i) => {
          const active = hovered === s.id;
          const dimmed = hovered !== null && !active;
          return (
            <button
              key={s.id}
              onClick={() => navigate(s.href)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative flex-1 overflow-hidden border-background/10 transition-all duration-700 ease-out text-left
                ${i === 0 ? 'md:border-r border-b md:border-b-0' : ''}
                ${active ? 'md:flex-[1.55]' : dimmed ? 'md:flex-[0.85]' : ''}`}
            >
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${active ? 'scale-105' : 'scale-100'}`}
                style={{ backgroundImage: `url(${s.image})` }}
              />
              <div className={`absolute inset-0 transition-all duration-700 ${active ? 'bg-primary/50' : 'bg-anthracite/75'}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 via-transparent to-anthracite/30" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
                <span className={`mb-4 text-[11px] uppercase tracking-[0.35em] transition-colors duration-500 ${active ? 'text-accent' : 'text-background/60'}`}>
                  {s.eyebrow}
                </span>
                <Icon name={s.icon} size={32} className={`mb-5 transition-all duration-500 ${active ? 'text-accent scale-110' : 'text-background/70'}`} />
                <h2 className="font-display text-6xl md:text-7xl lg:text-8xl text-background leading-none">
                  {s.title}
                </h2>
                <p className={`mt-5 max-w-xs text-sm leading-relaxed text-background/70 transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                  {s.desc}
                </p>
                <span className={`mt-7 inline-flex items-center gap-2 text-sm tracking-wide text-background transition-all duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
                  Перейти
                  <Icon name="ArrowRight" size={16} />
                </span>
                <span className={`absolute bottom-10 h-px bg-accent transition-all duration-500 ${active ? 'w-16' : 'w-8'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
    </div>
  );
}
