import { InventoryTable } from '@/components/table';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-gray-900">
      <div className="z-10 w-full max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Inventory Management System</h1>
        <InventoryTable />
      </div>
    </main>
  );
}
