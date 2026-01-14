import { useUser } from "@clerk/clerk-react";
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import { MapPinIcon, Briefcase, DoorOpen, DoorClosed } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { getSingleJob, updateHiringStatus } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ApplyJobDrawer } from '@/components/ui/apply-job';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const JobPage = () => {
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const [job, loadingJob, error, fnJob] = useFetch(getSingleJob, {
    job_Id: id, // Fixed parameter name to match the API function
  });

  const [, loadingHiringStatus, , fnHiringStatus] = useFetch(updateHiringStatus, 
   {
    job_Id: id, // Fixed parameter name to match the API function
   }
  );

    const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus({job_Id: id, isOpen: isOpen}).then(() => fnJob());
  };



  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded, id]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error loading job details: {error.message || 'Unknown error'}</div>;
  }

  if (!job) {
    return <div className="text-center mt-10">Job not found</div>;
  }

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex">
        <Button 
          onClick={handleGoBack}
          variant="ghost"
          size="sm"
          style={{
            padding: '0.25rem',
            minWidth: '30px',
            height: '30px',
            color: '#6b7280',
            backgroundColor: 'transparent',
            fontSize: '0.875rem',
            borderRadius: '0.25rem',
            border: 'none'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ←
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <img src={job?.company?.logo_url} className="w-full h-full object-contain" alt={job?.company?.name || job?.title} />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length || 0} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>
      
            {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}


      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      {job?.requirements && (
        <MDEditor.Markdown
          source={job?.requirements}
          className="bg-transparent sm:text-lg"
        />
      )}
      {job?.recruiter_id !== user?.id && (
        <div>
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
          />
        </div>
      )}
      </div>
  );
};

export default JobPage;