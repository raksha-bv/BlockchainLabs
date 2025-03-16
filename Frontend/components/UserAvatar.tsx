import { auth } from "../auth";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <img className="w-10 h-10 object-contain rounded-full" src={session.user.image ?? ''} alt="User Avatar" />
    </div>
  );
}
