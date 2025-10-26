import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { LoginPage } from '@/components/login-page';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { InventoryView } from '@/components/views/inventory-view';
import { OrdersView } from '@/components/views/orders-view';
import { VendorsView } from '@/components/views/vendors-view';
import { AnalyticsView } from '@/components/views/analytics-view';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [activeView, setActiveView] = useState('inventory');
  const [selectedLocationId, setSelectedLocationId] = useState('');

  useEffect(() => {
    if (user && !selectedLocationId) {
      setSelectedLocationId(user.locationId);
    }
  }, [user, selectedLocationId]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedLocationId={selectedLocationId} 
        onLocationChange={setSelectedLocationId} 
      />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-8">
          {activeView === 'inventory' && <InventoryView locationId={selectedLocationId} />}
          {activeView === 'orders' && <OrdersView locationId={selectedLocationId} />}
          {activeView === 'vendors' && <VendorsView />}
          {activeView === 'analytics' && <AnalyticsView locationId={selectedLocationId} />}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;