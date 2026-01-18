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
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .in('job_id', jobIds.map(job => job.id))
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching Applications for recruiter jobs:", error);
    return null;
  }
  
  // Get unique candidate IDs to fetch details
  const uniqueCandidateIds = [...new Set(applications.map(app => app.candidate_id))];
  
  // Fetch candidate details
  const { data: candidates, error: candidatesError } = await supabase
    .from('user_details')
    .select('id, first_name, last_name, email')
    .in('id', uniqueCandidateIds);
  
  if (candidatesError) {
    console.error("Error fetching candidate details:", candidatesError);
    return applications; // Return applications without candidate details
  }
  
  // Map candidate details to applications
  const applicationsWithCandidates = applications.map(app => {
    const candidate = candidates.find(c => c.id === app.candidate_id);
    return {
      ...app,
      candidate
    };
  });
  
  // Get job details for each application
  const applicationsWithJobs = [];
  for (const app of applicationsWithCandidates) {
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('title, company:companies(name)')
      .eq('id', app.job_id)
      .single();
      
    if (!jobError) {
      applicationsWithJobs.push({
        ...app,
        job
      });
    } else {
      applicationsWithJobs.push(app); // Push without job details if error
    }
  }
  
  const data = applicationsWithJobs;

  console.log('Applications for recruiter jobs query result:', { data, error });
  
  if (error) {
    console.error("Error fetching Applications for recruiter jobs:", error);
    return null;
  }

  return data;
}
