import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, IdCard, Mail, Lock } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only"),
  fullName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: "", fullName: "", email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success("Account created! Please verify your email.");
      navigate("/verify-notice", { state: { email: values.email } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">
        Sign Up
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          icon={UserRound}
          placeholder="Username"
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          icon={IdCard}
          placeholder="Full Name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
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

        <Button
          type="submit"
          size="lg"
          className="w-full mt-1"
          disabled={!isValid}
          loading={isSubmitting}
        >
          {isValid ? "Create Account" : "Please fill all fields"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-slate-900 underline underline-offset-2">
          Log In
        </Link>
      </p>
    </div>
  );
}
