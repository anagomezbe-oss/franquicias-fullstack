const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
export type Franchise = { id: number; name: string };
export type Branch = { id: number; franchiseId: number; name: string };
export type Product = { id: number; branchId: number; name: string; stock: number };
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.message ?? `Request failed (${response.status})`); }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export const api = {
  franchises: () => request<Franchise[]>('/franchises'),
  createFranchise: (name: string) => request<Franchise>('/franchises', { method: 'POST', body: JSON.stringify({ name }) }),
  branches: (franchiseId?: number) => request<Branch[]>(`/branches${franchiseId ? `?franchiseId=${franchiseId}` : ''}`),
  createBranch: (franchiseId: number, name: string) => request<Branch>('/branches', { method: 'POST', body: JSON.stringify({ franchiseId, name }) }),
  products: (branchId?: number) => request<Product[]>(`/products${branchId ? `?branchId=${branchId}` : ''}`),
  createProduct: (branchId: number, name: string, stock: number) => request<Product>('/products', { method: 'POST', body: JSON.stringify({ branchId, name, stock }) }),
  updateStock: (id: number, stock: number) => request<Product>(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) })
};
