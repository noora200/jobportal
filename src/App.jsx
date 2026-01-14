import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Applayout from './layouts/Applayout.jsx';
import Landingpage from './pages/Landingpage.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Joblisting from './pages/job-listing.jsx';
import MyJobsApplications from './pages/my-jobs.jsx';
import Postjob from './pages/Post-job.jsx';
import Savedjob from './pages/Saved-job.jsx';
import Job from './pages/Job.jsx';
import Internhip from './pages/Internhip.jsx';
import CreatedJobs from './components/created-jobs.jsx';
import ApplicationConfirmation from './pages/application-confirmation.jsx';
import JobDetails from './pages/job-details.jsx';
import VideoCallRoom from './pages/video-call-room.jsx';
import VideoCallEnded from './pages/video-call-ended.jsx';
import { ThemeProvider } from './components/ui/theme-provider.jsx';
import ProtectedRoute from './components/ui/protected-route';

const router = createBrowserRouter([
  {
    element: <Applayout />,   // Layout wrapper
    children: [
      {
        path: "/",
        element: <Landingpage />
      },
      {
        path: "/onboarding",
        element: <Onboarding/>
      },
      {
        path: "/Joblisting",
        element: <ProtectedRoute><Joblisting/></ProtectedRoute>
      },
      {
        path: "/Myjobs",
        element: <ProtectedRoute> <CreatedJobs/></ProtectedRoute>
      },
      {
        path: "/Postjob",
        element: <ProtectedRoute> <Postjob/></ProtectedRoute>
      },
      {
        path: "/my-applications",
        element: <ProtectedRoute> <MyJobsApplications/></ProtectedRoute>
      },
      {
        path: "/Savedjob",
        element: <ProtectedRoute> <Savedjob/></ProtectedRoute>
      },
      {
        path: "/job",
        element: <ProtectedRoute> <Joblisting/></ProtectedRoute> 
      },
      {
        path: "/job/:id",
        element: <ProtectedRoute> <Job/></ProtectedRoute> 
      },
      {
        path: "/Internhip",
        element:<ProtectedRoute><Internhip/> </ProtectedRoute> 
      },
      {
        path: "/application-confirmation",
        element: <ProtectedRoute><ApplicationConfirmation/></ProtectedRoute>
      },
      {
        path: "/job-details",
        element: <ProtectedRoute><JobDetails/></ProtectedRoute>
      },
      {
        path: "/video-call-room",
        element: <ProtectedRoute><VideoCallRoom/></ProtectedRoute>
      },
      {
        path: "/video-call-ended",
        element: <ProtectedRoute><VideoCallEnded/></ProtectedRoute>
      }
    ]
  }
]);

function App() {
  return (<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
    
}

export default App;