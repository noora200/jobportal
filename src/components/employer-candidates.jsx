import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/use-fetch';
import { getMyJobs } from '@/api/apiJobs';
import { getApplicationsForRecruiterJobs } from '@/api/apiApplications';

const EmployerCandidates = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch recruiter's jobs
  const [jobs, loadingJobs, errorJobs, fetchJobs] = useFetch(getMyJobs);
  
  // Fetch applications for recruiter's jobs
  const [applications, loadingApplications, errorApplications, fetchApplications] = useFetch(getApplicationsForRecruiterJobs);

  useEffect(() => {
    if (user && user.id) {
      console.log('Fetching jobs and applications for user:', user.id);
      fetchJobs({ recruiter_id: user.id });
      fetchApplications({ recruiter_id: user.id });
    }
  }, [user]);

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

  // Set the first job as selected when jobs are loaded
  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  if (!isLoaded || loadingJobs || loadingApplications) {
    return <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: '#cbd5e1' }}>Loading...</p>
    </div>;
  }

  if (errorJobs || errorApplications) {
    return <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: '#cbd5e1' }}>Error loading data</p>
    </div>;
  }

  const handleStatusChange = (applicationId, newStatus) => {
    console.log(`Changing status for application ${applicationId} to ${newStatus}`);
    alert(`Status updated to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return { bg: '#1e3a8a', text: '#bfdbfe' };
      case 'Interview Scheduled':
        return { bg: '#1e40af', text: '#c7d2fe' };
      case 'Rejected':
        return { bg: '#7f1d1d', text: '#fecaca' };
      case 'Interview':
        return { bg: '#ca8a04', text: '#fef9c3' };
      case 'Interview Completed':
        return { bg: '#16a34a', text: '#dcfce7' };
      case 'Offer':
        return { bg: '#166534', text: '#bbf7d0' };
      default:
        return { bg: '#334155', text: '#cbd5e1' };
    }
  };

  const handleStartVideoCall = (applicant) => {
    const callData = {
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      companyName: selectedJob.company?.name || selectedJob.company,
      applicantName: applicant.candidate?.first_name + ' ' + applicant.candidate?.last_name,
      applicantId: applicant.candidate_id,
      recruiterId: user.id,
      recruiterName: user.fullName || "Current Recruiter",
      role: "recruiter"
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
          Candidate Applications
        </h1>
        
        {/* Job Selection */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          borderRadius: '0.5rem', 
          padding: '1.5rem', 
          border: '1px solid #334155',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>
            Select Job Posting
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {jobs?.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: selectedJob?.id === job.id ? '#2563eb' : '#334155',
                  color: selectedJob?.id === job.id ? '#f1f5f9' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedJob?.id !== job.id) {
                    e.target.style.backgroundColor = '#475569';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedJob?.id !== job.id) {
                    e.target.style.backgroundColor = '#334155';
                  }
                }}
              >
                {job.title} ({groupedApplications[job.id]?.length || 0} applicants)
              </button>
            ))}
          </div>
        </div>
        
        {!selectedJob ? (
          <div style={{ 
            backgroundColor: '#1e293b', 
            borderRadius: '0.5rem', 
            padding: '2rem', 
            border: '1px solid #334155',
            textAlign: 'center'
          }}>
            <p style={{ color: '#94a3b8' }}>Please select a job to view candidates</p>
          </div>
        ) : (
          /* Candidates List */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#f1f5f9', fontSize: '1.125rem', fontWeight: '500' }}>
                Candidates for {selectedJob.title}
              </h2>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                {groupedApplications[selectedJob.id]?.length || 0} applicants
              </span>
            </div>
            
            {(groupedApplications[selectedJob.id]?.length || 0) === 0 ? (
              <div style={{ 
                backgroundColor: '#1e293b', 
                borderRadius: '0.5rem', 
                padding: '2rem', 
                border: '1px solid #334155',
                textAlign: 'center'
              }}>
                <p style={{ color: '#94a3b8' }}>No candidates have applied for this position yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {groupedApplications[selectedJob.id]?.map((application) => {
                  const applicant = application.candidate;
                  const statusStyle = getStatusColor(application.status);
                  
                  return (
                    <div 
                      key={application.id} 
                      style={{ 
                        backgroundColor: '#1e293b', 
                        borderRadius: '0.5rem', 
                        padding: '1.5rem', 
                        border: '1px solid #334155',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#475569'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#334155'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ color: '#f1f5f9', fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                              {applicant?.first_name} {applicant?.last_name}
                            </h3>
                            <span style={{ 
                              backgroundColor: statusStyle.bg, 
                              color: statusStyle.text, 
                              fontSize: '0.75rem', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '9999px'
                            }}>
                              {application.status}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            <div>
                              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                Email
                              </p>
                              <a 
                                href={`mailto:${applicant?.email}`} 
                                style={{ color: '#60a5fa', fontSize: '1rem', textDecoration: 'underline' }}
                              >
                                {applicant?.email}
                              </a>
                            </div>
                            
                            <div>
                              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                Applied Date
                              </p>
                              <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>
                                {new Date(application.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <Button 
                            onClick={() => handleStatusChange(application.id, 'Shortlisted')}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#1e3a8a',
                              color: '#bfdbfe',
                              fontSize: '0.875rem',
                              border: 'none',
                              borderRadius: '0.25rem'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
                          >
                            Shortlist
                          </Button>
                          <Button 
                            onClick={() => handleStatusChange(application.id, 'Interview')}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#ca8a04',
                              color: '#fef9c3',
                              fontSize: '0.875rem',
                              border: 'none',
                              borderRadius: '0.25rem'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#eab308'}
                          >
                            Schedule Interview
                          </Button>
                          <Button 
                            onClick={() => handleStartVideoCall(application)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#16a34a',
                              color: '#f1f5f9',
                              fontSize: '0.875rem',
                              border: 'none',
                              borderRadius: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                          >
                            <Phone size={16} />
                            Start Video Call
                          </Button>
                          <Button 
                            onClick={() => handleStatusChange(application.id, 'Rejected')}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#7f1d1d',
                              color: '#fecaca',
                              fontSize: '0.875rem',
                              border: 'none',
                              borderRadius: '0.25rem'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerCandidates;