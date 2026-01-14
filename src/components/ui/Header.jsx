import {Link, useLocation} from "react-router-dom";
import { Button } from "./button";
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox, Users } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  console.log("Header - location:", location);
  console.log("Header - showSignIn:", showSignIn);

  useEffect(() => {
   
    const params = new URLSearchParams(location.search);
    console.log("Header useEffect - params:", params.toString());
    if (params.get('sign-in') === 'true') {
      console.log("Header useEffect - Setting showSignIn to true");
      setShowSignIn(true);
    }
  }, [location]);

  return (
    <>
      <nav className="py-4 flex justify-between items-center" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}> 
        <Link to="/">
        {/* <img src="/logo.png" className="!h-20 w-auto" alt="Logo" style={{ height: '80px' }} /> */}
        <img src="/logo3.png" className="!h-20 w-auto" alt="Logo" style={{ height: '80px' }} />
        </Link>

       
        <div className="flex gap-8px">
        <SignedOut>
          <Button variant="outline" onClick={() => setShowSignIn(true)}style={{ marginRight: '12px', borderRadius: '5px',backgroundColor: '#001a33', color: 'white'}}>
            Login
          </Button>     
           <SignInButton mode="modal">
            <Button variant="default" style={{ borderRadius: '5px' ,backgroundColor: '#001a33', color: 'white',border: 'none'}}>
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
         
        <SignedIn> 
          {/* Only show navigation links if user has selected a role */}
          {user?.unsafeMetadata?.role ? (
            <>
              {user?.unsafeMetadata?.role === "recruiter" ? (
                <>
                  <Link to="/Postjob" style={{ marginRight: '16px', textDecoration: 'none' }}>
                    <Button style={{backgroundColor: '#990000', color: 'white', borderRadius: '50px', padding: '10px 20px', display: 'flex', alignItems: 'center', border: 'none'}}>
                      <PenBox size={24} style={{color: '#ffffff', marginRight: '8px'}}/> Post a Job
                    </Button>
                  </Link>
                  <Link to="/Myjobs" style={{ marginRight: '16px', textDecoration: 'none' }}>
                    <Button style={{backgroundColor: '#0066cc', color: 'white', borderRadius: '50px', padding: '10px 20px', display: 'flex', alignItems: 'center', border: 'none'}}>
                      <Users size={24} style={{color: '#ffffff', marginRight: '8px'}}/> Manage Jobs & Candidates
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/Joblisting" style={{ marginRight: '16px', textDecoration: 'none' }}>
                    <Button style={{backgroundColor: '#003366', color: 'white', borderRadius: '50px', padding: '10px 20px', display: 'flex', alignItems: 'center', border: 'none'}}>
                      <BriefcaseBusiness size={24} style={{color: '#ffffff', marginRight: '8px'}}/> Find Jobs
                    </Button>
                  </Link>
                  <Link to="/Internhip" style={{ marginRight: '16px', textDecoration: 'none' }}>
                    <Button style={{backgroundColor: '#ff9933', color: 'white', borderRadius: '50px', padding: '10px 20px', display: 'flex', alignItems: 'center', border: 'none'}}>
                      <BriefcaseBusiness size={24} style={{color: '#ffffff', marginRight: '8px'}}/> Internships
                    </Button>
                  </Link>
                  <Link to="/my-applications" style={{ marginRight: '16px', textDecoration: 'none' }}>
                    <Button style={{backgroundColor: '#334155', color: 'white', borderRadius: '50px', padding: '10px 20px', display: 'flex', alignItems: 'center', border: 'none'}}>
                      <BriefcaseBusiness size={24} style={{color: '#ffffff', marginRight: '8px'}}/> My Applications
                    </Button>
                  </Link>
                  <Link to="/Savedjob" style={{ marginRight: '16px', textDecoration: 'none' }}>
                    <Button style={{backgroundColor: '#334155', color: 'white', borderRadius: '50px', padding: '10px 20px', display: 'flex', alignItems: 'center', border: 'none'}}>
                      <Heart size={24} style={{color: '#ffffff', marginRight: '8px'}}/> Saved Jobs
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            // If user hasn't selected a role yet, show a link to onboarding
            <Link to="/onboarding" style={{ textDecoration: 'none' }}>
              <Button style={{backgroundColor: '#334155', color: 'white', borderRadius: '50px', padding: '10px 20px', display: 'flex', alignItems: 'center', border: 'none'}}>
                Select Role
              </Button>
            </Link>
          )}
          
          <UserButton appearance={{
            elements:{
              avatarBox: {
                width: '50px',
                height: '50px'
              }
            }
          }}>
            <UserButton.MenuItems>
              <UserButton.Link
                label="My Applications"
                labelIcon={<BriefcaseBusiness size={15} />}
                href="/my-applications"
              />
              <UserButton.Link
                label="Saved Jobs"
                labelIcon={<Heart size={15} />}
                href="/Savedjob"
              />
            </UserButton.MenuItems>
          </UserButton>

        </SignedIn>
        </div>
     </nav>
     {showSignIn && (
       <div 
         className="fixed top-0 left-0 w-full h-full bg-black/80 z-[9999]"
         style={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'center',
           position: 'fixed',
           inset: 0
         }}
         onClick={() => setShowSignIn(false)}
       >
         <div style={{ margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
           <SignIn 
             signUpForceRedirectUrl="/onboarding"
             fallbackRedirectUrl="/onboarding"
             appearance={{
               elements: {
                 rootBox: "mx-auto"
               }
             }}
           /> 
         </div>
       </div>
     )}
    </>
  )
}

export default Header;