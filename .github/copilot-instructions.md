# GitHub Copilot Instructions for Restaurant Management System

## Project Overview

This is a comprehensive, production-ready restaurant management application built with React, TypeScript, and modern web technologies. The system provides multi-location inventory tracking, vendor management, purchase order workflows with multi-tier approvals, and ML-powered analytics.

**Project Type**: Complex Application (advanced functionality, accounts)  
**Experience Goals**: Professional, Efficient, Intelligent  
**Target Users**: Restaurant staff, managers, regional managers, admins, and owners

## Technology Stack

### Core Technologies
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6.x for development and production builds
- **Styling**: Tailwind CSS v4 with custom OKLCH color system
- **UI Components**: shadcn/ui v4 (40+ pre-installed components)
- **State Management**: React Hooks (useState, useEffect, useContext) + Spark KV Store
- **Icons**: Phosphor Icons (1500+ icons available)
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for toast notifications
- **Animations**: Framer Motion

### Key Dependencies
- `@github/spark`: Spark platform integration with KV storage
- `@radix-ui/*`: Accessible component primitives
- `recharts`: Data visualization
- `date-fns`: Date manipulation
- `zod`: Schema validation
- `react-hook-form`: Form management

## Build, Test, and Validation

### Building the Project
```bash
npm install              # Install dependencies
npm run build           # TypeScript compilation + Vite production build
npm run dev             # Start development server (default: http://localhost:5173)
npm run preview         # Preview production build locally
```

### Linting
```bash
npm run lint            # Run ESLint on the codebase
```

**Note**: Currently uses ESLint 9.x with flat config. Configuration is in the root of the project.

### Testing
**Important**: There is currently NO test infrastructure in this project. Do not add tests unless specifically requested or implementing test infrastructure first.

### Code Quality Standards
- TypeScript strict mode is enabled (`strictNullChecks: true`)
- Use TypeScript for all new files (.tsx for React components, .ts for utilities)
- Follow existing ESLint rules (no-fallthrough-cases, etc.)
- Maintain accessibility standards (WCAG AA contrast ratios)

## Repository Structure

```
/
├── .github/                    # GitHub configuration
│   ├── copilot-instructions.md # This file
│   └── dependabot.yml         # Dependency updates config
├── src/
│   ├── components/
│   │   ├── ui/                # shadcn UI components (40+ reusable components)
│   │   ├── views/             # Main application views
│   │   │   ├── analytics-view.tsx    # ML-powered analytics dashboard
│   │   │   ├── inventory-view.tsx    # Real-time inventory management
│   │   │   ├── orders-view.tsx       # Multi-tier purchase order system
│   │   │   └── vendors-view.tsx      # Vendor management
│   │   ├── header.tsx         # App header with location selector
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   ├── login-page.tsx     # Authentication interface
│   │   └── kpi-card.tsx      # Reusable KPI display component
│   ├── lib/
│   │   ├── types.ts          # TypeScript type definitions (central source of truth)
│   │   ├── permissions.ts    # Role-based permission logic
│   │   ├── analytics.ts      # ML algorithms (linear regression, forecasting)
│   │   ├── auth-context.tsx  # Authentication context provider
│   │   └── utils.ts          # Utility functions (cn, date helpers)
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # Additional style files
│   ├── App.tsx               # Main application component
│   ├── index.css             # Global styles and Tailwind imports
│   └── main.tsx              # Application entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── components.json          # shadcn/ui configuration
├── PRD.md                   # Product Requirements Document (detailed specs)
├── README.md                # User-facing documentation
└── SECURITY.md              # Security policy

```

## Key Concepts and Architecture

### 1. Authentication & Authorization

**Authentication Context**: `/src/lib/auth-context.tsx`
- Provides authentication state throughout the app
- Stores current user, role, and location
- Uses Context API pattern

**Role-Based Access Control**: `/src/lib/permissions.ts`
- Five distinct roles: Staff, Manager, Regional Manager, Admin, Owner
- Hierarchical permissions system
- Functions: `canApproveOrders()`, `canManageUsers()`, `canViewAnalytics()`, etc.

**Demo Accounts**:
- `owner` / any password - Full system access
- `admin` / any password - User management, order approval
- `regional` / any password - Multi-location oversight
- `manager` / any password - Single location management
- `staff` / any password - Basic inventory and order creation

### 2. Data Storage

**Spark KV Store**: Persistent storage via browser IndexedDB
- Key-value pairs for: users, locations, inventory, vendors, orders, sales, waste, alerts
- Access via Spark platform APIs
- Data persists across sessions

**Important**: All data mutations should update the KV store to maintain persistence.

### 3. Multi-Location Support

- Users are assigned to a specific location (`locationId`)
- Regional Managers and higher can view/manage multiple locations
- Location selector in header for switching context
- Data is filtered by location unless user has cross-location permissions

### 4. Type System

**Central Types**: `/src/lib/types.ts`

Key type definitions:
```typescript
- User: id, username, name, role, email, locationId
- Location: id, name, address, city, state, managerId
- InventoryItem: id, name, category, quantity, cost, reorderPoint, expirationDate, location
- Vendor: id, name, contact, rating, categories, paymentTerms
- PurchaseOrder: id, orderNumber, vendor, items, status, approvals, location
- Role: 'staff' | 'manager' | 'regional_manager' | 'admin' | 'owner'
```

**Always** reference these types when working with data structures.

### 5. ML-Powered Analytics

**Analytics Module**: `/src/lib/analytics.ts`

Implements:
- **Linear Regression**: For demand forecasting (7-day prediction)
- **Trend Analysis**: Sales patterns and revenue trends
- **Waste Analysis**: Categorization by reason (expiration, spoilage, damage, overproduction)
- **Inventory Optimization**: Reorder point calculations
- **Confidence Scoring**: R² coefficient for prediction accuracy

### 6. Purchase Order Workflow

Multi-tier approval system:
1. **Pending Manager**: Staff creates order
2. **Pending Admin**: Manager approves
3. **Approved**: Admin approves
4. **Ordered**: Sent to vendor
5. **Delivered**: Received and confirmed

Orders can be rejected at any approval stage with a reason.

## Development Guidelines

### Component Patterns

1. **Use shadcn/ui components** from `/src/components/ui/` when building UI
2. **Functional components with hooks**: No class components
3. **TypeScript interfaces**: Define prop types for all components
4. **Controlled components**: Form inputs should use React state

Example pattern:
```tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState<string>('');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* content */}
      </CardContent>
    </Card>
  );
}
```

### Styling Conventions

1. **Tailwind classes**: Use utility-first approach
2. **Color system**: Use theme colors defined in `index.css`
   - Primary: Deep Teal `oklch(0.45 0.12 210)`
   - Secondary: Warm Coral `oklch(0.65 0.15 25)`
   - Accent: Energetic Amber `oklch(0.70 0.15 75)`
   - Analytics: Purple `oklch(0.50 0.13 290)`
3. **Spacing**: Consistent scale (gap-6, p-6, space-y-4)
4. **Typography**: Inter font, size scale from 12px to 32px
5. **Accessibility**: Maintain WCAG AA contrast (4.5:1 minimum)

### State Management

1. **Local state**: `useState` for component-specific state
2. **Shared state**: Context API for authentication, location
3. **Persistent data**: Spark KV Store for long-term storage
4. **Derived state**: Compute from props/state, don't store

### Code Organization

1. **One component per file**: Match filename to component name
2. **Group related utilities**: Keep helpers in `/src/lib/utils.ts`
3. **Type definitions**: Centralize in `/src/lib/types.ts`
4. **View components**: Large page-level components go in `/src/components/views/`
5. **Reusable UI**: Small reusable components go in `/src/components/ui/` (shadcn)

### Import Conventions

Use path aliases for cleaner imports:
```typescript
import { User, Role } from '@/lib/types';
import { canApproveOrders } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
```

### Error Handling

1. **Try-catch blocks**: For async operations and KV store access
2. **Error boundaries**: React Error Boundary for component errors
3. **User feedback**: Use Sonner toast for success/error messages
4. **Fallbacks**: Provide meaningful fallback UI for loading/error states

## Common Tasks

### Adding a New View/Page

1. Create component in `/src/components/views/[name]-view.tsx`
2. Import required types from `/src/lib/types.ts`
3. Check permissions using `/src/lib/permissions.ts`
4. Add navigation link in `/src/components/sidebar.tsx`
5. Integrate with main app routing in `/src/App.tsx`

### Adding a New Permission

1. Update `getRolePermissions()` in `/src/lib/permissions.ts`
2. Add permission check function (e.g., `canDoSomething()`)
3. Use permission check in components: `if (!canDoSomething(user.role)) return null;`

### Working with KV Store

```typescript
import { useKV } from '@github/spark';

function MyComponent() {
  const { data, isLoading } = useKV<MyType>('my-key');
  
  const updateData = async () => {
    await setKV('my-key', newValue);
  };
  
  if (isLoading) return <LoadingSpinner />;
  return <div>{/* use data */}</div>;
}
```

### Adding a shadcn Component

```bash
# Install a new shadcn component
npx shadcn@latest add [component-name]

# Example: Add a new dialog component
npx shadcn@latest add dialog
```

This will add the component to `/src/components/ui/`.

## Best Practices

### Performance
- Use React.memo() for expensive components
- Lazy load route components when needed
- Debounce search inputs and frequent updates
- Optimize chart re-renders (use memoization)

### Accessibility
- All interactive elements need keyboard navigation
- Maintain color contrast ratios (WCAG AA)
- Use semantic HTML elements
- Add ARIA labels where needed
- Test with screen readers

### Security
- Never expose sensitive data in client code
- Validate all user inputs
- Use proper RBAC checks before showing/enabling features
- Sanitize data before rendering (prevent XSS)

### Code Quality
- Write self-documenting code (clear variable/function names)
- Add comments for complex business logic
- Keep functions small and focused (single responsibility)
- Avoid deep nesting (max 3-4 levels)
- Extract magic numbers into named constants

## Technical Debt & Known Issues

1. **No test infrastructure**: Tests should be added before making significant changes
2. **Client-side only**: Currently no backend/API integration
3. **Bundle size**: Main bundle is >500KB (consider code splitting)
4. **Data persistence**: Relies on browser storage (no cloud backup)
5. **Real-time updates**: No WebSocket/polling for multi-user scenarios

## Design Principles

1. **Information Density**: Restaurant managers need to see lots of data at once
2. **Efficiency First**: Minimize clicks, optimize workflows for daily operations
3. **Progressive Disclosure**: Show details on demand, summaries by default
4. **Predictability**: Consistent patterns, no surprises in UX
5. **Professional Polish**: Enterprise-grade feel, not consumer-app flashy

## Documentation

- **PRD.md**: Detailed product requirements and feature specifications
- **README.md**: User guide, getting started, demo accounts, troubleshooting
- **SECURITY.md**: Security policy and vulnerability reporting
- **This file**: Developer onboarding and technical guidance

## Support & Questions

When making changes:
1. Review existing patterns in similar components
2. Check PRD.md for business requirements
3. Verify permissions in permissions.ts
4. Test with different user roles
5. Ensure responsive design (mobile, tablet, desktop)
6. Validate accessibility standards

---

**Note**: This is a demonstration/prototype project. Focus on code quality, maintainability, and following established patterns rather than production deployment concerns.
