import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserAvatar() {
  const { data: session, status } = useSession();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Only run this effect when the session is loaded and user is logged in
    if (status === "authenticated" && session?.user?.email) {
      // Check if user exists in the database
      const checkAndCreateUser = async () => {
        try {
          // First, check if the user already exists
          const response = await fetch(
            `/api/users?email=${encodeURIComponent(session.user?.email ?? '')}`
          );
          const data = await response.json();

          // If user doesn't exist, create a new user
          if (!data.success) {
            setIsNewUser(true);

            // Create new user with session data
            const createResponse = await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: session.user?.email ?? "",
                username: session.user?.name || "",
                image: session.user?.image || "",
              }),
            });

            const createResult = await createResponse.json();
            console.log("User creation result:", createResult);

            if (createResult.success) {
              setIsNewUser(false);
            }
          }
        } catch (error) {
          console.error("Error checking/creating user:", error);
        }
      };

      checkAndCreateUser();
    }
  }, [session, status]);

  if (!session?.user?.image) return null;

  return (
    <Link href="/dashboard">
      <Image 
  width={40}
  height={40}
  className={`border-2 border-dashed hover:border-solid hover:scale-110 ${
    isNewUser ? "border-green-400" : "border-pastel-purple"
  } object-contain rounded-full transition-all duration-500`}
  src={session.user.image ?? "/default-avatar.png"}
  alt="User Avatar"
  onError={() => console.log("Image failed to load:", session.user?.image)}
/>
    </Link>
  );
}
