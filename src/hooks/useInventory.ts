"use client";
import { useState, useMemo } from 'react';
import useSWR from "swr";
import { InventoryItem } from "@/types/inventory";
import { fetcher } from "@/lib/fetcher";
import { mockInventoryData } from '@/data/mockInventory';

/**
 * Enhanced hook for inventory data management with advanced optimization for large datasets
 */
export function useInventory() {
    // State for mock data toggle
    const [useMockData, setUseMockData] = useState(false);
    
    // Use SWR with optimized configuration for better performance
    const { data, error, isLoading, mutate } = useSWR<InventoryItem[]>(
        useMockData ? null : "/api/inventory",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 15000,
            errorRetryCount: 3,
            revalidateOnReconnect: true,
            focusThrottleInterval: 10000, // Throttle focus revalidation
            loadingTimeout: 8000,       // Set timeout for loading state
            suspense: false             // Don't use React Suspense to handle loading state
        }
    );
    
    // Use mock data as fallback when needed - wrapped in useMemo to avoid dependency issues
    const sourceData = useMemo(() => {
        return useMockData || error ? mockInventoryData : data || [];
    }, [useMockData, error, data]);
    
    // Toggle function with proper error handling
    const toggleMockData = async (useMock = !useMockData) => {
        try {
            setUseMockData(useMock);
            if (!useMock) await mutate();
        } catch (e) {
            console.error('Error toggling data source:', e);
        }
    };
    
    // Completely redesigned data processing to create a grouped structure by parent component
    const processedData = useMemo(() => {
        // Ensure source data is an array
        const inventoryData = Array.isArray(sourceData) ? sourceData : [];
        // Define interface for processed inventory items
        interface ProcessedInventoryItem {
            component_id: string;
            component_name: string;
            is_subcomponent: boolean;
            parent_component_id: string | null;
            updated_at?: string;
            created_at?: string;
            has_subcomponent: boolean;
            hsn_code?: string;
            sku_code?: string;
            subcomponents: Subcomponent[];
        }
        
        // Define interface for subcomponent
        interface Subcomponent {
            component_id: string;
            component_name: string;
            parent_component_id: string;
            parent_component_name: string;
            is_subcomponent: boolean;
            has_subcomponent: boolean;
            updated_at: string;
            created_at: string;
            hsn_code: string;
            sku_code: string;
            usable_quantity: number;
            damaged_quantity: number;
            discarded_quantity: number;
            total_quantity: number;
        }
        
        // Create an array for grouped inventory items
        const groupedItems: ProcessedInventoryItem[] = [];
        
        try {
            // Create a map to organize parents and their subcomponents
            const parentMap = new Map<string, ProcessedInventoryItem>();
            
            // First pass: organize data by parent component
            for (const parent of inventoryData) {
                if (!parent || typeof parent !== 'object') continue;
                
                const parentId = parent.component_id;
                const parentName = parent.component_name || 'Unknown';
                
                // Skip if we've already processed this parent
                if (!parentMap.has(parentId)) {
                    // Create a new parent group object
                    parentMap.set(parentId, {
                        component_id: parentId,
                        component_name: parentName,
                        is_subcomponent: false,
                        parent_component_id: null,
                        updated_at: parent.updated_at,
                        created_at: parent.created_at,
                        has_subcomponent: true,
                        hsn_code: parent.hsn_code || '',
                        sku_code: parent.sku_code || '',
                        // Array to store subcomponents
                        subcomponents: []
                    });
                }
                
                // Get the parent object from the map
                const parentObj = parentMap.get(parentId);
                
                // Skip if parent object wasn't found (shouldn't happen normally)
                if (!parentObj) continue;
                
                // Process subcomponents
                const subcomponents = Array.isArray(parent.subcomponents) ? parent.subcomponents : [];
                
                // Create a set to track unique subcomponent IDs for this parent
                const uniqueSubcomponents = new Set<string>();
                
                // Add subcomponents to the parent object
                for (const sub of subcomponents) {
                    if (!sub || typeof sub !== 'object') continue;
                    
                    // Skip duplicate subcomponents
                    const subId = sub.component_id;
                    if (uniqueSubcomponents.has(subId)) continue;
                    uniqueSubcomponents.add(subId);
                    
                    // Create properly formatted subcomponent
                    const subItem = {
                        component_id: subId,
                        component_name: sub.component_name || 'Unknown Component',
                        parent_component_id: parentId,
                        parent_component_name: parentName,
                        is_subcomponent: true,
                        has_subcomponent: false,
                        updated_at: sub.updated_at || new Date().toISOString(),
                        created_at: sub.created_at || new Date().toISOString(),
                        hsn_code: sub.hsn_code || '',
                        sku_code: sub.sku_code || '',
                        usable_quantity: Number(sub.usable_quantity) || 0,
                        damaged_quantity: Number(sub.damaged_quantity) || 0,
                        discarded_quantity: Number(sub.discarded_quantity) || 0,
                        total_quantity: (Number(sub.usable_quantity) || 0) + 
                                        (Number(sub.damaged_quantity) || 0) + 
                                        (Number(sub.discarded_quantity) || 0)
                    };
                    
                    // Add to parent's subcomponents array
                    parentObj.subcomponents.push(subItem);
                }
            }
            
            // Convert parent map to array
            for (const parent of parentMap.values()) {
                // Sort subcomponents by name for consistency
                parent.subcomponents.sort((a: Subcomponent, b: Subcomponent) => {
                    return (a.component_name || '').localeCompare(b.component_name || '');
                });
                
                // Add parent to grouped items
                groupedItems.push(parent);
            }
            
            // Sort parent items alphabetically
            groupedItems.sort((a, b) => {
                return (a.component_name || '').localeCompare(b.component_name || '');
            });
            
        } catch (err) {
            console.error('Error processing inventory data:', err);
        }
        
        return groupedItems;
    }, [sourceData]); // Only recompute when source data changes
    
    return {
        data: sourceData,
        processedData,
        isLoading,
        error,
        useMockData,
        toggleMockData,
        mutate // Export the mutate function from SWR
    };
}