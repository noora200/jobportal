import { getMyJobs } from "@/api/apiJobs";
import { getApplicationsForRecruiterJobs } from "@/api/apiApplications";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import JobCard from "./ui/job-card";
import { useEffect, useState } from "react";
import { useUser } from '@clerk/clerk-react';

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();

  const [createdJobs, loadingCreatedJobs, errorCreatedJobs, fnCreatedJobs] = useFetch(getMyJobs);
  const [applications, loadingApplications, errorApplications, fnApplications] = useFetch(getApplicationsForRecruiterJobs);

  useEffect(() => {
    if (user && user.id) {
      console.log('CreatedJobs - user.id:', user.id);
      fnCreatedJobs({ recruiter_id: user.id });
      fnApplications({ recruiter_id: user.id });
    } else {
      console.log('CreatedJobs - user not loaded or no user id');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user || !isLoaded) {
    return <div>Loading...</div>;
  }

  if (errorCreatedJobs) {
    return <div>Error loading jobs: {errorCreatedJobs.message}</div>;
  }

  if (errorApplications) {
    return <div>Error loading applications: {errorApplications.message}</div>;
  }

  // Group applications by job
  const groupedApplications = {};
  if (applications) {
    applications.forEach(app => {
      const jobId = app.job_id;
      if (!groupedApplications[jobId]) {
        groupedApplications[jobId] = [];
      }
      groupedApplications[jobId].push(app);
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Jobs & Candidates</h1>
      
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              const jobApplications = groupedApplications[job.id] || [];
              return (
                <div key={job.id} className="border rounded-lg p-4 bg-white">
                  <JobCard
                    job={job}
                    onJobAction={fnCreatedJobs}
                    isMyJob
                  />
                  <div className="mt-3">
                    <h3 className="font-semibold">Candidates ({jobApplications.length}):</h3>
                    {jobApplications.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {jobApplications.slice(0, 3).map((app, idx) => (
                          <li key={idx} className="text-sm">
                            {app.candidate?.first_name} {app.candidate?.last_name} - {app.status}
                          </li>
                        ))}
                        {jobApplications.length > 3 && (
                          <li className="text-sm text-gray-500">+{jobApplications.length - 3} more</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No candidates yet</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
      
      {loadingApplications && applications === undefined && (
        <div className="mt-4">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
