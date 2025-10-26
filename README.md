# Restaurant Management System

A comprehensive, production-ready restaurant management application built with React, TypeScript, and modern web technologies. This system provides multi-location inventory tracking, vendor management, purchase order workflows with multi-tier approvals, and ML-powered analytics.

## 🌟 Features

### Core Functionality

#### 1. **Advanced Inventory Management**
- Real-time stock tracking with automatic alerts
- Low-stock notifications when items reach reorder points
- Expiration date monitoring with advance warnings (7 days)
- FIFO (First In, First Out) rotation tracking
- Barcode support for quick item identification
- Category-based organization and filtering
- Comprehensive search functionality
- Stock value calculations and reporting

#### 2. **Multi-Tier Purchase Order System**
- Hierarchical approval workflow: Staff → Manager → Admin
- Order creation with multiple items and vendors
- Status tracking through entire lifecycle
- Rejection with reason documentation
- Order history and audit trail
- Expected vs actual delivery tracking
- Tax calculation and total management

#### 3. **Vendor Management**
- Complete vendor database with contact information
- Rating system for performance tracking
- Average delivery time monitoring
- Category-based vendor organization
- Payment terms documentation
- Vendor comparison capabilities
- Historical ordering data

#### 4. **ML-Powered Analytics**
- **Demand Forecasting**: Linear regression-based prediction for next 7 days
- **Sales Trend Analysis**: Visual charts showing revenue patterns
- **Waste Pattern Identification**: Analysis by reason (expiration, spoilage, damage, overproduction)
- **Inventory Valuation**: Real-time total inventory value calculation
- **Top Selling Items**: Revenue and quantity-based rankings
- **Cost Optimization**: Spending trends and recommendations
- **Predictive Alerts**: Proactive notifications based on historical patterns

#### 5. **Role-Based Access Control**
Five distinct user roles with granular permissions:

- **Owner**: Full system access, all locations
- **Admin**: User management, order approval, multi-location view
- **Regional Manager**: Cross-location oversight, order approval
- **Manager**: Single location management, order approval
- **Staff**: Inventory updates, order creation

#### 6. **Multi-Location Support**
- Location-based data segregation
- Cross-location reporting for regional managers
- Independent inventory management per location
- Location-specific order tracking
- Consolidated analytics across locations

## 🏗️ Architecture

### Technology Stack

**Frontend Framework:**
- React 19 with TypeScript
- Vite for blazing-fast development
- Tailwind CSS v4 for styling
- shadcn/ui component library (v4)

**State Management:**
- React Hooks (useState, useEffect, useContext)
- Spark KV Store for persistent data
- Context API for authentication

**Data Visualization:**
- Recharts for interactive charts
- Custom KPI cards with trend indicators
- Responsive data tables

**UI Components:**
- 40+ pre-installed shadcn components
- Phosphor Icons for consistent iconography
- Sonner for toast notifications
- Framer Motion for smooth animations

### Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn UI components (40+ components)
│   ├── views/                 # Main application views
│   │   ├── inventory-view.tsx
│   │   ├── orders-view.tsx
│   │   ├── vendors-view.tsx
│   │   └── analytics-view.tsx
│   ├── header.tsx             # App header with location selector
│   ├── sidebar.tsx            # Navigation sidebar
│   ├── login-page.tsx         # Authentication interface
│   └── kpi-card.tsx          # Reusable KPI display component
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── permissions.ts        # Role-based permission logic
│   ├── analytics.ts          # ML algorithms and analytics functions
│   ├── auth-context.tsx      # Authentication context provider
│   └── utils.ts              # Utility functions
├── App.tsx                   # Main application component
├── index.css                 # Theme and global styles
└── main.tsx                  # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or access the project**
   ```bash
   cd /workspaces/spark-template
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to the URL shown in terminal (typically `http://localhost:5173`)

## 👤 Demo Accounts

The application comes with 5 pre-configured demo accounts demonstrating different permission levels:

| Role | Username | Password | Capabilities |
|------|----------|----------|-------------|
| **Owner** | `owner` | any | Full system access, all features |
| **Admin** | `admin` | any | Approve orders, manage users, view all locations |
| **Regional Manager** | `regional` | any | Multi-location oversight, approve orders |
| **Manager** | `manager` | any | Location management, approve orders |
| **Staff** | `staff` | any | Update inventory, create orders |

*Note: Any password works for demo purposes*

## 📊 Data Model

### Key Entities

**User**
- ID, username, name, role, email
- Location assignment
- Role-based permissions

**Location**
- ID, name, address, city, state
- Manager assignment

**Inventory Item**
- ID, name, category, stock levels
- Cost tracking, reorder points
- Expiration dates, FIFO tracking
- Location assignment

**Vendor**
- ID, name, contact information
- Rating, delivery time averages
- Categories, payment terms

**Purchase Order**
- Order number, vendor, location
- Line items with quantities and pricing
- Status workflow tracking
- Approval chain documentation

**Sales Data**
- Date, item, quantity sold, revenue
- Location tracking
- Historical trend data

**Waste Data**
- Date, item, quantity, reason
- Cost impact calculation
- Pattern analysis data

## 🔐 Permission Matrix

| Feature | Staff | Manager | Regional | Admin | Owner |
|---------|-------|---------|----------|-------|-------|
| View Inventory | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Inventory | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Orders | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve Orders | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit Vendors | ❌ | ✅ | ✅ | ✅ | ✅ |
| View Analytics | ❌ | ✅ | ✅ | ✅ | ✅ |
| Multi-Location | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ | ✅ |

## 🧪 Sample Data

The application includes comprehensive seed data:

- **3 Locations**: Downtown Restaurant, Marina District, Mission Branch
- **5 Users**: One for each role level
- **12 Inventory Items**: Across categories (Produce, Meat, Dairy, Seafood, Dry Goods)
- **4 Vendors**: With varying ratings and delivery times
- **5 Purchase Orders**: In different approval states
- **21 Sales Records**: 7 days of data for 3 items
- **5 Waste Records**: Various reasons demonstrating analytics
- **5 Active Alerts**: Low stock, expiration, and approval requests

## 📈 Analytics & Machine Learning

### Demand Forecasting Algorithm

The system implements linear regression for demand prediction:

```typescript
y = mx + b
where:
  y = predicted quantity
  x = time period
  m = slope (trend)
  b = intercept (baseline)
```

**Confidence Score**: R² (coefficient of determination) shows prediction accuracy
**Trend Detection**: Identifies increasing, decreasing, or stable demand patterns

### Waste Analysis

Aggregates waste data by reason:
- Expiration (date-based spoilage)
- Spoilage (quality degradation)
- Damage (physical issues)
- Overproduction (excess preparation)

Calculates:
- Total cost impact by reason
- Percentage distribution
- Trending patterns over time

### Inventory Optimization

**Reorder Point Calculation**:
```
Reorder Point = (Avg Daily Sales × Lead Time) + Safety Stock
```

**Economic Order Quantity (EOQ)**:
```
EOQ = √((2 × Annual Demand × Order Cost) / Holding Cost per Unit)
```

## 🎨 Design System

### Color Palette

The application uses a triadic color scheme with carefully selected OKLCH values:

- **Primary (Deep Teal)**: `oklch(0.45 0.12 210)` - Stability, inventory features
- **Secondary (Warm Coral)**: `oklch(0.65 0.15 25)` - Vendor/ordering
- **Accent (Energetic Amber)**: `oklch(0.70 0.15 75)` - Alerts, CTAs
- **Analytics Purple**: `oklch(0.50 0.13 290)` - Insights, reports

All color pairings meet WCAG AA accessibility standards (4.5:1 contrast minimum).

### Typography

**Font**: Inter - optimized for UI legibility
- H1: 32px SemiBold, tight tracking
- H2: 24px SemiBold, tight tracking
- H3: 18px Medium
- Body: 14px Regular, relaxed line-height
- Small: 12px Regular

### Spacing System

Consistent Tailwind spacing scale:
- Layout gutters: `gap-6` (24px)
- Card padding: `p-6` (24px)
- Form fields: `space-y-4` (16px)
- Table cells: `px-4 py-3`

## 🔄 Workflow Examples

### Creating a Purchase Order

1. Staff member navigates to **Purchase Orders**
2. Clicks **Create Order**
3. Selects vendor from dropdown
4. Adds inventory items with quantities and prices
5. Reviews total (subtotal + 8% tax)
6. Submits order → Status: **Pending Manager**
7. Manager reviews and approves → Status: **Pending Admin**
8. Admin final approval → Status: **Approved**
9. Order placed with vendor → Status: **Ordered**
10. Delivery received → Status: **Delivered**

### Inventory Alert Flow

1. System checks stock levels every time inventory updates
2. When `currentStock <= reorderPoint`:
   - Alert created with severity (warning/critical)
   - Notification appears in header badge
   - Alert listed in alerts section
3. Staff/Manager creates purchase order for item
4. After order approved and delivered, stock replenished
5. Alert auto-resolves when stock above reorder point

## 📱 Responsive Design

**Desktop (1024px+)**:
- Three-column layout: Sidebar | Main Content | Info Panel
- Full tables with all columns visible
- Side-by-side charts and KPIs

**Tablet (768px - 1023px)**:
- Two-column: Collapsible Sidebar | Main Content
- Horizontal scroll on wide tables
- Stacked charts

**Mobile (<768px)**:
- Single column layout
- Hamburger menu for navigation
- Bottom tab bar for main sections
- Card-based views replace tables
- Simplified charts with drill-down

## 🔧 Customization

### Adding a New User

Edit the KV store data for `users` key:

```typescript
{
  id: "user-new",
  username: "newuser",
  name: "New User",
  role: "staff", // or manager, regional_manager, admin, owner
  locationId: "loc-1",
  email: "newuser@restaurant.com"
}
```

### Adding a New Location

Edit the KV store data for `locations` key:

```typescript
{
  id: "loc-new",
  name: "New Location Name",
  address: "123 Street",
  city: "City",
  state: "ST",
  managerId: "user-id"
}
```

### Modifying Permissions

Edit `src/lib/permissions.ts` and adjust the `getRolePermissions` function to change what each role can access.

## 🐛 Troubleshooting

**Issue**: Login not working
- **Solution**: Ensure you're using one of the demo usernames (owner, admin, regional, manager, staff). Any password works.

**Issue**: Data not persisting
- **Solution**: Data is stored in browser's IndexedDB via Spark KV. Clear browser cache may reset data.

**Issue**: Charts not displaying
- **Solution**: Ensure there's sufficient sales/waste data in the KV store. Charts need minimum 3 data points.

**Issue**: Permissions not working correctly
- **Solution**: Logout and login again to refresh permissions. Check user role in localStorage.

## 🚀 Future Enhancements

Potential features for expansion:

- [ ] Real-time notifications with WebSocket
- [ ] Advanced reporting with PDF export
- [ ] Barcode scanner integration via device camera
- [ ] Recipe management with ingredient tracking
- [ ] Employee scheduling and time tracking
- [ ] Customer loyalty program integration
- [ ] Supplier API integrations for automated ordering
- [ ] Mobile native apps (React Native)
- [ ] Multi-language support
- [ ] Advanced ML models (neural networks for demand)

## 📝 License

This is a demonstration project created for educational and prototyping purposes.

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the PRD.md for detailed specifications
3. Examine the inline code comments
4. Test with different user roles to understand permissions

---

**Built with ❤️ using React, TypeScript, and Modern Web Technologies**
