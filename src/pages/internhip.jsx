import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInternships } from '@/api/apiInternships';
import { getCompanies } from '@/api/apiCompanies';
import { useUser, useSession } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import JobCard from '@/components/ui/job-card'; // Reusing job card for internships
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Internhip = () => {
  const navigate = useNavigate();
  const [searchquery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [Company_id, setCompany_id] = useState('');
  const { user, isLoaded } = useUser()
  const { session } = useSession()
  
  // State for internships and loading
  const [internships, setInternships] = useState([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [internshipsError, setInternshipsError] = useState(null);
  
  // State for companies and loading
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState(null);
  
  // Function to fetch internships with current filters
  const fetchInternships = async () => {
    if (!isLoaded || !session) return;
    
    try {
      setLoadingInternships(true);
      setInternshipsError(null);
      
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });
      
      const options = {
        location,
        Company_id,
        searchquery,
      };
      
      console.log('Fetching internships with options:', options);
      
      const response = await getInternships(supabaseAccessToken, options);
      console.log('Internships response:', response);
      console.log('Number of internships returned:', response?.length || 0);
      setInternships(response || []);
    } catch (error) {
      setInternshipsError(error);
      console.error('Error fetching internships:', error);
    } finally {
      setLoadingInternships(false);
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
      fetchInternships();
    }
  }, [isLoaded, session, location, Company_id, searchquery]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Call fetchInternships to refresh with current state values
    fetchInternships();
  };

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
        <h1 className="text-2xl font-bold">Find Your Dream Internship</h1>
        <p className="text-gray-600">Search from thousands of internship opportunities</p>
      </div>
      {!isLoaded || !session ? (
        <div>Please sign in to view internships</div>
      ) : (
        <>
          <form
            onSubmit={handleSearch}
            className="h-14 flex flex-row w-full gap-2 items-center mb-3"
          >
            <Input
              type="text"
              placeholder="Search Internships by Title.."
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

          {loadingInternships && (
            <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
          )}

          {!loadingInternships && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              {internships?.length ? (
                internships.map((internship) => {
                  return (
                    <JobCard
                      key={internship.id}
                      job={internship} // Using 'job' prop name to reuse the same component
                      savedInit={internship?.saved?.length > 0}
                    />
                  );
                })
              ) : (
                <div>No Internships Found 😢</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Internhip;