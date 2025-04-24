/**
 * Types related to components used in the table
 */

export interface Subcomponent {
  component_id: string;
  component_name: string;
  usable_quantity?: number;
  damaged_quantity?: number;
  discarded_quantity?: number;
  total_quantity?: number;
  sku_code?: string;
  hsn_code?: string;
  [key: string]: unknown; // Add index signature to make compatible with SearchableComponent
}
