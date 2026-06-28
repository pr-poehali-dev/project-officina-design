import { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';

interface Props { onClose: () => void; }

export default function AdminLogin({ onClose }: Props) {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { token } = await api.login(username, password);
      login(token);
      onClose();
    } catch {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-anthracite/80 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={e => e.stopPropagation()}
        className="bg-background border border-border rounded-sm p-8 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-primary">Paterno Admin</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <input
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Логин"
            className="w-full px-4 py-3 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full px-4 py-3 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-primary"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-sm text-sm tracking-wide hover:bg-[hsl(351,41%,26%)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">Только для администраторов</p>
      </form>
    </div>
  );
}
