import {describe,it,expect,vi,beforeEach} from 'vitest';
import {render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext';
import App from '../App';
vi.mock('../lib/api',()=>({
 api:vi.fn(),API_ROOT:'http://localhost:5000/api',ApiError:class ApiError extends Error{}
}));
import {api} from '../lib/api';
function mount(page='/'){return render(<MemoryRouter initialEntries={[page]}><AuthProvider><App/></AuthProvider></MemoryRouter>);}
beforeEach(()=>{vi.resetAllMocks();api.mockImplementation(async path=>path==='/gigs'?[]:{});});
describe('HustleHubPlus components and navigation',()=>{
 it('renders marketplace headline and loading completes',async()=>{mount('/');expect(screen.getByRole('heading',{name:/big ideas need/i})).toBeInTheDocument();expect(await screen.findByText('No services listed yet')).toBeInTheDocument();});
 it('filters marketplace results interactively',async()=>{api.mockResolvedValueOnce([{_id:'1',title:'Website Design',description:'Responsive and custom business websites',category:'Technology',price:500,freelancer:{name:'Nomsa'}},{_id:'2',title:'Logo Designer',description:'Creative professional brand identities',category:'Design',price:200,freelancer:{name:'James'}}]);mount('/');expect(await screen.findByText('Website Design')).toBeInTheDocument();await userEvent.type(screen.getByRole('textbox',{name:/search gigs/i}),'Logo');expect(screen.queryByText('Website Design')).not.toBeInTheDocument();expect(screen.getByText('Logo Designer')).toBeInTheDocument();});
 it('redirects guests from protected studio',()=>{mount('/dashboard');expect(screen.getByText('Sign in to continue')).toBeInTheDocument();});
 it('shows account role choice in registration screen',()=>{mount('/register');expect(screen.getByRole('heading',{name:/join the hustle/i})).toBeInTheDocument();expect(screen.getByText(/A freelancer — I offer services/i)).toBeInTheDocument();});
 it('renders login form and required inputs',()=>{mount('/login');expect(screen.getByRole('heading',{name:/good to see you/i})).toBeInTheDocument();expect(screen.getByRole('button',{name:/log in/i})).toBeInTheDocument();});
});
/* Reference List:
Testing Library. s.a. React Testing Library. [online] Available at: https://testing-library.com/docs/react-testing-library/intro/ [Accessed 12 October 2026].
*/
