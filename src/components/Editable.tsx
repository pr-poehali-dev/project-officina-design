import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { api } from '@/lib/api';

interface Props {
  contentKey: string;
  value: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
  multiline?: boolean;
  onSaved?: (val: string) => void;
}

export default function Editable({ contentKey, value, as: Tag = 'span', className = '', multiline = false, onSaved }: Props) {
  const { isAdmin } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => { setCurrent(value); setDraft(value); }, [value]);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const save = async () => {
    if (draft === current) { setEditing(false); return; }
    setSaving(true);
    await api.saveContent({ [contentKey]: draft });
    setCurrent(draft);
    onSaved?.(draft);
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => { setDraft(current); setEditing(false); };

  if (!isAdmin) return <Tag className={className}>{current}</Tag>;

  if (editing) {
    return (
      <span className="inline-flex flex-col gap-1 w-full">
        {multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={3}
            className={`${className} bg-primary/10 border border-accent rounded px-1 outline-none resize-none w-full`}
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
            className={`${className} bg-primary/10 border border-accent rounded px-1 outline-none w-full`}
          />
        )}
        <span className="flex gap-2 text-xs">
          <button onClick={save} disabled={saving} className="text-accent hover:underline">{saving ? '...' : '✓ сохранить'}</button>
          <button onClick={cancel} className="text-muted-foreground hover:underline">✕ отмена</button>
        </span>
      </span>
    );
  }

  return (
    <Tag
      className={`${className} group/ed relative cursor-pointer`}
      onClick={() => setEditing(true)}
      title="Нажмите для редактирования"
    >
      {current}
      <span className="absolute -top-1 -right-1 opacity-0 group-hover/ed:opacity-100 text-[9px] bg-accent text-accent-foreground px-1 rounded transition-opacity">
        ✏
      </span>
    </Tag>
  );
}
