import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '@/api/apiJobs';
import { getCompanies } from '@/api/apiCompanies';
import { useUser, useSession } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import JobCard from '@/components/ui/job-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Joblisting = () => {
  const [searchquery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [Company_id, setCompany_id] = useState('');
  const { user, isLoaded } = useUser()
  const { session } = useSession()
  // State for jobs and loading
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState(null);
  
  // State for companies and loading
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState(null);
  
  // Function to fetch jobs with current filters
  const fetchJobs = async () => {
    if (!isLoaded || !session) return;
    
    try {
      setLoadingJobs(true);
      setJobsError(null);
      
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });
      
      const options = {
        location,
        Company_id,
        searchquery,
      };
      
      console.log('Fetching jobs with options:', options);
      
      const response = await getJobs(supabaseAccessToken, options);
      console.log('Jobs response:', response);
      setJobs(response || []);
    } catch (error) {
      setJobsError(error);
      console.error('Error fetching jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };
  
  // Function to fetch companies
  const fetchCompanies = async () => {
    if (!isLoaded || !session) return;
    
    try {
      setLoadingCompanies(true);
      setCompaniesError(null);
      
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });
      
      console.log('Fetching companies');
      
      const response = await getCompanies(supabaseAccessToken);
      console.log('Companies response:', response);
      setCompanies(response || []);
    } catch (error) {
      setCompaniesError(error);
      console.error('Error fetching companies:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };
  
  // Debug effect to track state changes
  useEffect(() => {
    console.log('Location changed:', location);
  }, [location]);
  
  useEffect(() => {
    console.log('Company_id changed:', Company_id);
  }, [Company_id]);
  
  useEffect(() => {
    console.log('Searchquery changed:', searchquery);
  }, [searchquery]);
  


  useEffect(() => {
    if (isLoaded && session) {
      fetchCompanies();
    }
  }, [isLoaded, session]);

  useEffect(() => {
    if (isLoaded && session) {
      fetchJobs();
    }
  }, [isLoaded, session, location, Company_id, searchquery]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Call fetchJobs to refresh with current state values
    fetchJobs();
  };


  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="container mx-auto p-4">
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Find Your Dream Job</h1>
        <p className="text-gray-600">Search from thousands of job listings</p>
      </div>
      {!isLoaded || !session ? (
        <div>Please sign in to view job listings</div>
      ) : (
        <>
          <form
            onSubmit={handleSearch}
            className="h-14 flex flex-row w-full gap-2 items-center mb-3"
          >
            <Input
              type="text"
              placeholder="Search Jobs by Title.."
              name="search-query"
              className="h-full flex-1  px-4 text-md"
              value={searchquery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Location.."
              name="location"
              className="h-full flex-1  px-4 text-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <select
              className="h-full flex-1  px-4 text-md border border-gray-300 rounded-md"
              value={Company_id}
              onChange={(e) => setCompany_id(e.target.value)}
              disabled={!companies}
            >
              <option value="">All Companies</option>
              {companies?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <Button type="submit" className="h-full sm:w-28" variant="blue">
              Search
            </Button>
          </form>

          {loadingJobs && (
            <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
          )}

          {!loadingJobs && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              {jobs?.length ? (
                jobs.map((job) => {
                  return (
                    <JobCard
                      key={job.id}
                      job={job}
                      savedInit={job?.saved?.length > 0}
                    />
                  );
                })
              ) : (
                <div>No Jobs Found 😢</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Joblisting;