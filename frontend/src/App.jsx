import {Routes,Route} from 'react-router-dom';
import {Layout,Protected} from './components/Layout';
import {AuthPage} from './pages/AuthPages';
import {Marketplace} from './pages/Marketplace';
import {Studio} from './pages/Studio';
import {Bookings} from './pages/Bookings';
import {Admin} from './pages/Admin';
export default function App(){return <Layout><Routes><Route path="/" element={<Marketplace/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route path="/dashboard" element={<Protected roles={['Freelancer']}><Studio/></Protected>}/><Route path="/bookings" element={<Protected roles={['Client','Freelancer']}><Bookings/></Protected>}/><Route path="/admin" element={<Protected roles={['Admin']}><Admin/></Protected>}/><Route path="*" element={<div className="container protected-message"><h1>Page not found</h1><p>The page you requested does not exist.</p><a href="/">Return to marketplace</a></div>}/></Routes></Layout>}
