import { STATUS_STYLE_CONFIG } from "@/lib/constants/colors";
import { OnlineStatus } from "@/types";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { Camera } from "lucide-react";
import { MAX_AVATAR_SIZE } from "@/lib/constants/constants";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
  className?: string;
  status?: OnlineStatus;
  canUpload?: boolean;
  onAvatarUploaded?: (newAvatarUrl: string) => void;
}

export const UserAvatar = ({
  username,
  avatarUrl,
  className,
  status,
  canUpload = false,
  onAvatarUploaded,
}: UserAvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstLetter = username.charAt(0).toUpperCase();
  const currentStatus = STATUS_STYLE_CONFIG[status];

  // Use preview if available, otherwise fall back to avatarUrl
  const displayUrl = previewUrl || avatarUrl;
  const showImage = displayUrl && !hasImageError;

  useEffect(() => {
    setHasImageError(false);
  }, [avatarUrl]);
  
  const { mutate: uploadAvatar, isLoading: isUploading } = useMutation(
    userApi.uploadAvatar,
    {
      onSuccess: (response) => {
        toast.success("Avatar uploaded successfully");
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Notify caller of the new avatar URL
        if (response?.avatarUrl && onAvatarUploaded) {
          onAvatarUploaded(response.avatarUrl);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to upload avatar");
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    }
  );

  const handleAvatarClick = () => {
    if (canUpload) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a PNG or JPEG image.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error(
        `File size exceeds the maximum ${MAX_AVATAR_SIZE} allowed size.`
      );
      return;
    }

    // Create immedaite preview for better UX
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Automatically upload the file
    const formData = new FormData();
    formData.append("avatar", file);
    await uploadAvatar(formData);
  };

  return (
    <div className="relative group">
      {showImage ? (
        <div
          className={cn(
            "relative",
            canUpload ? "cursor-pointer" : "",
            className || ""
          )}
          onClick={handleAvatarClick}
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
			  key={displayUrl}
              src={displayUrl}
              alt={`${username}'s avatar`}
              onError={() => setHasImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Upload overlay - only show when canUpload is true */}
          {canUpload && (
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "w-full h-full rounded-full bg-transparent flex items-center justify-center text-[oklch(0.1 0 0)] font-bold text-sm shadow group-hover:shadow-lg group-hover:shadow-[oklch(0.85 0.05 85)]/40 transition-all duration-500 border border-[oklch(0.6 0.05 85)]",
            canUpload ? "cursor-pointer" : "",
            className
          )}
          onClick={handleAvatarClick}
        >
          {firstLetter}
        </div>
      )}

      {/* Hidden file input */}
      {canUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
        />
      )}

      {/* Status indicator */}
      {status && status !== "offline" && (
        <div
          className={`absolute -bottom-1 -right-1 w-3 h-3 ${currentStatus.color} ${currentStatus.glow} rounded-full border-2 border-background z-10`}
        />
      )}
    </div>
  );
};
