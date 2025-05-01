// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import supabase from '@/lib/supabaseClient';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const session = useSession();
  
    useEffect(() => {
      async function checkUserRole() {
        if (!session?.user?.email) return;
        
        const { data } = await supabase
          .from('admins')
          .select('role')
          .eq('email', session.user.email)
          .single();
        
        setIsSuperAdmin(data?.role === 'superadmin');
      }
      
      checkUserRole();
    }, [session?.user?.email]);
  
    return { user, isSuperAdmin };
  }