import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useUser } from '@clerk/clerk-react';

const CreatedApplications = () => {
  const { user, isLoaded } = useUser();

  const [applications, loadingApplications, errorApplications, fnApplications] = useFetch(getApplications);

  // Fetch applications when component mounts or user data changes
  useEffect(() => {
    if (isLoaded && user && user.id) {
      console.log('Fetching applications for user:', user.id);
      fnApplications({ user_id: user.id });
    } else {
      console.log('User not loaded or missing user id');
    }
  }, [isLoaded, user]);

  if (!isLoaded || loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  
  if (errorApplications) {
    return <div>Error loading applications: {errorApplications.message}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.length > 0 ? (
        applications.map((application) => {
          return (
            <ApplicationCard
              key={application.id}
              application={application}
              isCandidate={true}
            />
          );
        })
      ) : (
        <div>No applications found. Start applying to jobs!</div>
      )}
    </div>
  );
};

export default CreatedApplications;