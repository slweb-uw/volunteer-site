import React, { useState, useEffect, useContext, createContext } from "react";
import nookies from "nookies";
import { getAuth, onIdTokenChanged, User } from "firebase/auth";
import { auth } from "firebaseClient";

const AuthContext = createContext<{
  user: User | null;
  isAdmin: boolean;
  isAuthorized: boolean;
  admins: any;
  leads: any;
  isLead: boolean;
  isLoading: boolean;
}>({
  user: null,
  isAdmin: false,
  isAuthorized: false,
  admins: null,
  leads: null,
  isLead: false,
  isLoading: true,
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [leads, setLeads] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;

      // on sign-out, store values back to false
      setUser(null);
      setIsAdmin(false);
      setIsLead(false);
      setIsAuthorized(false);

      if (!user) {
        nookies.set(undefined, "token", "", {});
        setIsLoading(false);
        return;
      }

      try {
 // Read claims now and refresh them after role reconciliation.
        let claims = (await user.getIdTokenResult()).claims;

        // Keep the account signed in so it can resend/check verification,
        // but do not grant access yet.
        if (!user.emailVerified || claims.email_verified !== true) {
          setUser(user);
          nookies.set(undefined, "token", "", {});
          return;
        }

        // no role on the token yet — check if one was pre-assigned by email
        // before this account existed, and apply it if so
        if (claims.authorized === undefined) {
          try {
            const idToken = await user.getIdToken();
            const res = await fetch("/api/reconcile-role", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
            });
            if (res.ok) {
              claims = (await user.getIdTokenResult(true)).claims;
            }
          } catch (error) {
            console.error("Error reconciling role:", error);
          }
        }

        // `authorized` is set server-side alongside every role, so holding one
        // already implies access -- the role only decides which staff powers
        // apply on top of it.
        setIsAdmin(claims.role === "admin");
        setIsLead(claims.role === "lead");
        setIsAuthorized(claims.authorized === true);

        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, "token", token, {});
      } catch (error) {
        console.error("Error fetching user roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onIdTokenChanged(auth, () => {
      fetchData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isAuthorized, admins, leads, isLead, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
