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
        // Fetch the user's custom claims from the JWT. Reassigned from the
        // refreshed token below so the checks at the end read post-reconcile
        // claims rather than the ones that triggered reconcile in the first
        // place. role is 'admin' | 'lead' | 'volunteer' | undefined (aka student)
        let claims = (await user.getIdTokenResult()).claims;

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

  // A user who verifies in their mail client comes back to a tab still holding
  // the token it was issued before verification -- email_verified lives inside
  // the JWT, so clicking the link does nothing to invalidate it. Re-check on
  // focus and force a fresh token, which trips onIdTokenChanged above and
  // re-runs reconcile now that the server will accept it.
  useEffect(() => {
    const refreshIfNowVerified = async () => {
      const user = getAuth().currentUser;
      if (!user || user.emailVerified) return;

      try {
        await user.reload();
        if (user.emailVerified) {
          await user.getIdToken(true);
        }
      } catch (error) {
        console.error("Error refreshing verification status:", error);
      }
    };

    window.addEventListener("focus", refreshIfNowVerified);

    return () => {
      window.removeEventListener("focus", refreshIfNowVerified);
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
