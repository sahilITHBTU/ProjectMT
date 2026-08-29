import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { authApi } from "../../services/authApi";
import Button from "../../components/ui/Button";

export default function VerifyEmail() {
  const { verificationToken } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await authApi.verifyEmail(verificationToken);
        if (mounted) setStatus("success");
      } catch (err) {
        if (mounted) {
          setStatus("error");
          setMessage(
            err?.response?.data?.message ||
              "Verification link is invalid or expired",
          );
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [verificationToken]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <Loader2 size={26} className="animate-spin text-slate-400" />
        <p className="text-sm text-slate-500">Verifying your email...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={26} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Email Verified
        </h1>
        <p className="text-sm text-slate-500 max-w-xs">
          Your account is now active. You can log in and get started.
        </p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="p-3 rounded-2xl bg-red-50 text-red-500">
        <XCircle size={26} />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Verification Failed
      </h1>
      <p className="text-sm text-slate-500 max-w-xs">{message}</p>
      <Link to="/login">
        <Button variant="outline">Back to Login</Button>
      </Link>
    </div>
  );
}
