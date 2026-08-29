import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../services/authApi";
import { useToast } from "../../context/ToastContext";

export default function Settings() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await authApi.changePassword(values);
      toast.success("Password changed successfully");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <Card className="max-w-md">
      <h2 className="font-bold text-slate-800 mb-1">Change Password</h2>
      <p className="text-xs text-slate-400 mb-5">Update your account password.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          icon={Lock}
          type="password"
          label="Current Password"
          error={errors.oldPassword?.message}
          {...register("oldPassword", { required: "Required" })}
        />
        <Input
          icon={Lock}
          type="password"
          label="New Password"
          error={errors.newPassword?.message}
          {...register("newPassword", { required: "Required", minLength: 8 })}
        />
        <Button type="submit" loading={isSubmitting} className="self-start">
          Update Password
        </Button>
      </form>
    </Card>
  );
}
