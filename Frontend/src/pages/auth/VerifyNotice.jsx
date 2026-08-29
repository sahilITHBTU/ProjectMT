import { Link, useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";
import Button from "../../components/ui/Button";

export default function VerifyNotice() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
        <MailCheck size={26} />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Verify your email
      </h1>
      <p className="text-sm text-slate-500 max-w-xs">
        We've sent a verification link to{" "}
        <span className="font-semibold text-slate-700">{email || "your email address"}</span>.
        Click it to activate your account.
      </p>
      <Link to="/login">
        <Button variant="outline">Back to Login</Button>
      </Link>
    </div>
  );
}
