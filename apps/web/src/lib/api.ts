const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; meta?: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("opsintel_token") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn(`API call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (data: any) => fetchApi("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) => fetchApi("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => fetchApi("/auth/me"),
  
  // Analytics
  getOverview: () => fetchApi("/analytics/overview"),
  
  // Sales
  getOrders: (params: string = "") => fetchApi(`/sales/orders?${params}`),
  
  // Customers
  getCustomers: (params: string = "") => fetchApi(`/customers?${params}`),
  getCustomerDetail: (id: number) => fetchApi(`/customers/${id}`),
  
  // Inventory
  getInventory: (risk: string = "") => fetchApi(`/inventory?risk=${risk}`),
  getMovements: () => fetchApi("/inventory/movements"),
  
  // Employees
  getEmployees: () => fetchApi("/employees"),
  
  // Targets
  getTargets: () => fetchApi("/targets"),
  createTarget: (data: any) => fetchApi("/targets", { method: "POST", body: JSON.stringify(data) }),
  
  // ML
  getForecast: (horizon: number = 30) => fetchApi(`/ml/forecast?horizon=${horizon}`),
  getChurn: () => fetchApi("/ml/churn"),
  getStockout: () => fetchApi("/ml/stockout"),
  getTargetPredictions: () => fetchApi("/ml/targets"),
  getAnomalies: () => fetchApi("/ml/anomalies"),
  getSegments: () => fetchApi("/ml/segments"),
  getModels: () => fetchApi("/ml/models"),
  retrainModel: (id: number) => fetchApi(`/ml/models/${id}/retrain`, { method: "POST" }),
  
  // AI Copilot
  chat: (data: { message: string; conversation_id?: number }) => fetchApi("/ai/chat", { method: "POST", body: JSON.stringify(data) }),
  getConversations: () => fetchApi("/ai/conversations"),
  getConversationMessages: (id: number) => fetchApi(`/ai/conversations/${id}/messages`),
  
  // RAG
  getDocuments: () => fetchApi("/rag/documents"),
  searchRag: (query: string) => fetchApi("/rag/search", { method: "POST", body: JSON.stringify({ query }) }),
  
  // Admin & Health
  getNotifications: () => fetchApi("/admin/notifications"),
  markNotificationRead: (id: number) => fetchApi(`/admin/notifications/${id}/read`, { method: "POST" }),
  getAuditLogs: () => fetchApi("/admin/audit-logs"),
  getSystemHealth: () => fetchApi("/admin/health"),
  getUsers: () => fetchApi("/admin/users"),
  resetSeed: () => fetchApi("/admin/seed-reset", { method: "POST" }),
};
