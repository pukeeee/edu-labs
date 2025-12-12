import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
};

export function UserAvatar({
  name,
  avatar,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback className="bg-[#BD93F9] text-[#282A36]">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
