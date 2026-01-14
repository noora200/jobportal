import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, RotateCcw, Home, Briefcase } from 'lucide-react';

const VideoCallEnded = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
 
  const callData = location.state?.callData || {
    jobId: 1,
    jobTitle: "Frontend Developer",
    companyName: "TechCorp",
    applicantName: "Alex Johnson",
    applicantId: "applicant-1",
    recruiterName: "Sarah Miller",
    recruiterId: "recruiter-1",
    role: "applicant",
    duration: "45 minutes"
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleViewJobs = () => {
    navigate('/Joblisting');
  };

  const handleViewApplications = () => {
   
    navigate('/Myjobs');
  };

  const handleScheduleAnother = () => {
    
    alert('Interview scheduling feature would open here');
  };


  const updateJobStatusToInterviewCompleted = () => {
 
    console.log(`Would update job ${callData.jobId} status to Interview Completed`);
  };

 
  updateJobStatusToInterviewCompleted();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '1rem'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        width: '100%',
        textAlign: 'center'
      }}>
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
        {/* Success Icon */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#16a34a', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <CheckCircle size={48} color="#f1f5f9" />
        </div>
        
        {/* Main Heading */}
        <h1 style={{ 
          color: '#f1f5f9', 
          fontSize: '2rem', 
          fontWeight: '600', 
          marginBottom: '0.5rem' 
        }}>
          Interview Completed
        </h1>
        
        {/* Subtitle */}
        <p style={{ 
          color: '#cbd5e1', 
          fontSize: '1.125rem', 
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Your video interview for <strong>{callData.jobTitle}</strong> at <strong>{callData.companyName}</strong> has ended.
        </p>
        
        {/* Call Summary Card */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          borderRadius: '0.5rem', 
          padding: '1.5rem', 
          border: '1px solid #334155',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h2 style={{ 
            color: '#f1f5f9', 
            fontSize: '1.25rem', 
            fontWeight: '500', 
            marginBottom: '1rem' 
          }}>
            Interview Summary
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Position
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {callData.jobTitle}
              </p>
            </div>
            
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Company
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {callData.companyName}
              </p>
            </div>
            
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Duration
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {callData.duration || '45 minutes'}
              </p>
            </div>
            
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Interviewer
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '1rem' }}>
                {callData.role === 'applicant' ? callData.recruiterName : callData.applicantName}
              </p>
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#334155', 
            borderRadius: '0.5rem', 
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Next Steps
            </p>
            <p style={{ color: '#f1f5f9', lineHeight: '1.5' }}>
              The interviewer will review your interview and contact you with next steps. 
              You can check the status of your application in your job applications dashboard.
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <Button 
            onClick={handleViewApplications}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#f1f5f9',
              fontSize: '0.875rem',
              border: 'none',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          >
            <Briefcase size={16} />
            View Applications
          </Button>
          
          <Button 
            onClick={handleViewJobs}
            variant="outline"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #475569',
              color: '#cbd5e1',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <RotateCcw size={16} />
            Browse More Jobs
          </Button>
          
          <Button 
            onClick={handleGoToHome}
            variant="outline"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #475569',
              color: '#cbd5e1',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Home size={16} />
            Home
          </Button>
        </div>
        
        {/* Feedback Section */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          borderRadius: '0.5rem', 
          padding: '1.5rem', 
          border: '1px solid #334155'
        }}>
          <h3 style={{ 
            color: '#f1f5f9', 
            fontSize: '1.125rem', 
            fontWeight: '500', 
            marginBottom: '1rem' 
          }}>
            How was your interview experience?
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Your feedback helps us improve the interview process.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  borderRadius: '50%',
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#475569'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#334155'}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallEnded;