import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    try {
      await user.update({
        unsafeMetadata: { role },
      });
      navigate(role === "recruiter" ? "/Postjob" : "/Joblisting");
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role && window.location.pathname !== "/onboarding") {
      navigate(
        user?.unsafeMetadata.role === "recruiter" ? "/Postjob" : "/Joblisting");
    }
  }, [user, navigate]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width="100" color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <h2 className="gradient-title font-extrabold text-[100px] sm:text-[130px] md:text-[160px] lg:text-[190px] xl:text-[220px] 2xl:text-[250px] tracking-tight text-center">
        I am a...
      </h2>

      <div className="mt-16 flex gap-6 w-full max-w-2xl justify-center">
        <Button 
          variant="default" 
          style={{ 
            marginRight: '12px', 
            borderRadius: '50px', 
            backgroundColor: '#003366', 
            border: 'none', 
            color: 'white' 
          }} 
          className="h-[100px] w-[300px] text-[20px] rounded-xl flex items-center justify-center text-white" 
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>

        <Button 
          variant="default" 
          style={{
            borderRadius: '50px', 
            backgroundColor: '#990000', 
            border: 'none', 
            color: 'white' 
          }} 
          className="h-[100px] w-[300px] text-[20px] rounded-xl flex items-center justify-center text-white"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;