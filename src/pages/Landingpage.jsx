import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const Landingpage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold tracking-tighter pb-0" style={{fontSize: 'clamp(2.0rem, 7vw, 10rem)'}}>Find Your Dream Job <span>and get hirred</span></h1>
        <p className="text-gray-300" style={{fontSize: 'clamp(1rem, 1.5vw, 2rem)', marginTop: 'clamp(-1.5rem, -8vw, -2rem)',color:'#959aa1'}}>Explore thousands of job listings or find the perfect candidate</p>
      </section>
        <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', marginBottom: '40px'}}> 
          <Link to='/Joblisting'>
           <Button style={{backgroundColor: '#003366', color: 'white', borderRadius: '5px', outline: 'none', border: 'none', padding: '14px 28px', fontSize: '18px'}} className="hover:opacity-90 focus:outline-none">Find Jobs</Button>
          </Link>

    

          <Link to='/Internhip'>
           <Button style={{backgroundColor: '#ff9933', color: 'white', borderRadius: '5px', outline: 'none', border: 'none', padding: '14px 28px', fontSize: '18px'}} className="hover:opacity-90 focus:outline-none">Find Internships</Button>
          </Link>

          <Link to='/Postjob'>
           <Button style={{backgroundColor: '#990000', color: 'white', borderRadius: '5px', outline: 'none', border: 'none', padding: '14px 28px', fontSize: '18px'}} className="hover:opacity-90 focus:outline-none">Post Jobs</Button>
          </Link>
        </div>  
        <img src="/banner (1).jpeg" className='w-full'/>
        <section>
        </section>
  </main>
);
};

export default Landingpage;