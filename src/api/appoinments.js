import supabaseClient from "@/utils/supabase";

// Function to create a new appointment/interview
export async function createAppointment(token, appointmentData) {
  const supabase = await supabaseClient(token);
  
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      job_id: appointmentData.jobId,
      applicant_id: appointmentData.applicantId,
      recruiter_id: appointmentData.recruiterId,
      scheduled_time: appointmentData.scheduledTime,
      duration: appointmentData.duration,
      status: 'scheduled',
      zegocloud_room_id: appointmentData.zegocloudRoomId || null
    }])
    .select();
  
  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
  
  return data[0];
}

// Function to get appointments for a user
export async function getAppointments(token, userId, userType = 'applicant') {
  const supabase = await supabaseClient(token);
  
  let query = supabase.from('appointments').select(`
    *,
    jobs(title, company: companies(name))
  `);
  
  if (userType === 'applicant') {
    query = query.eq('applicant_id', userId);
  } else {
    query = query.eq('recruiter_id', userId);
  }
  
  const { data, error } = await query.order('scheduled_time', { ascending: false });
  
  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
  
  return data;
}

// Function to update appointment status
export async function updateAppointmentStatus(token, appointmentId, status) {
  const supabase = await supabaseClient(token);
  
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select();
  
  if (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
  
  return data[0];
}

// Function to get appointment by ID
export async function getAppointmentById(token, appointmentId) {
  const supabase = await supabaseClient(token);
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single();
  
  if (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
  
  return data;
}