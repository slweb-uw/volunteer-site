import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import { db } from 'firebaseClient';
import { getDocs, collection} from 'firebase/firestore';
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
      const adminsSnapshot = await getDocs(collection(db,'Admins'));
      const adminsData: any = adminsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      adminsData.sort((a: any, b: any) => (a.email > b.email ? 1 : -1));
      setAdmins(adminsData);
      const volunteersSnapshot = await getDocs(collection(db,'Volunteers'));
      const authorizedUsersData: any = volunteersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAuthorizedUsers(authorizedUsersData);
      const leadSnapshot = await getDocs(collection(db,'Volunteers'));
      const leadData: any = leadSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLeads(leadData);

      const user = getAuth().currentUser
      if (!user) {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorized(false);
        nookies.set(undefined, 'token', '', {});
        return;
      }

      const adminCheck = adminsData.find((admin: any) => admin.email === user.email);
      setIsAdmin(!!adminCheck);

      const leadCheck = leadData.find((lead: any) => lead.email === user.email);
      setIsLead(!!leadCheck);
      
      const authorizedCheck = authorizedUsersData.some((authUser: any) => authUser.email === user.email) || (user.email && user.email.endsWith("@uw.edu"));
      setIsAuthorized(authorizedCheck || isAdmin);
      const token = await user.getIdToken();
      setUser(user);
      nookies.set(undefined, 'token', token, {});
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
