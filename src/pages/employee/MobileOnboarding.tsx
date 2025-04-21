
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoDisplay } from "@/components/LogoDisplay";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Employee, EmployerInvite } from "@/types/database";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const MobileOnboarding = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyEmployee = async (phone: string) => {
    // Check existing employee first
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select()
      .eq('phone', phone)
      .eq('status', 'active')
      .single();

    if (employeeError && employeeError.code !== 'PGRST116') {
      toast.error("Error verifying phone number");
      return false;
    }

    // Check for pending invite
    const { data: invite, error: inviteError } = await supabase
      .from('employer_invites')
      .select()
      .eq('phone', phone)
      .eq('status', 'pending')
      .single();

    if (inviteError && inviteError.code !== 'PGRST116') {
      toast.error("Error checking invites");
      return false;
    }

    if (employee) {
      localStorage.setItem("onboarding_employee_id", employee.id);
      return true;
    } else if (invite) {
      localStorage.setItem("onboarding_invite_id", invite.id);
      return true;
    } else {
      localStorage.setItem("onboarding_phone", phone);
      navigate("/mobile-employee/onboarding/employer-select");
      return false;
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      setIsVerifying(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;

      setShowOTP(true);
      toast.success("Verification code sent to your phone!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsVerifying(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      // Update employee or invite record with phone_verified = true
      if (await verifyEmployee(phoneNumber)) {
        const employeeId = localStorage.getItem("onboarding_employee_id");
        if (employeeId) {
          await supabase
            .from('employees')
            .update({ phone_verified: true })
            .eq('id', employeeId);
        }

        const inviteId = localStorage.getItem("onboarding_invite_id");
        if (inviteId) {
          await supabase
            .from('employer_invites')
            .update({ phone_verified: true })
            .eq('id', inviteId);
        }

        navigate("/mobile-employee/onboarding/questions");
        toast.success("Phone number verified!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <LogoDisplay />
          <h1 className="text-2xl font-bold text-center">Welcome to Evershift</h1>
          <p className="text-muted-foreground text-center">
            {showOTP ? "Enter verification code" : "Enter your phone number to get started"}
          </p>
        </div>

        {!showOTP ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="+1 (555) 555-5555"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-lg h-12"
                required
                disabled={isVerifying}
              />
            </div>
            <Button type="submit" className="w-full h-12" disabled={isVerifying}>
              {isVerifying ? "Sending..." : "Send Code"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2">
                  {slots.map((slot, idx) => (
                    <InputOTPSlot key={idx} {...slot} index={idx} />
                  ))}
                </InputOTPGroup>
              )}
            />
            <Button 
              onClick={handleVerifyOTP} 
              className="w-full h-12" 
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileOnboarding;
