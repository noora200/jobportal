import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle } from 'lucide-react';

const JobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
 
  const job = location.state?.job || {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$90k",
    type: "Full-time",
    status: "Applied",
    appliedDate: "2023-05-15",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for developing user-facing features using React, JavaScript, and CSS."
  };

  const handleBackToMyApplications = () => {
    navigate('/my-applications');
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

  const statusStyle = getStatusColor(job.status);

  const handleJoinVideoCall = () => {
      
    const callData = {
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company,
      applicantName: "Current User", 
      applicantId: "applicant-1",
      recruiterName: "Recruiter Name", 
      recruiterId: "recruiter-" + job.id,
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
        <Button 
          onClick={handleBackToMyApplications}
          variant="outline"
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            border: '1px solid #475569',
            color: '#cbd5e1',
            backgroundColor: 'transparent',
            fontSize: '0.875rem',
            borderRadius: '0.25rem'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ← Back to My Applications
        </Button>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          borderRadius: '0.5rem', 
          padding: '2rem', 
          border: '1px solid #334155',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                {job.title}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '1.125rem', margin: '0 0 1rem 0' }}>
                {typeof job.company === 'object' ? job.company.name : job.company}
              </p>
            </div>
            
            <span style={{ 
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              fontSize: '0.875rem', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.25rem',
              whiteSpace: 'nowrap',
              fontWeight: '500'
            }}>
              {job.status}
            </span>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Location
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {job.location}
              </p>
            </div>
            
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Salary
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {job.salary}
              </p>
            </div>
            
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Job Type
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {job.type}
              </p>
            </div>
            
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Applied Date
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {new Date(job.appliedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem' }}>
              Job Description
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              {job.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {job.status === 'Interview' && (
              <Button 
                onClick={handleJoinVideoCall}
                style={{
                  padding: '0.75rem 1.5rem',
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
                Join Video Interview
              </Button>
            )}
            {job.status === 'Interview Completed' && (
              <Button 
                disabled
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#166534',
                  color: '#dcfce7',
                  fontSize: '0.875rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: 0.8
                }}
              >
                <CheckCircle size={16} />
                Interview Completed
              </Button>
            )}
            
            <Button 
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
              Follow Up
            </Button>
            
            <Button 
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
              Withdraw Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;