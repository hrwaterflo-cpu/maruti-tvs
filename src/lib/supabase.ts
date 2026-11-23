import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SparePart {
  id: string;
  part_no: string;
  name: string;
  assembly: string;
  fig_no: string;
  vehicle_model: string;
  catalog_qty: number;
  stock_qty: number;
  min_stock: number;
  price: number;
  rack_location: string;
  remarks: string;
  updated_at: string;
}

export interface ModelSummary {
  vehicle_model: string;
  total_parts: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  total_units: number;
}

export interface Enquiry {
  id: string;
  customer_name: string;
  phone: string;
  enquiry_type: "vehicle" | "spare_part" | "service";
  item_name: string;
  message: string;
  status: "new" | "contacted" | "resolved";
  created_at: string;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(part: Pick<SparePart, "stock_qty" | "min_stock">): StockStatus {
  if (part.stock_qty <= 0) return "out_of_stock";
  if (part.stock_qty <= part.min_stock) return "low_stock";
  return "in_stock";
}
