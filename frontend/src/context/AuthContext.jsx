import {createContext,useContext,useState} from 'react';
import {api} from '../lib/api';
const AuthContext=createContext(null);
const STORAGE_KEY='hustlehubplus-session';
function readSession(){try{const item=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null');return item?.user&&item?.token?item:null;}catch{return null;}}
export function AuthProvider({children}){
  const [session,setSession]=useState(readSession);
  function save(data){sessionStorage.setItem(STORAGE_KEY,JSON.stringify(data));setSession(data);}
  async function login(email,password){const result=await api('/auth/login',{method:'POST',body:{email,password}});save(result);return result;}
  async function register(values){const result=await api('/auth/register',{method:'POST',body:values});save(result);return result;}
  function logout(){sessionStorage.removeItem(STORAGE_KEY);setSession(null);}
  return <AuthContext.Provider value={{user:session?.user||null,token:session?.token||null,login,register,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){return useContext(AuthContext);}
/* Reference List:
React. s.a. useContext. [online] Available at: https://react.dev/reference/react/useContext [Accessed 12 October 2026].
*/
