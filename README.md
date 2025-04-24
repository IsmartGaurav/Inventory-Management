<div align="center">

# Baaz Inventory Management System

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A powerful, real-time inventory management system designed for modern businesses. Track components, manage stock levels, and monitor inventory health with an intuitive interface.

[Demo](your-demo-link) · [Report Bug](your-issues-link) · [Request Feature](your-issues-link)

![Project Screenshot](screenshot-url.png)

</div>

## 🌟 Features

### 1. Component Hierarchy Management
- **Parent-Child Relationships**: Organize inventory items in a hierarchical structure
- **Subcomponent Tracking**: Monitor individual parts within larger assemblies
- **Flexible Organization**: Adapt to complex product structures and assemblies

### 2. Real-Time Stock Monitoring
- **Live Updates**: Track stock levels in real-time using SWR
- **Stock Alerts**: Automatic notifications for:
  - Low stock (< 30% of total inventory)
  - Out of stock items
  - Damaged inventory tracking
- **Quantity Management**:
  - Track usable quantities
  - Monitor damaged items
  - Record discarded components

### 3. Advanced Search & Filtering
- **Smart Search Algorithm**: Search across:
  - Component names
  - SKU codes
  - HSN codes
  - Subcomponent details
- **Instant Results**: Real-time search with optimized performance
- **Custom Filters**: Filter by:
  - Stock status
  - Component type
  - Date ranges

### 4. Responsive Data Grid
- **TanStack Table Integration**: 
  - Sortable columns
  - Pagination
  - Dynamic filtering
- **Mobile-Optimized Views**: Responsive design for all screen sizes
- **Custom Column Management**: Configurable table views

### 5. Data Management
- **API Integration**: 
  - Real-time data fetching
  - Automatic retry mechanism
  - Error handling with fallback to mock data
- **Caching Strategy**: 
  - Optimized with SWR
  - Configurable revalidation
  - Minimal server load

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/baaz-inventory.git
```

2. Install dependencies
```bash
cd baaz-inventory
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
```

## 💡 Usage Guide

### Basic Navigation

1. **Dashboard Overview**
   - View all inventory components
   - Monitor stock levels
   - Check alert status

2. **Search & Filter**
   ```typescript
   // Example search functionality
   const searchTerm = "battery";
   // Searches through:
   // - Component names
   // - SKU codes
   // - Subcomponent details
   ```

3. **Component Management**
   ```typescript
   interface InventoryItem {
     component_id: string;
     component_name: string;
     subcomponents?: InventoryItem[];
     // ... other properties
   }
   ```

### Advanced Features

#### Stock Monitoring
```typescript
// Stock level calculation
const stockLevel = (usable: number, total: number): StockStatus => {
  return (usable / total < 0.3) ? 'Low Stock' : 'Normal';
};
```

#### Data Refresh
- Auto-refresh every 15 seconds
- Manual refresh available
- Optimistic updates for better UX

## 🏗️ Project Structure

```
baaz-inventory/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Main inventory page
│   ├── components/         
│   │   ├── table.tsx       # Main inventory table
│   │   └── columns.tsx     # Table column definitions
│   ├── hooks/              
│   │   ├── useInventory.ts # Inventory data management
│   │   └── useEnhancedSearch.ts # Advanced search
│   ├── types/              
│   │   └── inventory.ts    # Type definitions
│   └── data/               
│       └── mockInventory.ts # Fallback data
└── ...config files
```

## ⚙️ Configuration

### API Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/inventory',
        destination: 'https://dev.electorq.com/dummy/inventory',
      },
    ]
  },
};
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_API_URL=https://your-api-url.com

# Optional
NEXT_PUBLIC_REFRESH_INTERVAL=15000
```

## 🔧 Development

### Commands

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Building
npm run build

# Production
npm start
```

### Code Style

We follow strict TypeScript practices and use ESLint with:
- Next.js core web vitals
- TypeScript recommended rules
- React hooks rules

## 📦 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

```bash
vercel --prod
```

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📫 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/baaz-inventory](https://github.com/your-username/baaz-inventory)

---

<div align="center">

**Built with ❤️ using Next.js and React**

</div>

