export const API_ROOT=(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/,'');
export class ApiError extends Error {constructor(message,status,errors){super(message);this.name='ApiError';this.status=status;this.errors=errors||[];}}
// (MDN Web Docs, s.a.) Reject non-success HTTP statuses and parse structured errors.
export async function api(path,{token,method='GET',body,signal}={}){
  let response;
  try{response=await fetch(`${API_ROOT}${path}`,{method,signal,headers:{...(body!==undefined?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});}
  catch(error){throw new ApiError('Cannot connect to the API. Check that the backend and MongoDB are running.',0);}
  let data={};
  try{data=await response.json();}catch(_error){}
  if(!response.ok)throw new ApiError(data.message||`Request failed (${response.status})`,response.status,data.errors);
  return data;
}
/* Reference List:
MDN Web Docs. s.a. Using the Fetch API. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch [Accessed 12 October 2026].
*/
