import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const ABOUT_IMG = 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/325ab3ab-f8a5-49a5-b385-77bc145de420.jpg';

const team = [
  { name: 'Алессандро Р.', role: 'Основатель и главный дизайнер', note: 'Миланская школа, 14 лет в автостайлинге' },
  { name: 'Максим К.', role: 'Технический директор', note: 'Инженер-конструктор, специализация — интерьер' },
  { name: 'Юлия Т.', role: 'Менеджер проектов', note: 'Связь с клиентами и координация заказов' },
];

const articles = [
  { id: 1, date: '15 июня 2025', title: 'Медь как акцент: почему мы выбрали этот металл', tags: ['Дизайн', 'Материалы'], preview: 'Медь — не просто декоративный элемент. Это температура, тактильность и характер…' },
  { id: 2, date: '3 мая 2025', title: 'Итальянская школа дизайна: что Россия взяла у Милана', tags: ['История', 'Философия'], preview: 'Каноны карозерии до сих пор формируют наш взгляд на форму автомобиля…' },
  { id: 3, date: '18 апреля 2025', title: 'Как мы делаем рукоятку КПП за 40 часов', tags: ['Производство'], preview: 'От эскиза до изделия — семь этапов, которые нельзя ускорить без потери качества…' },
];

export default function About() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-display text-2xl text-primary">OFFICINA</span>
        </Link>
        <p className="hidden md:block text-sm text-muted-foreground tracking-wide">О нас</p>
        <div />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden h-[60vh] min-h-[400px]">
        <img src={ABOUT_IMG} alt="Мастерская" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 via-anthracite/40 to-transparent" />
        <div className="absolute bottom-10 left-6 md:left-12">
          <p className="text-sm uppercase tracking-[0.35em] text-accent mb-3">О бренде</p>
          <h1 className="font-display text-5xl md:text-7xl text-background leading-none">
            Итальянская душа<br />
            <span className="italic">на русском языке</span>
          </h1>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 md:px-12 py-16 grid md:grid-cols-2 gap-12 max-w-6xl">
        <div>
          <div className="h-px w-16 bg-accent mb-8" />
          <h2 className="font-display text-4xl mb-6">Наша философия</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            OFFICINA — это пространство, где итальянская традиция встречает русский характер.
            Мы убеждены: автомобиль — это продолжение личности. Каждая деталь, которую мы создаём, несёт в себе намерение.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Мы не производим тираж. Мы создаём изделия. Разница между этим — в том, что вы чувствуете, когда кладёте руку на руль.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[['2019', 'Год основания'], ['120+', 'Проектов'], ['4', 'Страны доставки'], ['100%', 'Ручная работа']].map(([num, label]) => (
            <div key={label} className="bg-card border border-border rounded-sm p-6">
              <p className="font-display text-4xl text-primary">{num}</p>
              <p className="text-sm text-muted-foreground mt-2 tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-6 md:px-12 py-12 border-t border-border">
        <h2 className="font-display text-4xl mb-8">Команда</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {team.map(member => (
            <div key={member.name} className="bg-card border border-border rounded-sm p-6 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                <Icon name="User" size={22} className="text-primary" />
              </div>
              <h3 className="font-display text-xl mb-1">{member.name}</h3>
              <p className="text-sm text-accent mb-2">{member.role}</p>
              <p className="text-xs text-muted-foreground">{member.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="px-6 md:px-12 py-12 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-4xl">Блог</h2>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{articles.length} статьи</span>
        </div>
        <div className="space-y-px">
          {articles.map(a => (
            <div key={a.id} className="group flex flex-col md:flex-row md:items-start gap-4 py-7 border-b border-border hover:bg-card transition-colors px-2 -mx-2 rounded-sm cursor-pointer">
              <span className="text-xs text-muted-foreground md:w-32 flex-shrink-0 mt-1">{a.date}</span>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {a.tags.map(t => <span key={t} className="text-[10px] uppercase tracking-widest text-accent">{t}</span>)}
                </div>
                <h3 className="font-display text-xl group-hover:text-primary transition-colors">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.preview}</p>
              </div>
              <Icon name="ArrowUpRight" size={18} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 md:px-12 py-16 border-t border-border">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <h2 className="font-display text-4xl mb-6">Контакты</h2>
            <div className="space-y-4">
              {[
                { icon: 'Mail', label: 'hello@officina-atelier.ru' },
                { icon: 'Phone', label: '+7 (999) 000-00-00' },
                { icon: 'MapPin', label: 'Москва, Малая Полянка, 2' },
                { icon: 'Send', label: '@officina_atelier' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Icon name={c.icon} size={18} className="text-accent flex-shrink-0" />
                  <span className="text-sm">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-10 text-center">
                <Icon name="CheckCircle" size={40} className="text-accent" />
                <p className="font-display text-2xl">Сообщение отправлено</p>
                <p className="text-sm text-muted-foreground">Мы свяжемся с вами в течение одного дня</p>
              </div>
            ) : (
              <>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Имя" className="w-full px-4 py-3 rounded-sm bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-sm bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
                <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="Сообщение" rows={4} className="w-full px-4 py-3 rounded-sm bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none" />
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-sm text-sm tracking-wide hover:bg-[hsl(351,41%,26%)] transition-colors">
                  Отправить
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-2xl text-primary">OFFICINA</span>
        <p className="text-sm text-muted-foreground">Итальянская душа говорит на русском языке</p>
        <div className="flex items-center gap-5 text-primary">
          <a href="#" className="hover:text-accent transition-colors"><Icon name="Send" size={18} /></a>
          <a href="#" className="hover:text-accent transition-colors"><Icon name="Instagram" size={18} /></a>
        </div>
      </footer>
    </div>
  );
}
