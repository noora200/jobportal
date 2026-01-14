import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// - Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  console.log('getApplications called with user_id:', user_id);
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  console.log('Applications query result:', { data, error });
  
  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}

// Get applications for a recruiter's jobs
export async function getApplicationsForRecruiterJobs(token, options) {
  const recruiter_id = options.recruiter_id;
  console.log('getApplicationsForRecruiterJobs called with recruiter_id:', recruiter_id);
  const supabase = await supabaseClient(token);
  
  // First get the recruiter's job IDs
  const { data: jobIds, error: jobError } = await supabase
    .from('jobs')
    .select('id')
    .eq('recruiter_id', recruiter_id);
  
  if (jobError) {
    console.error('Error fetching job IDs:', jobError);
    return null;
  }
  
  if (!jobIds || jobIds.length === 0) {
    return [];
  }
  
  // Then get applications for those jobs
  const { data, error } = await supabase
    .from('applications')
    .select(`
      applications.*, 
      job:jobs(title, company:companies(name)), 
      candidate:user_details(first_name, last_name, email)
    `)
    .in('job_id', jobIds.map(job => job.id))
    .order('applications.created_at', { ascending: false });

  console.log('Applications for recruiter jobs query result:', { data, error });
  
  if (error) {
    console.error("Error fetching Applications for recruiter jobs:", error);
    return null;
  }

  return data;
}
