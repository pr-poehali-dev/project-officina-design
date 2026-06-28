const BASE = 'https://functions.poehali.dev/210672ab-ade7-4525-be11-23bc78c874b2';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('paterno_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req<T>(path: string, opts: RequestInit = {}, id?: number): Promise<T> {
  const u = id !== undefined ? `${BASE}/${path}?id=${id}` : `${BASE}/${path}`;
  const res = await fetch(u, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(opts.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data as T;
}

export const api = {
  login: (username: string, password: string) =>
    req<{ token: string; username: string }>('login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  getContent: () => req<Record<string, string>>('content'),
  saveContent: (updates: Record<string, string>) =>
    req('content', { method: 'POST', body: JSON.stringify(updates) }),

  getProducts: () => req<Product[]>('products'),
  createProduct: (d: Partial<Product>) => req<Product>('products', { method: 'POST', body: JSON.stringify(d) }),
  updateProduct: (id: number, d: Partial<Product>) => req<Product>('products', { method: 'PUT', body: JSON.stringify(d) }, id),
  deleteProduct: (id: number) => req('products', { method: 'DELETE' }, id),

  getProjects: () => req<Project[]>('projects'),
  createProject: (d: Partial<Project>) => req<Project>('projects', { method: 'POST', body: JSON.stringify(d) }),
  updateProject: (id: number, d: Partial<Project>) => req<Project>('projects', { method: 'PUT', body: JSON.stringify(d) }, id),
  deleteProject: (id: number) => req('projects', { method: 'DELETE' }, id),

  getArticles: () => req<Article[]>('articles'),
  createArticle: (d: Partial<Article>) => req<Article>('articles', { method: 'POST', body: JSON.stringify(d) }),
  updateArticle: (id: number, d: Partial<Article>) => req<Article>('articles', { method: 'PUT', body: JSON.stringify(d) }, id),
  deleteArticle: (id: number) => req('articles', { method: 'DELETE' }, id),

  getTeam: () => req<TeamMember[]>('team'),
  createTeamMember: (d: Partial<TeamMember>) => req<TeamMember>('team', { method: 'POST', body: JSON.stringify(d) }),
  updateTeamMember: (id: number, d: Partial<TeamMember>) => req<TeamMember>('team', { method: 'PUT', body: JSON.stringify(d) }, id),
  deleteTeamMember: (id: number) => req('team', { method: 'DELETE' }, id),
};

export interface Product {
  id: number; article: string; name: string; price: number;
  category: string; car: string; is_new: boolean; image_url: string; visible: boolean;
}
export interface Project {
  id: number; name: string; car: string; status: string; description: string;
  price: number; discount: number; image_url: string; tall: boolean; parts: string[]; visible: boolean;
}
export interface Article {
  id: number; pub_date: string; title: string; tags: string[]; preview: string; visible: boolean;
}
export interface TeamMember {
  id: number; name: string; role: string; note: string; sort_order: number; visible: boolean;
}