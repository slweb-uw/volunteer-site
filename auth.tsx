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
        // fetch user custom claim integrated within JWT token
        const authToken = await user.getIdTokenResult();
        let role = authToken.claims.role; // 'admin' || 'lead' || 'volunteer' || undefined (aka student)

        // no role on the token yet — check if one was pre-assigned by email
        // before this account existed, and apply it if so
        if (authToken.claims.authorized === undefined) {
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
              const freshToken = await user.getIdTokenResult(true);
              role = freshToken.claims.role;
            }
          } catch (error) {
            console.error("Error reconciling role:", error);
          }
        }

        if (role === "admin") {
          setIsAdmin(true);
          setIsAuthorized(true);
        } else if (role === "lead") {
          setIsLead(true);
          setIsAuthorized(true);
        } else if (role === "volunteer") {
          setIsAuthorized(true);
        } else if (user.email?.toLowerCase().endsWith("@uw.edu")) {
          setIsAuthorized(true);
        } else {
          // non-uw account that isn't authorized
          setIsAuthorized(false);
        }

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
