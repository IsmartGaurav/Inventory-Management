"use client";
import useSWR from "swr";
import { InventoryItem } from "@/types/inventory";
import { fetcher } from "@/lib/fetcher";

export function useInventory() {
    return useSWR<InventoryItem[]>("/api/inventory", fetcher);  
}