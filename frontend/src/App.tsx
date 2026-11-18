import { useEffect, useState } from 'react';
import { api, type Franchise, type Branch, type Product } from './api';

type Tab = 'franchises' | 'branches' | 'products';
export default function App() {
  const [tab, setTab] = useState<Tab>('franchises');
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [franchiseId, setFranchiseId] = useState<number | ''>('');
  const [branchId, setBranchId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [stock, setStock] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadAll() {
    setLoading(true); setError('');
    try {
      const [f, b, p] = await Promise.all([api.franchises(), api.branches(), api.products()]);
      setFranchises(f); setBranches(b); setProducts(p);
      if (franchiseId && !f.some(x => x.id === franchiseId)) setFranchiseId('');
      if (branchId && !b.some(x => x.id === branchId)) setBranchId('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load data.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadAll(); }, []);
  const visibleBranches = branches.filter(x => !franchiseId || x.franchiseId === franchiseId);
  const visibleProducts = products.filter(x => !branchId || x.branchId === branchId);
  async function run(action: () => Promise<unknown>) {
    setError(''); setSuccess('');
    try { await action(); setName(''); setStock('0'); setSuccess('Changes saved successfully.'); await loadAll(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.'); }
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); const cleanName = name.trim();
    if (cleanName.length < 2) { setError('Name must contain at least 2 characters.'); return; }
    if (tab === 'franchises') return run(() => api.createFranchise(cleanName));
    if (tab === 'branches') {
      if (!franchiseId) { setError('Select a franchise first.'); return; }
      return run(() => api.createBranch(franchiseId, cleanName));
    }
    if (!branchId) { setError('Select a branch first.'); return; }
    const quantity = Number(stock);
    if (!Number.isInteger(quantity) || quantity < 0) { setError('Stock must be a non-negative integer.'); return; }
    return run(() => api.createProduct(branchId, cleanName, quantity));
  }
  return <main className="shell">
    <header><div className="eyebrow">MANAGEMENT PLATFORM</div><h1>Franchise Manager</h1><p>Manage franchises, branches and product inventory in one place.</p></header>
    <nav>{(['franchises','branches','products'] as Tab[]).map(x => <button key={x} className={tab === x ? 'active' : ''} onClick={() => { setTab(x); setError(''); setSuccess(''); }}>{x}</button>)}</nav>
    <section className="panel">
      <div className="section-head"><div><span className="eyebrow">WORKSPACE</span><h2>{tab[0].toUpperCase()+tab.slice(1)}</h2></div><button className="refresh" onClick={() => void loadAll()}>↻ Refresh</button></div>
      {error && <div className="alert error">{error}</div>}{success && <div className="alert success">{success}</div>}
      {loading && <p className="muted">Loading data…</p>}
      {tab !== 'franchises' && <label className="filter">{tab === 'branches' ? 'Filter by franchise' : 'Filter by branch'}
        <select value={tab === 'branches' ? franchiseId : branchId} onChange={e => tab === 'branches' ? setFranchiseId(e.target.value ? Number(e.target.value) : '') : setBranchId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">All {tab === 'branches' ? 'franchises' : 'branches'}</option>
          {(tab === 'branches' ? franchises : branches).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </label>}
      <div className="content-grid"><div className="list">
        <h3>Records <span>{tab === 'franchises' ? franchises.length : tab === 'branches' ? visibleBranches.length : visibleProducts.length}</span></h3>
        {tab === 'franchises' && franchises.map(x => <article key={x.id}><div><strong>{x.name}</strong><small>Franchise #{x.id}</small></div><span className="tag">Franchise</span></article>)}
        {tab === 'branches' && visibleBranches.map(x => <article key={x.id}><div><strong>{x.name}</strong><small>{franchises.find(f => f.id === x.franchiseId)?.name ?? 'Franchise'} · Branch #{x.id}</small></div><span className="tag">Branch</span></article>)}
        {tab === 'products' && visibleProducts.map(x => <article key={x.id}><div><strong>{x.name}</strong><small>Product #{x.id} · Branch: {branches.find(b => b.id === x.branchId)?.name ?? x.branchId}</small></div><div className="stock"><span>{x.stock} units</span><button onClick={() => { const value = window.prompt('Enter the new stock quantity:', String(x.stock)); if (value !== null && /^\d+$/.test(value)) void run(() => api.updateStock(x.id, Number(value))); else if (value !== null) setError('Stock must be a non-negative integer.'); }}>Update stock</button></div></article>)}
        {!loading && (tab === 'franchises' ? franchises.length : tab === 'branches' ? visibleBranches.length : visibleProducts.length) === 0 && <p className="empty">No records yet. Create your first one.</p>}
      </div><form className="create" onSubmit={submit}><span className="eyebrow">NEW RECORD</span><h3>Create {tab.slice(0,-1)}</h3>
        {tab === 'branches' && <label>Franchise<select value={franchiseId} onChange={e => setFranchiseId(e.target.value ? Number(e.target.value) : '')}><option value="">Choose a franchise</option>{franchises.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>}
        {tab === 'products' && <label>Branch<select value={branchId} onChange={e => setBranchId(e.target.value ? Number(e.target.value) : '')}><option value="">Choose a branch</option>{branches.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>}
        <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder={`${tab.slice(0,-1)} name`} maxLength={100} /></label>
        {tab === 'products' && <label>Initial stock<input type="number" min="0" step="1" value={stock} onChange={e => setStock(e.target.value)} /></label>}
        <button className="primary" type="submit">+ Create {tab.slice(0,-1)}</button>
      </form></div>
    </section><footer>Franchise Manager <span>Fullstack Junior Technical Assessment</span></footer>
  </main>;
}
