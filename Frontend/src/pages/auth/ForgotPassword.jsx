import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, MailCheck } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../services/authApi";
import { useToast } from "../../context/ToastContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPassword() {
  const toast = useToast();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = async (values) => {
    try {
      await authApi.forgotPassword(values);
      setSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
          <MailCheck size={26} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Check your inbox
        </h1>
        <p className="text-sm text-slate-500 max-w-xs">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
        <Link to="/login">
          <Button variant="outline">Back to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Forgot Password
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          icon={Mail}
          type="email"
          placeholder="Email Address"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full mt-1"
          disabled={!isValid}
          loading={isSubmitting}
        >
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Remembered it?{" "}
        <Link to="/login" className="font-bold text-slate-900 underline underline-offset-2">
          Log In
        </Link>
      </p>
    </div>
  );
}
