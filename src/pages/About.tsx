import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { api, Article, TeamMember } from '@/lib/api';
import { useAdmin } from '@/lib/admin-context';
import Editable from '@/components/Editable';

const EMPTY_ARTICLE: Article = { id: 0, pub_date: '', title: '', tags: [], preview: '', visible: true };
const EMPTY_MEMBER: TeamMember = { id: 0, name: '', role: '', note: '', sort_order: 0, visible: true };

export default function About() {
  const { isAdmin } = useAdmin();
  const [content, setContent] = useState<Record<string, string>>({});
  const [articles, setArticles] = useState<Article[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    api.getContent().then(setContent).catch(() => {});
    api.getArticles().then(setArticles).catch(() => {});
    api.getTeam().then(setTeam).catch(() => {});
  }, []);

  // Articles CRUD
  const openCreateArticle = () => { setEditingArticle({ ...EMPTY_ARTICLE }); setTagsInput(''); setShowArticleForm(true); };
  const openEditArticle = (a: Article, e: React.MouseEvent) => { e.stopPropagation(); setEditingArticle({ ...a }); setTagsInput(a.tags.join(', ')); setShowArticleForm(true); };
  const saveArticle = async () => {
    if (!editingArticle) return;
    setSaving(true);
    const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean);
    const data = { ...editingArticle, tags };
    try {
      if (data.id === 0) {
        const created = await api.createArticle(data);
        setArticles(prev => [created, ...prev]);
      } else {
        const updated = await api.updateArticle(data.id, data);
        setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
      }
      setShowArticleForm(false);
    } finally { setSaving(false); }
  };
  const deleteArticle = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Удалить статью?')) return;
    await api.deleteArticle(id);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // Team CRUD
  const openCreateMember = () => { setEditingMember({ ...EMPTY_MEMBER }); setShowMemberForm(true); };
  const openEditMember = (m: TeamMember, e: React.MouseEvent) => { e.stopPropagation(); setEditingMember({ ...m }); setShowMemberForm(true); };
  const saveMember = async () => {
    if (!editingMember) return;
    setSaving(true);
    try {
      if (editingMember.id === 0) {
        const created = await api.createTeamMember(editingMember);
        setTeam(prev => [...prev, created]);
      } else {
        const updated = await api.updateTeamMember(editingMember.id, editingMember);
        setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
      }
      setShowMemberForm(false);
    } finally { setSaving(false); }
  };
  const deleteMember = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Удалить участника?')) return;
    await api.deleteTeamMember(id);
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  const stats = [
    ['stat_founded', 'Год основания'],
    ['stat_projects', 'Проектов'],
    ['stat_countries', 'Страны доставки'],
    ['stat_handmade', 'Ручная работа'],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-display text-2xl text-primary">{content.brand_name || 'Paterno'}</span>
        </Link>
        <p className="hidden md:block text-sm text-muted-foreground tracking-wide">О нас</p>
        <div className="w-6" />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden h-[55vh] min-h-[360px]">
        <img src={content.about_image || ''} alt="Мастерская" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 via-anthracite/40 to-transparent" />
        <div className="absolute bottom-10 left-6 md:left-12">
          <p className="text-sm uppercase tracking-[0.35em] text-accent mb-3">
            <Editable contentKey="about_title" value={content.about_title || 'О Paterno'} className="text-accent" />
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-background leading-none">
            Итальянская душа<br /><span className="italic">на русском языке</span>
          </h1>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 md:px-12 py-16 grid md:grid-cols-2 gap-12 max-w-6xl">
        <div>
          <div className="h-px w-16 bg-accent mb-8" />
          <h2 className="font-display text-4xl mb-6">Наша философия</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            <Editable contentKey="about_philosophy" value={content.about_philosophy || ''} multiline as="p" className="text-muted-foreground leading-relaxed" />
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <Editable contentKey="about_philosophy_2" value={content.about_philosophy_2 || ''} multiline as="p" className="text-muted-foreground leading-relaxed" />
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {stats.map(([key, label]) => (
            <div key={key} className="bg-card border border-border rounded-sm p-6">
              <p className="font-display text-4xl text-primary">
                <Editable contentKey={key} value={content[key] || '—'} />
              </p>
              <p className="text-sm text-muted-foreground mt-2 tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-6 md:px-12 py-12 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-4xl">Команда</h2>
          {isAdmin && (
            <button onClick={openCreateMember} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-sm text-sm hover:opacity-90">
              <Icon name="UserPlus" size={16} /> Добавить
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {team.map(member => (
            <div key={member.id} className="group relative bg-card border border-border rounded-sm p-6 hover:border-primary transition-colors">
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => openEditMember(member, e)} className="p-1.5 hover:text-accent transition-colors"><Icon name="Pencil" size={14} /></button>
                  <button onClick={e => deleteMember(member.id, e)} className="p-1.5 hover:text-destructive transition-colors"><Icon name="Trash2" size={14} /></button>
                </div>
              )}
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
          {isAdmin && (
            <button onClick={openCreateArticle} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-sm text-sm hover:opacity-90">
              <Icon name="FilePlus" size={16} /> Добавить статью
            </button>
          )}
        </div>
        <div className="space-y-px">
          {articles.map(a => (
            <div key={a.id} className="group relative flex flex-col md:flex-row md:items-start gap-4 py-7 border-b border-border hover:bg-card transition-colors px-2 -mx-2 rounded-sm cursor-pointer">
              {isAdmin && (
                <div className="absolute top-4 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => openEditArticle(a, e)} className="p-1.5 hover:text-accent transition-colors"><Icon name="Pencil" size={14} /></button>
                  <button onClick={e => deleteArticle(a.id, e)} className="p-1.5 hover:text-destructive transition-colors"><Icon name="Trash2" size={14} /></button>
                </div>
              )}
              <span className="text-xs text-muted-foreground md:w-32 flex-shrink-0 mt-1">{a.pub_date}</span>
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

      {/* Contacts */}
      <section className="px-6 md:px-12 py-16 border-t border-border">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <h2 className="font-display text-4xl mb-6">Контакты</h2>
            <div className="space-y-4">
              {([['Mail', 'contact_email'], ['Phone', 'contact_phone'], ['MapPin', 'contact_address'], ['Send', 'contact_telegram']] as [string, string][]).map(([icon, key]) => (
                <div key={key} className="flex items-center gap-3 text-muted-foreground">
                  <Icon name={icon} size={18} className="text-accent flex-shrink-0" />
                  <Editable contentKey={key} value={content[key] || ''} className="text-sm text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <Icon name="CheckCircle" size={40} className="text-accent" />
                <p className="font-display text-2xl">Сообщение отправлено</p>
                <p className="text-sm text-muted-foreground">Свяжемся в течение одного дня</p>
              </div>
            ) : (
              <>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Имя" className="w-full px-4 py-3 rounded-sm bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-sm bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
                <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="Сообщение" rows={4} className="w-full px-4 py-3 rounded-sm bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none" />
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-sm text-sm tracking-wide hover:bg-[hsl(351,41%,26%)] transition-colors">Отправить</button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Article form */}
      {showArticleForm && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/70 backdrop-blur-sm p-4" onClick={() => setShowArticleForm(false)}>
          <div className="bg-background border border-border rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-5">{editingArticle.id === 0 ? 'Новая статья' : 'Редактировать статью'}</h2>
            <div className="space-y-3">
              {([['pub_date', 'Дата'], ['title', 'Заголовок']] as [keyof Article, string][]).map(([field, label]) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <input value={String(editingArticle[field] ?? '')} onChange={e => setEditingArticle(a => a ? { ...a, [field]: e.target.value } : a)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Теги (через запятую)</label>
                <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Дизайн, Материалы"
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Превью текст</label>
                <textarea value={editingArticle.preview} onChange={e => setEditingArticle(a => a ? { ...a, preview: e.target.value } : a)} rows={4}
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editingArticle.visible} onChange={e => setEditingArticle(a => a ? { ...a, visible: e.target.checked } : a)} />
                Видимая
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowArticleForm(false)} className="px-4 py-2 border border-border rounded-sm text-sm hover:border-primary transition-colors">Отмена</button>
              <button onClick={saveArticle} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member form */}
      {showMemberForm && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/70 backdrop-blur-sm p-4" onClick={() => setShowMemberForm(false)}>
          <div className="bg-background border border-border rounded-sm p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-5">{editingMember.id === 0 ? 'Добавить участника' : 'Редактировать участника'}</h2>
            <div className="space-y-3">
              {([['name', 'Имя'], ['role', 'Должность'], ['note', 'Примечание']] as [keyof TeamMember, string][]).map(([field, label]) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <input value={String(editingMember[field] ?? '')} onChange={e => setEditingMember(m => m ? { ...m, [field]: e.target.value } : m)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Порядок сортировки</label>
                <input type="number" value={editingMember.sort_order} onChange={e => setEditingMember(m => m ? { ...m, sort_order: Number(e.target.value) } : m)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowMemberForm(false)} className="px-4 py-2 border border-border rounded-sm text-sm hover:border-primary transition-colors">Отмена</button>
              <button onClick={saveMember} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
