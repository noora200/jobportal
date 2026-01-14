import { useNavigate, useLocation } from 'react-router-dom';
import VideoCall from '@/components/ui/video-call';

const VideoCallRoom = () => {
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
    role: "applicant" // or "recruiter"
  };

  const handleEndCall = () => {
  
    navigate('/Myjobs');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div>
      <div style={{ padding: '1rem', backgroundColor: '#0f172a' }}>
        <div>
          <button 
            onClick={handleGoBack}
            style={{
              padding: '0.25rem',
              minWidth: '30px',
              height: '30px',
              color: '#cbd5e1',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              border: 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ←
          </button>
        </div>
      </div>
      <VideoCall 
        onEndCall={handleEndCall}
        callerName={callData.role === 'applicant' ? callData.applicantName : callData.recruiterName}
        calleeName={callData.role === 'applicant' ? callData.recruiterName : callData.applicantName}
        callData={callData}
      />
    </div>
  );
};

export default VideoCallRoom;