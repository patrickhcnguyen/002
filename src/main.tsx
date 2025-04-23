import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from './App.tsx';
import Index from './pages/Index.tsx';
import Schedule from './pages/Schedule.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Employees from './pages/Employees.tsx';
import Communication from './pages/Communication.tsx';
import Timesheet from './pages/Timesheet.tsx';
import Invoicing from './pages/Invoicing.tsx';
import CreateInvoice from './pages/CreateInvoice.tsx';
import ViewInvoice from './pages/ViewInvoice.tsx';
import Recruit from './pages/Recruit.tsx';
import Settings from './pages/Settings.tsx';
import Login from './pages/Login.tsx';
import OnboardingForm from './components/OnboardingForm.tsx';
import MultiStepForm from './pages/Form/MultiStepForm.tsx';
import { mobileEmployeeRoutes } from './routes/mobileEmployeeRoutes';
import SignUpForm from './pages/Auth/signUp.tsx';
import './index.css';

// Create a client
const queryClient = new QueryClient();

// Initialize Supabase client
const supabase = createClient(
  'https://tveorbhsokpnetvvgmsm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZW9yYmhzb2twbmV0dnZnbXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NjQ0NzIsImV4cCI6MjAyNTI0MDQ3Mn0.JBLk0Ax_u7ZyFNP8TuQY4uVoFHCrNqKYb-Wm8K7Aq4k'
);

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUpForm />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "employees/*",
        element: <Employees />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "communication",
        element: <Communication />,
      },
      {
        path: "timesheet",
        element: <Timesheet />,
      },
      {
        path: "invoicing",
        element: <Invoicing />,
      },
      {
        path: "invoicing/create",
        element: <CreateInvoice />,
      },
      {
        path: "invoicing/view",
        element: <ViewInvoice />,
      },
      {
        path: "recruit",
        element: <Recruit />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "onboarding",
        element: <OnboardingForm />,
      },
      {
        path: "staffing-request",
        element: <MultiStepForm />,
      },
      mobileEmployeeRoutes,
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </SessionContextProvider>
);