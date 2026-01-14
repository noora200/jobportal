import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PhoneOff } from 'lucide-react';
import { initVideoCall } from '@/api/zegoCloud';

const VideoCall = ({ onEndCall, callerName, calleeName, callData }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const zegoInstanceRef = useRef(null);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, active, ended
  
  useEffect(() => {
    // Initialize ZegoCloud video call
    const initializeZegoCall = async () => {
      try {
        // Use job ID or create a unique room ID
        const roomId = callData.jobId || Date.now();
        const userId = callData.role === 'applicant' ? callData.applicantId : callData.recruiterId;
        const userName = callData.role === 'applicant' ? callData.applicantName : callData.recruiterName;
        
        // Initialize the video call
        zegoInstanceRef.current = await initVideoCall(
          roomId,
          userId,
          userName,
          videoRef.current
        );
        
        setCallStatus('active');
      } catch (error) {
        console.error('Failed to initialize video call:', error);
        setCallStatus('error');
      }
    };
    
    if (callData) {
      initializeZegoCall();
    }
    
    // Cleanup on unmount
    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy();
      }
    };
  }, [callData]);
  
  const endCall = () => {
    setCallStatus('ended');
    
    // Destroy ZegoCloud instance
    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.destroy();
    }
    
    // Prepare data for the ended page
    const endedCallData = {
      ...callData,
      duration: 'Duration will be calculated by ZegoCloud',
    };
    
    // Navigate to the video call ended page
    navigate('/video-call-ended', { state: { callData: endedCallData } });
  };

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Call header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#1e293b',
          borderRadius: '0.5rem'
        }}>
          <div>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: '500' }}>
              {callStatus === 'connecting' ? 'Connecting...' : 
               callStatus === 'error' ? 'Connection Error' : 'Video Interview'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              {callerName} ↔ {calleeName}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              color: callStatus === 'active' ? '#16a34a' : 
                    callStatus === 'error' ? '#dc2626' : '#94a3b8',
              fontSize: '0.875rem'
            }}>
              {callStatus === 'connecting' ? 'Connecting...' : 
               callStatus === 'error' ? 'Error connecting' : 
               callStatus === 'active' ? 'Connected' : 'Call Ended'}
            </span>
          </div>
        </div>

        {/* ZegoCloud Video Call Container */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          borderRadius: '0.5rem', 
          overflow: 'hidden',
          border: '1px solid #334155',
          marginBottom: '1rem',
          height: '70vh',
          position: 'relative'
        }}>
          <div 
            ref={videoRef}
            style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
            {callStatus === 'connecting' && (
              <div style={{ textAlign: 'center' }}>
                <p>Setting up video call...</p>
              </div>
            )}
            {callStatus === 'error' && (
              <div style={{ textAlign: 'center' }}>
                <p>Failed to connect to video call</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Please check your configuration</p>
              </div>
            )}
          </div>
        </div>

        {/* Call controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#1e293b',
          borderRadius: '0.5rem'
        }}>
          <Button 
            onClick={endCall}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              color: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none'
            }}
          >
            <PhoneOff size={20} />
          </Button>
        </div>

        {/* Call info */}
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#1e293b',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {callStatus === 'connecting' 
              ? 'Establishing secure connection...' 
              : callStatus === 'error' 
                ? 'Connection failed. Please try again.'
                : callStatus === 'active' 
                  ? 'Interview in progress...'
                  : 'Call has ended.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;