import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Initialize ZegoCloud with your App ID and App Sign
const initVideoCall = async (roomId, userId, userName, containerElement) => {
  try {
    // Get your App ID and App Sign from ZegoCloud Console
    const appID = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID); // Add this to your .env file
    const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET; // Add this to your .env file

    if (!appID || !serverSecret) {
      throw new Error('ZegoCloud App ID and Server Secret are required');
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId.toString(),
      userId,
      userName
    );

    // Create instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    if (!zp) {
      throw new Error('Failed to create ZegoUIKitPrebuilt instance');
    }

    // Join room with config for interview
    zp.joinRoom({
      container: containerElement,
      maxUsers: 2, // Limit to 2 users for interview
      sharedLinks: [
        {
          name: 'Copy Interview Link',
          url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // Better for interviews
      },
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showMyCameraFloatingWindow: true,
      layout: {
        mode: ZegoUIKitPrebuilt.VideoRound, // Round video layout
      },
      onLeaveRoom: () => {
        console.log('User left the interview room');
        // Handle post-call actions here
      },
      onUserJoin: (user) => {
        console.log(`${user.userName} joined the interview`);
      },
      onUserLeave: (user) => {
        console.log(`${user.userName} left the interview`);
      },
      onUserMicrophoneStateChanged: (user, state) => {
        console.log(`${user.userName}'s microphone is ${state ? 'on' : 'off'}`);
      },
      onUserCameraStateChanged: (user, state) => {
        console.log(`${user.userName}'s camera is ${state ? 'on' : 'off'}`);
      }
    });

    return zp;
  } catch (error) {
    console.error('Error initializing ZegoCloud video call:', error);
    throw error;
  }
};

export { initVideoCall };