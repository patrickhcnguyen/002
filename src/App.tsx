import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useSession } from '@supabase/auth-helpers-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InvoiceCard } from '@/features/invoicing/components/InvoiceCard';

function App() {
  const session = useSession();
  
  // Hide sidebar only on landing page and mobile employee routes
  const path = window.location.pathname;
  const isLandingPage = path === '/';
  const isMobileEmployee = path.startsWith('/mobile-employee');
  const showSidebar = !isLandingPage && !isMobileEmployee && session;
  
  console.log('Current path:', path);
  console.log('Show sidebar:', showSidebar);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {showSidebar && <AppSidebar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;