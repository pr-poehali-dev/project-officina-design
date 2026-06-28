import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { api, Project } from '@/lib/api';
import { useAdmin } from '@/lib/admin-context';
import Editable from '@/components/Editable';

const STATUS_COLORS: Record<string, string> = {
  'В продаже': 'bg-accent text-accent-foreground',
  'Скоро': 'bg-secondary text-secondary-foreground',
  'Концепт': 'bg-primary/20 text-primary',
  'Архив': 'bg-muted text-muted-foreground',
};
const STATUSES = ['В продаже', 'Скоро', 'Концепт', 'Архив'];
const EMPTY: Project = { id: 0, name: '', car: '', status: 'Концепт', description: '', price: 0, discount: 0, image_url: '', tall: false, parts: [], visible: true };

export default function Design() {
  const { isAdmin } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('Все');
  const [notify, setNotify] = useState<number[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partsInput, setPartsInput] = useState('');

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
    api.getContent().then(setContent).catch(() => {});
  }, []);

  const filtered = projects
    .filter(p => isAdmin || p.visible)
    .filter(p => filter === 'Все' || p.status === filter);

  const openCreate = () => { setEditingProject({ ...EMPTY }); setPartsInput(''); setShowForm(true); };
  const openEdit = (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject({ ...p, parts: p.parts || [] });
    setPartsInput((p.parts || []).join('\n'));
    setShowForm(true);
  };

  const saveProject = async () => {
    if (!editingProject) return;
    setSaving(true);
    const parts = partsInput.split('\n').map(s => s.trim()).filter(Boolean);
    const data = { ...editingProject, parts };
    try {
      if (data.id === 0) {
        const created = await api.createProject(data);
        setProjects(prev => [...prev, created]);
      } else {
        const updated = await api.updateProject(data.id, data);
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      }
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const deleteProject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Удалить проект?')) return;
    await api.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleVisible = async (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await api.updateProject(p.id, { ...p, visible: !p.visible });
    setProjects(prev => prev.map(x => x.id === updated.id ? updated : x));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-display text-2xl text-primary">{content.brand_name || 'Paterno'}</span>
        </Link>
        <p className="hidden md:block text-sm text-muted-foreground tracking-wide">Проекты</p>
        <div className="w-6" />
      </header>

      <div className="px-6 md:px-12 pt-12 pb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent mb-3">
            <Editable contentKey="design_eyebrow" value={content.design_eyebrow || 'Авторские проекты'} />
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-foreground">
            <Editable contentKey="design_title" value={content.design_title || 'Design'} />
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            <Editable contentKey="design_desc" value={content.design_desc || ''} multiline as="p" />
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-sm text-sm hover:opacity-90 whitespace-nowrap mt-2 flex-shrink-0">
            <Icon name="Plus" size={16} /> Добавить проект
          </button>
        )}
      </div>

      <div className="px-6 md:px-12 py-5 flex flex-wrap gap-2 border-b border-border">
        {['Все', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${filter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}>{s}</button>
        ))}
      </div>

      <div className="px-6 md:px-12 py-10 columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {filtered.map(p => (
          <div key={p.id} className={`group break-inside-avoid bg-card rounded-sm overflow-hidden border transition-all duration-300 ${!p.visible && isAdmin ? 'opacity-50 border-dashed border-muted' : 'border-border hover:border-primary'}`}>
            <div className={`relative overflow-hidden ${p.tall ? 'h-72' : 'h-44'}`}>
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className={`absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${STATUS_COLORS[p.status] || 'bg-muted text-muted-foreground'}`}>{p.status}</span>
              {isAdmin && !p.visible && <span className="absolute top-3 right-12 text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-sm">Скрыт</span>}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => toggleVisible(p, e)} className="bg-background/90 p-1.5 rounded hover:bg-background transition-colors"><Icon name={p.visible ? 'EyeOff' : 'Eye'} size={14} /></button>
                  <button onClick={e => openEdit(p, e)} className="bg-background/90 p-1.5 rounded hover:bg-background transition-colors"><Icon name="Pencil" size={14} /></button>
                  <button onClick={e => deleteProject(p.id, e)} className="bg-background/90 p-1.5 rounded hover:bg-background text-destructive transition-colors"><Icon name="Trash2" size={14} /></button>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-[11px] text-muted-foreground tracking-wide mb-1">{p.car}</p>
              <h3 className="font-display text-2xl mb-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
              {(p.parts || []).length > 0 && (
                <div className="mb-4 space-y-1">
                  {p.parts.map(part => (
                    <div key={part} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />{part}
                    </div>
                  ))}
                </div>
              )}
              {p.status === 'В продаже' && p.price > 0 && (
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="font-display text-2xl text-primary">{p.price.toLocaleString('ru')} ₽</span>
                    {p.discount > 0 && <span className="ml-2 text-xs text-accent">−{p.discount}% за комплект</span>}
                  </div>
                  {!isAdmin && (
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors">
                      <Icon name="Package" size={14} /> Весь комплект
                    </button>
                  )}
                </div>
              )}
              {p.status === 'Концепт' && !isAdmin && (
                <button onClick={() => setNotify(prev => [...prev, p.id])} disabled={notify.includes(p.id)}
                  className={`w-full mt-2 py-2 rounded-sm text-sm border transition-colors ${notify.includes(p.id) ? 'border-accent text-accent cursor-default' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}>
                  {notify.includes(p.id) ? '✓ Вы подписались' : 'Сообщить о выходе'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-6 md:px-12 py-20 text-center text-muted-foreground">
          <Icon name="Layers" size={36} className="mx-auto mb-4 opacity-40" />
          <p>Проектов не найдено</p>
          {isAdmin && <button onClick={openCreate} className="mt-4 text-accent underline text-sm">+ Добавить первый проект</button>}
        </div>
      )}

      {showForm && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/70 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="bg-background border border-border rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-5">{editingProject.id === 0 ? 'Новый проект' : 'Редактировать проект'}</h2>
            <div className="space-y-3">
              {([['name', 'Название'], ['car', 'Автомобиль'], ['image_url', 'URL изображения']] as [keyof Project, string][]).map(([field, label]) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <input value={String(editingProject[field] ?? '')} onChange={e => setEditingProject(p => p ? { ...p, [field]: e.target.value } : p)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Описание</label>
                <textarea value={editingProject.description} onChange={e => setEditingProject(p => p ? { ...p, description: e.target.value } : p)} rows={3}
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Статус</label>
                <select value={editingProject.status} onChange={e => setEditingProject(p => p ? { ...p, status: e.target.value } : p)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Цена (₽)</label>
                  <input type="number" value={editingProject.price} onChange={e => setEditingProject(p => p ? { ...p, price: Number(e.target.value) } : p)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Скидка за комплект (%)</label>
                  <input type="number" value={editingProject.discount} onChange={e => setEditingProject(p => p ? { ...p, discount: Number(e.target.value) } : p)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Детали комплекта (каждая с новой строки)</label>
                <textarea value={partsInput} onChange={e => setPartsInput(e.target.value)} rows={3} placeholder="Рукоятка КПП Sport&#10;Накладка приборной панели"
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary resize-none font-mono" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editingProject.tall} onChange={e => setEditingProject(p => p ? { ...p, tall: e.target.checked } : p)} />
                  Высокая карточка
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editingProject.visible} onChange={e => setEditingProject(p => p ? { ...p, visible: e.target.checked } : p)} />
                  Видимый
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-sm text-sm hover:border-primary transition-colors">Отмена</button>
              <button onClick={saveProject} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
