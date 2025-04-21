
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PayStub {
  id: string;
  created_at: string;
  amount: number;
  document_url: string | null;
}

interface PayrollEntry {
  id: string;
  created_at: string;
  gross_pay: number;
  document_url: string | null;
  employee_id: string;
  break_hours: number;
  overtime_hours: number;
  overtime_rate: number;
  payroll_period_id: string;
  regular_hours: number;
  regular_rate: number;
  updated_at: string;
  notes: string;
}

const PayStubs = () => {
  const [payStubs, setPayStubs] = useState<PayStub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayStubs = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('payroll_entries')
          .select('*')
          .eq('employee_id', user.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching pay stubs:', error);
          toast.error('Failed to load pay stubs');
          return;
        }

        // Map the payroll entries to match our PayStub interface
        const mappedPayStubs: PayStub[] = (data as PayrollEntry[]).map(entry => ({
          id: entry.id,
          created_at: entry.created_at,
          amount: entry.gross_pay,
          document_url: entry.document_url
        }));

        setPayStubs(mappedPayStubs);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load pay stubs');
      } finally {
        setLoading(false);
      }
    };

    fetchPayStubs();
  }, []);

  const handleDownload = async (stub: PayStub) => {
    if (!stub.document_url) {
      toast.error('No document available for this pay stub');
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('paystubs')
        .download(stub.document_url);

      if (error) {
        throw error;
      }

      // Create a download link for the file
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paystub-${new Date(stub.created_at).toLocaleDateString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Pay stub downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download pay stub');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Pay Stubs</h1>
        <p>Loading pay stubs...</p>
      </div>
    );
  }

  if (payStubs.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Pay Stubs</h1>
        <p>No pay stubs available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">Pay Stubs</h1>
      {payStubs.map((stub) => (
        <Card key={stub.id} className="flex justify-between items-center p-4">
          <CardHeader>
            <CardTitle>
              {new Date(stub.created_at).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <span className="text-lg font-medium">
              ${stub.amount.toFixed(2)}
            </span>
            <Button 
              onClick={() => handleDownload(stub)}
              disabled={!stub.document_url}
            >
              Download
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PayStubs;
