import { useSession } from "next-auth/react";

export default function UserAvatar() {
  const { data: session, status } = useSession();

  if (!session?.user?.image) return null;

  return (
    <div>
      <img className="w-10 h-10 border-2 border-dashed hover:border-solid hover:scale-110 border-pastel-purple object-contain rounded-full transition-all duration-500" src={session.user.image ?? ''} alt="User Avatar" />
    </div>
  );
}
