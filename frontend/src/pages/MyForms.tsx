import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Check, Copy, FileText, Plus, Search } from 'lucide-react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import FormSkeleton from '@/components/shared/FormSkeleton';
import { Button } from '@/components/shared/Button';
import { getUserForms } from '@/services/api';
import type { UserForm } from '@/types/api';
import '../styles/global.css';

const MyForms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<UserForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { reduceMotion } = useGSAPAnimation();

  useEffect(() => {
    let active = true;
    getUserForms()
      .then((response) => { if (active) setForms(response.forms || []); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : 'Could not load your forms.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? forms.filter((form) => form.title.toLowerCase().includes(value)) : forms;
  }, [forms, query]);

  const copyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setError('Could not copy the link. Check your browser clipboard permissions and try again.');
    }
  };

  const dateLabel = (date: string) => {
    const parsed = new Date(date);
    return date && !Number.isNaN(parsed.getTime())
      ? parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Date unavailable';
  };

  if (loading) return <FormSkeleton />;

  return (
    <main className="page-maritime library-page">
      <div className="library-shell">
        <section className="library-hero">
          <div className="library-hero-copy">
            <div className="library-breadcrumb"><span>Workspace</span><i />My Forms</div>
            <h1>Your forms,<br /><em>all in one place.</em></h1>
            <p>Open a form to make changes, or copy a link to share it with your audience.</p>
          </div>
          <div className="library-hero-aside" aria-label="Forms created">
            <div className="library-count">{forms.length.toString().padStart(2, '0')}</div>
            <div className="library-count-label">FORM{forms.length === 1 ? '' : 'S'}<br />CREATED</div>
            <div className="library-aside-rule" />
            <Button onClick={() => navigate('/')} leftIcon={<Plus size={17} />}>New form</Button>
          </div>
          <div className="library-hero-mark" aria-hidden="true"><FileText size={96} strokeWidth={0.8} /></div>
        </section>

        {error && <div className="library-error" role="alert">
          <span>{error}</span><button type="button" onClick={() => setError(null)}>Dismiss</button>
        </div>}

        <section className="library-listing">
          <div className="library-listing-head">
            <div>
              <span className="library-section-label">FORM LIBRARY</span>
              <h2>{query ? 'Search results' : 'Recently created'}</h2>
            </div>
            {forms.length > 0 && <div className="library-search">
              <Search size={18} aria-hidden="true" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a form" aria-label="Search forms by title" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">x</button>}
            </div>}
          </div>

          {filtered.length > 0 ? (
            <div className="library-grid">
              {filtered.map((form, index) => <article className="library-card" key={form.id}
                style={{ animationDelay: reduceMotion ? '0ms' : `${Math.min(index, 8) * 45}ms` }}>
                <div className="library-card-top">
                  <span className="library-card-icon"><FileText size={20} /></span>
                  <span className="library-date"><CalendarDays size={14} />{dateLabel(form.createdAt)}</span>
                </div>
                <div className="library-card-copy">
                  <span className="library-card-overline">GOOGLE FORM</span>
                  <h3 title={form.title}>{form.title}</h3>
                  <div className="library-id">ID <span>{form.formId}</span></div>
                </div>
                <div className="library-card-actions">
                  {([
                    { label: 'Share', url: form.viewUrl, id: `view-${form.id}`, note: 'Collect responses' },
                    { label: 'Edit', url: form.editUrl, id: `edit-${form.id}`, note: 'Update questions' },
                  ]).map((item) => <div className="library-action-row" key={item.id}>
                    <div className="library-action-copy"><strong>{item.label}</strong><span>{item.note}</span></div>
                    <button type="button" className="library-icon-button" onClick={() => copyLink(item.url, item.id)}
                      aria-label={copiedId === item.id ? `${item.label} link copied` : `Copy ${item.label.toLowerCase()} link`}>
                      {copiedId === item.id ? <Check size={17} /> : <Copy size={17} />}
                    </button>
                    <a className="library-icon-button" href={item.url} target="_blank" rel="noreferrer"
                      aria-label={`Open ${item.label.toLowerCase()} form`}><ArrowUpRight size={17} /></a>
                  </div>)}
                </div>
              </article>)}
            </div>
          ) : (
            <div className="library-empty">
              <div className="library-empty-symbol"><FileText size={25} /></div>
              <h3>{query ? 'No forms match that search' : 'A good form starts with a document'}</h3>
              <p>{query ? 'Try a different title or clear your search.' : 'Create your first form and its share and edit links will be kept here.'}</p>
              {query
                ? <button className="library-clear" type="button" onClick={() => setQuery('')}>Clear search</button>
                : <Button onClick={() => navigate('/')} leftIcon={<Plus size={17} />}>Create your first form</Button>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default MyForms;
