import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Phone, CheckCircle } from 'lucide-react';
import { useUser, useSession } from '@clerk/clerk-react';
import { getApplications } from '@/api/apiApplications';

const Myjobs = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isLoaded && user && session) {
      fetchApplications();
    }
  }, [isLoaded, user, session]);
  
  const fetchApplications = async () => {
    if (!session || !user) return;
    
    try {
      setLoading(true);
      const token = await session.getToken({ template: 'supabase' });
      
      // Fetch applications for the current user
      const applications = await getApplications(token, { user_id: user.id });
      
      if (applications) {
        // Transform the application data to match the expected format
        const transformedJobs = applications.map(app => ({
          id: app.job_id,
          title: app.job?.title || 'N/A',
          company: app.job?.company?.name || 'N/A',
          location: 'N/A',
          salary: 'N/A',
          type: 'N/A',
          status: app.status,
          appliedDate: app.created_at || new Date().toISOString(),
          description: app.job?.description || ''
        }));
        
        setAppliedJobs(transformedJobs);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Set empty array on error
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return { bg: '#1e3a8a', text: '#bfdbfe' }; // Blue
      case 'Interview':
        return { bg: '#ca8a04', text: '#fef9c3' }; // Yellow
      case 'Interview Completed':
        return { bg: '#16a34a', text: '#dcfce7' }; // Green
      case 'Rejected':
        return { bg: '#b91c1c', text: '#fecaca' }; // Red
      case 'Offer':
        return { bg: '#166534', text: '#bbf7d0' }; // Green
      default:
        return { bg: '#334155', text: '#cbd5e1' }; // Gray
    }
  };


  const groupJobsByStatus = (jobs) => {
    return jobs.reduce((groups, job) => {
      const status = job.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(job);
      return groups;
    }, {});
  };

  const handleViewDetails = (job) => {
    navigate('/job-details', { state: { job } });
  };

  if (loading) {
    return <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: '#cbd5e1' }}>Loading applications...</p>
    </div>;
  }

  const handleJoinVideoCall = (job) => {
    
    const callData = {
      jobId: job.id,
      jobTitle: job.title,
      companyName: typeof job.company === 'object' ? job.company.name : job.company,
      applicantName: user?.fullName || "Current User",
      applicantId: user?.id || "candidate-1",
      recruiterId: "recruiter-" + job.id,
      recruiterName: "Recruiter Name",
      role: "applicant"
    };
    
    navigate('/video-call-room', { state: { callData } });
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button 
            onClick={handleGoBack}
            variant="ghost"
            size="sm"
            style={{
              padding: '0.25rem',
              minWidth: '30px',
              height: '30px',
              color: '#cbd5e1',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              borderRadius: '0.25rem',
              border: 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ←
          </Button>
        </div>
        <h1 style={{ color: '#cbd5e1', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
          My Job Applications
        </h1>
        
        {appliedJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            <p>You haven't applied to any jobs yet.</p>
            <Button 
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: '#f1f5f9',
                fontSize: '0.875rem',
                border: 'none',
                borderRadius: '0.25rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            >
              Browse Jobs
            </Button>
          </div>
        ) : (
          <>
            {/* Summary Section */}
            <div style={{ 
              backgroundColor: '#1e293b', 
              borderRadius: '0.5rem', 
              padding: '1rem', 
              border: '1px solid #334155',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#f1f5f9', fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' }}>
                Application Summary
              </h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#1e3a8a' 
                  }}></span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Applied: {appliedJobs.filter(job => job.status === 'Applied').length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ca8a04' 
                  }}></span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Interview: {appliedJobs.filter(job => job.status === 'Interview' || job.status === 'Interview Completed').length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#166534' 
                  }}></span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Offers: {appliedJobs.filter(job => job.status === 'Offer').length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#b91c1c' 
                  }}></span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Rejected: {appliedJobs.filter(job => job.status === 'Rejected').length}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Grouped by Status */}
            {Object.entries(groupJobsByStatus(appliedJobs)).map(([status, jobs]) => (
              <div key={status} style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  color: '#f1f5f9', 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #334155'
                }}>
                  {status} ({jobs.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      style={{ 
                        backgroundColor: '#1e293b', 
                        borderRadius: '0.5rem', 
                        padding: '0.75rem', 
                        border: '1px solid #334155',
                        display: 'flex',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#475569'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#334155'}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h3 style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: '500', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {job.title}
                          </h3>
                          <span style={{ 
                            backgroundColor: '#1e3a8a', 
                            color: '#bfdbfe', 
                            fontSize: '0.75rem', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.25rem',
                            whiteSpace: 'nowrap'
                          }}>
                            {job.salary}
                          </span>
                        </div>
                        
                        <p style={{ color: '#cbd5e1', fontSize: '0.75rem', margin: '0.25rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {typeof job.company === 'object' ? job.company.name : job.company}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {job.location}
                          </span>
                          <span style={{ 
                            color: '#94a3b8', 
                            fontSize: '0.75rem', 
                            backgroundColor: '#334155', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.25rem',
                            whiteSpace: 'nowrap'
                          }}>
                            {job.type}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                          <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            Applied on: {new Date(job.appliedDate).toLocaleDateString()}
                          </p>
                          <span style={{ 
                            backgroundColor: getStatusColor(job.status).bg,
                            color: getStatusColor(job.status).text,
                            fontSize: '0.75rem', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.25rem',
                            whiteSpace: 'nowrap'
                          }}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '0.75rem', justifyContent: 'center' }}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(job)}
                          style={{ 
                            height: '1.5rem', 
                            fontSize: '0.75rem', 
                            padding: '0 0.5rem',
                            border: '1px solid #475569',
                            color: '#cbd5e1',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinVideoCall(job)}
                          style={{ 
                            height: '1.5rem', 
                            fontSize: '0.75rem', 
                            padding: '0 0.5rem',
                            backgroundColor: '#16a34a',
                            color: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                        >
                          <Phone size={12} />
                          Join Interview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Myjobs;