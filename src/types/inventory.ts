// Define the structure for an inventory item based on the API response
export interface InventoryItem {
  component_id: string;
  component_name: string;
  is_subcomponent: boolean;
  parent_component_id: string | null;
  updated_at: string; // Consider using Date type if further processing is needed
  created_at: string; // Consider using Date type if further processing is needed
  has_subcomponent: boolean;
  hsn_code: string;
  sku_code: string;
  subcomponents?: InventoryItem []; // Array of subcomponents, potentially recursive

  // Fields primarily found in subcomponents, marked as optional
  usable_quantity?: number;
  damaged_quantity?: number;
  discarded_quantity?: number;
  last_updated?: string; // Consider using Date type
  total_quantity?: number;
  
  // Added field for UI display - parent component name for subcomponents in flat view
  parent_component_name?: string;
}

// The Inventory interface remains largely the same, but now uses the detailed Item type
export interface Inventory {
  add(item: InventoryItem ): void;
  remove(item: InventoryItem ): void;
  getItems(): InventoryItem [];
}