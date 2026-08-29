import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">
        Welcome Back
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          icon={Mail}
          type="email"
          placeholder="Email Address"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          icon={Lock}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end -mt-1">
          <Link to="/forgot-password" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-1"
          disabled={!isValid}
          loading={isSubmitting}
        >
          {isValid ? "Log In" : "Please fill all fields"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-slate-900 underline underline-offset-2">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
