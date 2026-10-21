export type UserRole = "admin" | "manager" | "analyst" | "sales_executive";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface KpiCardData {
  title: string;
  value: string;
  numeric_value: number;
  previous_value: number;
  change_pct: number;
  trend: "up" | "down" | "neutral";
  unit: string;
  sparkline: number[];
}

export interface OverviewAnalytics {
  kpis: {
    revenue: KpiCardData;
    orders: KpiCardData;
    target: KpiCardData;
    stockout_risk: KpiCardData;
    churn_risk: KpiCardData;
  };
  revenue_trend: {
    month: string;
    revenue: number;
    target: number;
    orders: number;
  }[];
  sales_by_region: {
    region_id: number;
    name: string;
    code: string;
    revenue: number;
    target: number;
    achievement: number;
  }[];
  top_products: {
    id: number;
    name: string;
    sku: string;
    revenue: number;
    units: number;
  }[];
  target_achievement: {
    period: string;
    title: string;
    target: number;
    actual: number;
    achievement: number;
    predicted: number;
  }[];
  stockout_risks: {
    product_id: number;
    name: string;
    sku: string;
    current_stock: number;
    days_left: number;
    risk: "low" | "medium" | "high" | "critical";
    reorder_qty: number;
  }[];
  churn_risks: {
    customer_id: number;
    name: string;
    company: string;
    ltv: number;
    churn_score: number;
    risk_level: string;
    last_order_days: number;
  }[];
  ai_summary: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  region_name: string;
  salesperson_name: string;
  total_amount: number;
  discount_amount: number;
  status: "completed" | "processing" | "cancelled" | "refunded";
  order_date: string;
  items: OrderItem[];
}

export interface Customer {
  id: number;
  customer_code: string;
  name: string;
  company: string;
  email: string;
  region_name: string;
  lifetime_value: number;
  total_orders: number;
  avg_order_value: number;
  last_order_date: string | null;
  churn_risk_score: number;
  churn_risk_level: "low" | "medium" | "high" | "critical";
  segment_name: string;
  timeline?: {
    date: string;
    type: string;
    description: string;
    amount?: number;
  }[];
}

export interface InventoryItem {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  category_name: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  daily_demand_rate: number;
  days_until_stockout: number;
  stockout_risk: "low" | "medium" | "high" | "critical";
  recommended_reorder_qty: number;
  unit_price: number;
  inventory_value: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role_title: string;
  region_name: string;
  monthly_target: number;
  current_revenue: number;
  achievement_rate: number;
  performance_score: number;
  predicted_target_probability: number;
  is_active: boolean;
}

export interface TargetItem {
  id: number;
  title: string;
  period: string;
  entity_type: string;
  entity_id: number | null;
  target_value: number;
  actual_value: number;
  achievement_rate: number;
  predicted_achievement: number;
  risk_level: "low" | "medium" | "high" | "critical";
  created_at: string;
}

export interface ForecastDataPoint {
  date: string;
  predicted_sales: number;
  lower_bound: number;
  upper_bound: number;
  is_historical: boolean;
}

export interface ForecastResponse {
  horizon_days: number;
  model_name: string;
  metrics: Record<string, any>;
  series: ForecastDataPoint[];
  total_predicted_revenue: number;
  growth_rate: number;
}

export interface ChurnPredictionItem {
  customer_id: number;
  name: string;
  company: string;
  churn_probability: number;
  risk_level: "low" | "medium" | "high" | "critical";
  top_factors: string[];
  recency_days: number;
  order_count: number;
  monetary_value: number;
}

export interface StockoutPredictionItem {
  product_id: number;
  product_name: string;
  sku: string;
  current_stock: number;
  daily_demand_rate: number;
  days_remaining: number;
  stockout_probability: number;
  risk_level: "low" | "medium" | "high" | "critical";
  recommended_reorder: number;
  lead_time_days: number;
}

export interface AnomalyItem {
  id: number;
  entity_type: string;
  entity_id: number;
  reference_code: string;
  anomaly_score: number;
  severity: "low" | "medium" | "high" | "critical";
  reason: string;
  observed_value: number;
  expected_value: number;
  status: string;
  created_at: string;
}

export interface CustomerSegmentItem {
  segment_name: string;
  customer_count: number;
  avg_ltv: number;
  avg_orders: number;
  avg_recency_days: number;
  description: string;
  persona: string;
  color: string;
}

export interface MLModelItem {
  id: number;
  name: string;
  version: string;
  model_type: string;
  algorithm: string;
  status: "production" | "staging" | "archived";
  metrics: Record<string, any>;
  hyperparameters: Record<string, any>;
  last_trained_at: string;
}

export interface AIChatMessage {
  id?: number;
  role: "user" | "assistant" | "system";
  content: string;
  metrics?: { label: string; value: string; status: string }[];
  recommendations?: string[];
  citations?: { document: string; section?: string; content_snippet?: string }[];
  created_at?: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  filename: string;
  file_type: string;
  file_size: number;
  chunk_count: number;
  category: string;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  severity: "info" | "success" | "warning" | "critical";
  category: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  ip_address: string;
  created_at: string;
}
