import { useRef, useState } from "react";
import { Camera, Loader2, MailCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { authApi } from "../../services/authApi";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { initials, formatDate } from "../../utils/formatters";

const MAX_AVATAR_SIZE = 1 * 1024 * 1024;

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const hasCustomAvatar = !!user?.avatar?.url && !avatarBroken;

  const onPickAvatar = () => fileInputRef.current?.click();

  const onAvatarSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Image must be under 1MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const { data } = await authApi.updateAvatar(formData);
      setUser(data?.data ?? null);
      setAvatarBroken(false);
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update photo");
    } finally {
      setUploading(false);
    }
  };

  const onVerifyEmail = async () => {
    setVerifying(true);
    try {
      const { data } = await authApi.resendVerification();
      toast.success(data?.message || "Verification email sent");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to send verification email",
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card className="max-w-md flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          {hasCustomAvatar ? (
            <img
              src={user.avatar.url}
              alt={user?.fullName || user?.username}
              onError={() => setAvatarBroken(true)}
              className="w-16 h-16 rounded-full object-cover bg-slate-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center text-xl font-bold">
              {initials(user?.fullName || user?.username || "U")}
            </div>
          )}

          <button
            type="button"
            onClick={onPickAvatar}
            disabled={uploading}
            title="Change photo"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center border-2 border-white cursor-pointer hover:bg-slate-800 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Camera size={13} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onAvatarSelected}
            className="hidden"
          />
        </div>

        <div>
          <h2 className="font-bold text-slate-900 text-lg">
            {user?.fullName || user?.username}
          </h2>
          <p className="text-sm text-slate-400">@{user?.username}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-slate-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Email</span>
          <span className="font-semibold text-slate-700">{user?.email}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Verified</span>
          <Badge variant={user?.isEmailVerfied ? "success" : "danger"}>
            {user?.isEmailVerfied ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Joined</span>
          <span className="font-semibold text-slate-700">
            {formatDate(user?.createdAt)}
          </span>
        </div>
      </div>

      {!user?.isEmailVerfied && (
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-400 leading-relaxed">
            Your email isn't verified yet. Verify it to secure your account.
          </p>
          <Button
            size="sm"
            variant="secondary"
            icon={MailCheck}
            onClick={onVerifyEmail}
            loading={verifying}
            className="flex-shrink-0"
          >
            Verify email
          </Button>
        </div>
      )}
    </Card>
  );
}
