import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { api, Product } from '@/lib/api';
import { useAdmin } from '@/lib/admin-context';
import Editable from '@/components/Editable';

const EMPTY: Product = { id: 0, article: '', name: '', price: 0, category: '', car: '', is_new: false, image_url: '', visible: true };
const CATEGORIES = ['Все', 'Приборки', 'Ручки', 'Крепления'];
const CARS = ['Все марки', 'Universal', 'BMW', 'Audi', 'Mercedes'];

export default function Officina() {
  const { isAdmin } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [cat, setCat] = useState('Все');
  const [car, setCar] = useState('Все марки');
  const [sort, setSort] = useState('new');
  const [cart, setCart] = useState<number[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
    api.getContent().then(setContent).catch(() => {});
  }, []);

  const filtered = products
    .filter(p => isAdmin || p.visible)
    .filter(p => cat === 'Все' || p.category === cat)
    .filter(p => car === 'Все марки' || p.car === car)
    .sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));

  const addToCart = (id: number, e: React.MouseEvent) => { e.preventDefault(); setCart(prev => [...prev, id]); };

  const openCreate = () => { setEditingProduct({ ...EMPTY }); setShowForm(true); };
  const openEdit = (p: Product, e: React.MouseEvent) => { e.stopPropagation(); setEditingProduct({ ...p }); setShowForm(true); };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      if (editingProduct.id === 0) {
        const created = await api.createProduct(editingProduct);
        setProducts(prev => [...prev, created]);
      } else {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      }
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const deleteProduct = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Удалить товар?')) return;
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleVisible = async (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await api.updateProduct(p.id, { ...p, visible: !p.visible });
    setProducts(prev => prev.map(x => x.id === updated.id ? updated : x));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-display text-2xl text-primary">{content.brand_name || 'Paterno'}</span>
        </Link>
        <p className="hidden md:block text-sm text-muted-foreground tracking-wide">Каталог</p>
        <div className="relative text-primary">
          <Icon name="ShoppingBag" size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">{cart.length}</span>
          )}
        </div>
      </header>

      <div className="px-6 md:px-12 pt-12 pb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent mb-3">
            <Editable contentKey="officina_eyebrow" value={content.officina_eyebrow || 'Производство и ресейл'} />
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-foreground">
            <Editable contentKey="officina_title" value={content.officina_title || 'Officina'} />
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            <Editable contentKey="officina_desc" value={content.officina_desc || ''} multiline as="p" />
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-sm text-sm hover:opacity-90 whitespace-nowrap mt-2 flex-shrink-0">
            <Icon name="Plus" size={16} /> Добавить товар
          </button>
        )}
      </div>

      <div className="px-6 md:px-12 py-6 flex flex-wrap gap-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${cat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}>{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {CARS.map(c => (
            <button key={c} onClick={() => setCar(c)} className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${car === c ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border hover:border-secondary'}`}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="ml-auto px-4 py-1.5 rounded-sm text-sm border border-border bg-background focus:outline-none focus:border-primary">
          <option value="new">Сначала новинки</option>
          <option value="asc">Цена ↑</option>
          <option value="desc">Цена ↓</option>
        </select>
      </div>

      <div className="px-6 md:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className={`group relative bg-card rounded-sm overflow-hidden border transition-all duration-300 ${!p.visible && isAdmin ? 'opacity-50 border-dashed border-muted' : 'border-border hover:border-primary'}`}>
            <div className="relative overflow-hidden h-52">
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {p.is_new && <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] bg-accent text-accent-foreground px-2 py-1">Новинка</span>}
              {isAdmin && !p.visible && <span className="absolute top-3 right-3 text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-sm">Скрыт</span>}
            </div>
            <div className="p-5">
              <p className="text-[11px] text-muted-foreground tracking-wide mb-1">{p.article} · {p.category} · {p.car}</p>
              <h3 className="font-display text-xl mb-3">{p.name}</h3>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-primary">{p.price.toLocaleString('ru')} ₽</span>
                {isAdmin ? (
                  <div className="flex gap-2">
                    <button onClick={e => toggleVisible(p, e)} title={p.visible ? 'Скрыть' : 'Показать'} className="p-2 border border-border rounded-sm hover:border-primary transition-colors text-muted-foreground hover:text-primary">
                      <Icon name={p.visible ? 'EyeOff' : 'Eye'} size={15} />
                    </button>
                    <button onClick={e => openEdit(p, e)} className="p-2 border border-border rounded-sm hover:border-accent transition-colors text-muted-foreground hover:text-accent">
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button onClick={e => deleteProduct(p.id, e)} className="p-2 border border-border rounded-sm hover:border-destructive transition-colors text-muted-foreground hover:text-destructive">
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                ) : (
                  <button onClick={e => addToCart(p.id, e)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors">
                    <Icon name="ShoppingBag" size={15} /> В корзину
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !saving && (
        <div className="px-6 md:px-12 py-20 text-center text-muted-foreground">
          <Icon name="SearchX" size={36} className="mx-auto mb-4 opacity-40" />
          <p>По выбранным фильтрам товаров не найдено</p>
          {isAdmin && <button onClick={openCreate} className="mt-4 text-accent underline text-sm">+ Добавить первый товар</button>}
        </div>
      )}

      {showForm && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/70 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="bg-background border border-border rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-5">{editingProduct.id === 0 ? 'Новый товар' : 'Редактировать товар'}</h2>
            <div className="space-y-3">
              {([['article', 'Артикул'], ['name', 'Название'], ['category', 'Категория'], ['car', 'Марка авто'], ['image_url', 'URL изображения']] as [keyof Product, string][]).map(([field, label]) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <input value={String(editingProduct[field] ?? '')} onChange={e => setEditingProduct(p => p ? { ...p, [field]: e.target.value } : p)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Цена (₽)</label>
                <input type="number" value={editingProduct.price} onChange={e => setEditingProduct(p => p ? { ...p, price: Number(e.target.value) } : p)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editingProduct.is_new} onChange={e => setEditingProduct(p => p ? { ...p, is_new: e.target.checked } : p)} />
                  Новинка
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editingProduct.visible} onChange={e => setEditingProduct(p => p ? { ...p, visible: e.target.checked } : p)} />
                  Видимый
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-sm text-sm hover:border-primary transition-colors">Отмена</button>
              <button onClick={saveProduct} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-[hsl(351,41%,26%)] transition-colors disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
