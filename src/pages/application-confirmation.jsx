import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ApplicationConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const job = location.state?.job || {
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$90k",
    type: "Full-time"
  };

  const handleViewApplications = () => {
    navigate('/my-applications');
  };

  const handleBrowseMoreJobs = () => {
    navigate('/Joblisting');
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
        <div style={{ 
          backgroundColor: '#1e293b', 
          borderRadius: '0.5rem', 
          padding: '2rem', 
          border: '1px solid #334155',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '2rem auto'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: '#166534', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Application Submitted!
          </h1>
          
          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Your application for <strong>{job.title}</strong> at <strong>{typeof job.company === 'object' ? job.company.name : job.company}</strong> has been successfully submitted.
          </p>
          
          <div style={{ 
            backgroundColor: '#334155', 
            borderRadius: '0.5rem', 
            padding: '1rem', 
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' }}>
             Details
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Position:</span>
              <span style={{ color: '#f1f5f9' }}>{job.title}</span>
              
              <span style={{ color: '#94a3b8' }}>Company:</span>
              <span style={{ color: '#f1f5f9' }}>{typeof job.company === 'object' ? job.company.name : job.company}</span>
              
              <span style={{ color: '#94a3b8' }}>Location:</span>
              <span style={{ color: '#f1f5f9' }}>{job.location}</span>
              
              <span style={{ color: '#94a3b8' }}>Salary:</span>
              <span style={{ color: '#f1f5f9' }}>{job.salary}</span>
              
              <span style={{ color: '#94a3b8' }}>Type:</span>
              <span style={{ color: '#f1f5f9' }}>{job.type}</span>
            </div>
          </div>
          
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>
            The employer will review your application and contact you if there's a match.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button 
              onClick={handleViewApplications}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: '#f1f5f9',
                fontSize: '0.875rem',
                border: 'none',
                borderRadius: '0.25rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            >
              View My Applications
            </Button>
            
            <Button 
              onClick={handleBrowseMoreJobs}
              variant="outline"
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #475569',
                color: '#cbd5e1',
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                borderRadius: '0.25rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Browse More Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationConfirmation;