import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../services/authApi";
import { useToast } from "../../context/ToastContext";

const schema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export default function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { newPassword: "" },
  });

  const onSubmit = async (values) => {
    try {
      await authApi.resetPassword(resetToken, values);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset link is invalid or expired");
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 mt-2">Choose a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          icon={Lock}
          type="password"
          placeholder="New Password"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full mt-1"
          disabled={!isValid}
          loading={isSubmitting}
        >
          Reset Password
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        <Link to="/login" className="font-bold text-slate-900 underline underline-offset-2">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
