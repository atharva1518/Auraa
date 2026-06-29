import { useState, useEffect } from "react";
import { LogIn, Phone, Send, Key, AlertCircle } from "lucide-react";

interface AuthProvidersProps {
  onGoogleLogin: () => void;
  onSetupRecaptcha: (containerId: string) => void;
  onClearRecaptcha: () => void;
  onSendOtp: (phone: string) => Promise<void>;
  onVerifyOtp: (code: string) => Promise<void>;
  hasConfirmationResult: boolean;
  isLoading: boolean;
}

export function AuthProviders({ 
  onGoogleLogin, 
  onSetupRecaptcha,
  onClearRecaptcha,
  onSendOtp,
  onVerifyOtp,
  hasConfirmationResult,
  isLoading 
}: AuthProvidersProps) {
  const [provider, setProvider] = useState<"google" | "phone" | null>(null);
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider === "phone") {
      onSetupRecaptcha("recaptcha-container");
    }
    return () => {
      if (provider === "phone") {
        onClearRecaptcha();
      }
    };
  }, [provider, onSetupRecaptcha, onClearRecaptcha]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleaned = input.replace(/[^\d+]/g, '');
    setPhone(cleaned);
    
    if (cleaned.length > 0 && !cleaned.startsWith('+')) {
      setErrorMsg("Phone number must start with a country code (e.g. +1, +91)");
    } else if (cleaned.length > 0 && cleaned.length < 8) {
      setErrorMsg("Phone number is too short");
    } else if (cleaned.length > 16) {
      setErrorMsg("Phone number is too long");
    } else {
      setErrorMsg("");
    }
  };

  const isPhoneValid = phone.startsWith('+') && phone.length >= 8 && phone.length <= 16;

  const handleSendOtp = async () => {
    if (!isPhoneValid) return;
    setLoading(true);
    try {
      await onSendOtp(phone);
    } catch (e: any) {
      // Allow user to try again, Firebase error already logged to Developer Panel
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      await onVerifyOtp(otp);
    } catch (e: any) {
      // Let user retry or check developer panel
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => {
            setProvider("google");
            onGoogleLogin();
          }}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          Continue with Google
        </button>

        <button
          onClick={() => setProvider("phone")}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full bg-gray-800 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 border border-gray-700"
        >
          <Phone className="w-5 h-5" />
          Continue with Phone
        </button>
      </div>
    );
  }

  if (provider === "phone") {
    return (
      <div className="flex flex-col gap-4">
        <div id="recaptcha-container"></div>
        
        {!hasConfirmationResult ? (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-400">Phone Number (E.164 Format)</label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={handlePhoneChange}
              disabled={loading || isLoading}
              className={`bg-black/20 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-aura-500)] ${errorMsg ? 'border-red-500/50' : 'border-white/10'}`}
            />
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            <button
              onClick={handleSendOtp}
              disabled={loading || isLoading || !isPhoneValid}
              className="flex items-center justify-center gap-2 w-full bg-[var(--color-aura-600)] text-white font-medium py-3 px-4 rounded-xl hover:bg-[var(--color-aura-500)] transition-colors disabled:opacity-50 mt-2"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button 
              onClick={() => {
                onClearRecaptcha();
                setProvider(null);
                setPhone("");
                setErrorMsg("");
              }}
              disabled={loading}
              className="text-sm text-gray-400 hover:text-white mt-2 disabled:opacity-50"
            >
              Back to options
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-400">Enter OTP</label>
            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading || isLoading}
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-aura-500)] tracking-widest text-center text-lg"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || isLoading || !otp}
              className="flex items-center justify-center gap-2 w-full bg-[var(--color-aura-600)] text-white font-medium py-3 px-4 rounded-xl hover:bg-[var(--color-aura-500)] transition-colors disabled:opacity-50 mt-2"
            >
              <Key className="w-4 h-4" />
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button 
              onClick={() => {
                onClearRecaptcha();
                setProvider(null);
                setOtp("");
              }}
              disabled={loading}
              className="text-sm text-gray-400 hover:text-white mt-2 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="animate-spin w-6 h-6 border-2 border-[var(--color-aura-500)] border-t-transparent rounded-full" />
    </div>
  );
}
