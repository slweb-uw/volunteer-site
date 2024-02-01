import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import { firebaseClient } from './firebaseClient';

const AuthContext = createContext<{
  user: firebaseClient.User | null;
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
  const [user, setUser] = useState<firebaseClient.User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [leads, setLeads] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      const adminsSnapshot = await firebaseClient.firestore().collection('Admins').get();
      const adminsData: any = adminsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      adminsData.sort((a: any, b: any) => (a.email > b.email ? 1 : -1));
      setAdmins(adminsData);

      const volunteersSnapshot = await firebaseClient.firestore().collection('Volunteers').get();
      const authorizedUsersData: any = volunteersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAuthorizedUsers(authorizedUsersData);

      const leadSnapshot = await firebaseClient.firestore().collection('Leads').get();
      const leadData: any = leadSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLeads(leadData);

      const user = firebaseClient.auth().currentUser;
      if (!user) {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorized(false);
        nookies.set(undefined, 'token', '', {});
        return;
      }

      const isRoleExpired = (timestamp: firebaseClient.firestore.Timestamp) => {
        // Convert Firestore Timestamp to JavaScript Date
        const creationDate = timestamp.toDate();
    
        // Calculate the expiry timestamp (two years from creation)
        const expiryDate = new Date(creationDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    
        // Check if the current time is after the expiry timestamp
        return Date.now() > expiryDate.getTime();
      };

      const adminCheck = adminsData.find((admin: any) => admin.email === user.email);
      setIsAdmin(!!adminCheck);

      const leadCheck = leadData.find((lead: any) => 
        lead.email === user.email && lead.timestamp && !isRoleExpired(lead.timestamp));
      setIsLead(!!leadCheck);
      
      const authorizedCheck = authorizedUsersData.some((authUser: any) => 
        authUser.email === user.email && authUser.timestamp && !isRoleExpired(authUser.timestamp)
      ) || (user.email && user.email.endsWith("@uw.edu"));
      setIsAuthorized(authorizedCheck || isAdmin);
      const token = await user.getIdToken();
      setUser(user);
      nookies.set(undefined, 'token', token, {});
    };

    const unsubscribe = firebaseClient.auth().onIdTokenChanged(() => {
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
