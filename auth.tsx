import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import { db } from 'firebaseClient';
import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { getAuth, onIdTokenChanged, User } from 'firebase/auth';
import { auth } from "firebaseClient"

const AuthContext = createContext<{
  user: User | null;
  isAdmin: boolean;
  isAuthorized: boolean;
  admins: any;
  leads: any;
  isLead: boolean;
}>({
  user: null,
  isAdmin: false,
  isAuthorized: false,
  admins: null,
  leads: null,
  isLead: false
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [leads, setLeads] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;
      
      if (!user) {
        setUser(null);
        setIsAdmin(false);
        setIsLead(false);
        setIsAuthorized(false);
        nookies.set(undefined, 'token', '', {});
        return;
      }

      try {
        // Check if Admin
        const adminQuery = query(collection(db, 'Admins'), where('email', '==', user.email), limit(1));
        const adminSnapshot = await getDocs(adminQuery);
        const userIsAdmin = !adminSnapshot.empty;
        setIsAdmin(userIsAdmin);

        // Check if Lead
        const leadQuery = query(collection(db, 'Leads'), where('email', '==', user.email), limit(1));
        const leadSnapshot = await getDocs(leadQuery);
        const userIsLead = !leadSnapshot.empty;
        setIsLead(userIsLead);

        // Check if Authorized
        let userIsAuthorized = userIsAdmin || (user.email && user.email.endsWith("@uw.edu"));
        
        // Only query the Volunteers collection if they aren't already authorized
        if (!userIsAuthorized) {
          const volunteerQuery = query(collection(db, 'Volunteers'), where('email', '==', user.email), limit(1));
          const volunteerSnapshot = await getDocs(volunteerQuery);
          userIsAuthorized = !volunteerSnapshot.empty;
        }
        setIsAuthorized(userIsAuthorized);

        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, 'token', token, {});
        
      } catch (error) {
        console.error("Error fetching user roles:", error);
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
    <AuthContext.Provider value={{ user, isAdmin, isAuthorized, admins, leads, isLead }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
