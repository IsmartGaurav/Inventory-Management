// Mock inventory data to use as fallback if API call fails
import { InventoryItem } from '@/types/inventory';

export const mockInventoryData: InventoryItem[] = [
  {
    component_id: "BAT01",
    component_name: "Battery Pack",
    is_subcomponent: false,
    parent_component_id: null,
    updated_at: "2024-02-12T10:00:00",
    created_at: "2023-12-01T09:00:00",
    has_subcomponent: true,
    hsn_code: "85076000",
    sku_code: "BAT-204",
    subcomponents: [
      {
        component_id: "BATCELL01",
        component_name: "Battery Cell",
        is_subcomponent: true,
        parent_component_id: "BAT01",
        updated_at: "2024-03-10T11:00:00",
        created_at: "2023-12-10T08:00:00",
        has_subcomponent: false,
        hsn_code: "85076000",
        sku_code: "CELL-01",
        usable_quantity: 120,
        damaged_quantity: 2,
        discarded_quantity: 1,
        last_updated: "2024-04-01T12:30:00",
        total_quantity: 123
      },
      {
        component_id: "BMS01",
        component_name: "Battery Management System",
        is_subcomponent: true,
        parent_component_id: "BAT01",
        updated_at: "2024-03-01T12:00:00",
        created_at: "2023-12-15T10:00:00",
        has_subcomponent: false,
        hsn_code: "85371000",
        sku_code: "BMS-01",
        usable_quantity: 50,
        damaged_quantity: 1,
        discarded_quantity: 0,
        last_updated: "2024-04-01T12:30:00",
        total_quantity: 51
      }
    ]
  },
  {
    component_id: "MOT01",
    component_name: "Hub Motor",
    is_subcomponent: false,
    parent_component_id: null,
    updated_at: "2024-01-05T14:00:00",
    created_at: "2023-11-25T11:00:00",
    has_subcomponent: true,
    hsn_code: "85013100",
    sku_code: "MOT-320",
    subcomponents: [
      {
        component_id: "ROTOR01",
        component_name: "Rotor",
        is_subcomponent: true,
        parent_component_id: "MOT01",
        updated_at: "2024-02-15T10:00:00",
        created_at: "2023-12-01T08:30:00",
        has_subcomponent: false,
        hsn_code: "85013100",
        sku_code: "ROT-01",
        usable_quantity: 30,
        damaged_quantity: 1,
        discarded_quantity: 0,
        last_updated: "2024-03-05T14:30:00",
        total_quantity: 31
      },
      {
        component_id: "STATOR01",
        component_name: "Stator",
        is_subcomponent: true,
        parent_component_id: "MOT01",
        updated_at: "2024-02-10T09:00:00",
        created_at: "2023-12-01T08:30:00",
        has_subcomponent: false,
        hsn_code: "85013100",
        sku_code: "STA-01",
        usable_quantity: 28,
        damaged_quantity: 2,
        discarded_quantity: 1,
        last_updated: "2024-03-01T13:00:00",
        total_quantity: 31
      }
    ]
  },
  {
    component_id: "CTRL01",
    component_name: "Motor Controller",
    is_subcomponent: false,
    parent_component_id: null,
    updated_at: "2024-02-01T15:00:00",
    created_at: "2023-11-20T14:00:00",
    has_subcomponent: true,
    hsn_code: "85371000",
    sku_code: "CTRL-500",
    subcomponents: [
      {
        component_id: "PCB01",
        component_name: "PCB Board",
        is_subcomponent: true,
        parent_component_id: "CTRL01",
        updated_at: "2024-02-20T11:00:00",
        created_at: "2023-12-05T13:30:00",
        has_subcomponent: false,
        hsn_code: "85340090",
        sku_code: "PCB-CTRL",
        usable_quantity: 45,
        damaged_quantity: 2,
        discarded_quantity: 3,
        last_updated: "2024-03-10T10:00:00",
        total_quantity: 50
      },
      {
        component_id: "MOSFET01",
        component_name: "MOSFET Array",
        is_subcomponent: true,
        parent_component_id: "CTRL01",
        updated_at: "2024-02-18T09:30:00",
        created_at: "2023-12-10T14:00:00",
        has_subcomponent: false,
        hsn_code: "85412100",
        sku_code: "MOS-ARR",
        usable_quantity: 40,
        damaged_quantity: 5,
        discarded_quantity: 0,
        last_updated: "2024-03-15T11:30:00",
        total_quantity: 45
      }
    ]
  }
];
