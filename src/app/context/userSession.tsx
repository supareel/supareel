import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { createContext, useContext } from "react";
import { LOGIN } from "~/utils/route_names";

interface IUserSession {
  status: "authenticated" | "loading";
  session: Session | null;
}

const UserSessionContext = createContext<IUserSession>({
  session: null,
  status: "loading",
});

// Create a custom hook to use the state and dispatch
export const useUserSession = () => {
  const contextValue = useContext(UserSessionContext);
  if (!contextValue) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return contextValue;
};

export function UserSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(LOGIN);
    },
  });
  return (
    <UserSessionContext.Provider
      value={{
        status,
        session,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
}
