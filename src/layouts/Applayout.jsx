import Header from "@/components/ui/Header";
import { Outlet } from "react-router-dom";

const Applayout = () => {
  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--background))' }}>
      <div className="grid-background"></div>
      <div className="relative z-10">
       <main className="min-h-screen container">
        <Header/>
       <Outlet />
       </main>
      </div>
      <div className="footer-gray p-0 text-center text-gray-800 dark:text-gray-200 relative z-20">
        made with .....
      </div>
    </div>
  );
};

export default Applayout;
