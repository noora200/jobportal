import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, Company_id, searchquery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (Company_id) {
    query = query.eq("company_id", Company_id);
  }

  if (searchquery) {
    query = query.ilike("title", `%${searchquery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  
  // Join saved_jobs with jobs table to get job details
  const { data, error } = await supabase
    .from('saved_jobs')
    .select(`
      id,
      created_at,
      jobs!inner(*, company: companies(name,logo_url))
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved jobs:', error);
    return [];
  }

  // Transform the data to match the expected structure
  return data.map(item => ({
    ...item.jobs,
    savedDate: item.created_at
  }));
}

export async function removeSavedJob(token, jobId) {
  const supabase = await supabaseClient(token);
  
  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('job_id', jobId);

  if (error) {
    console.error('Error removing saved job:', error);
    // If the job wasn't saved, don't throw an error
    if (error.code === 'PGRST116') { // Row not found error in PostgREST
      console.warn('Job was not saved, continuing...');
      return true;
    }
    throw error;
  }

  return true;
}

export async function saveJob(token, jobId) {
  const supabase = await supabaseClient(token);
  
  // First check if the job is already saved to avoid constraint violations
  const { data: existing, error: checkError } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('job_id', jobId)
    .limit(1);
  
  if (checkError) {
    console.error('Error checking existing saved job:', checkError);
    throw checkError;
  }
  
  // If already saved, just return true
  if (existing && existing.length > 0) {
    console.warn('Job already saved, continuing...');
    return true;
  }
  
  const { error } = await supabase
    .from('saved_jobs')
    .insert([{ job_id: jobId }]);

  if (error) {
    console.error('Error saving job:', error);
    // Check if the error is due to a duplicate entry or constraint violation
    if (error.code === '23505' || error.code === '23514') { // Unique violation or check constraint error
      console.warn('Job already saved, continuing...');
      return true;
    }
    throw error;
  }

  return true;
}


export async function saveJobs(token, { alreadySaved }, savedata) {
  const supabase = await supabaseClient(token);

 if (alreadySaved) {
  const { data, error:deleteerror } = await supabase
    .from('saved_jobs')
    .delete()
    .eq({ job_id: savedata.job_id });
 
 if (deleteerror) {
    console.error("Error Deleting Saved Job:", deleteerror);
    return null;
  }
  return data;
}else{
  const { data, error:insertError } = await supabase
    .from('saved_jobs')
    .insert(savedata)
    .select({ job_id: savedata.job_id });
    
      if (insertError) {
        console.error("Error Inserting Saved Job:", insertError);
        return null;
      }
      return data;
 }
}

export async function getSingleJob(token,{job_Id}) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("jobs").select("*,company: companies(name,logo_url), applications: applications(*)"
  )
  .eq("id", job_Id)
  .single();
  
  if (error) {
    console.error("Error Fetching job:", error);
    return null;
  }
  return data;
}

export async function updateHiringStatus(token,{job_Id},isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
  .from("jobs")
  .update({isOpen})
  .eq("id", job_Id)
  .select()
  
  if (error) {
    console.error("Error Updating job:", error);
    return null;
  }
  return data;
}


export async function addNewJob(token,_, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
  .from("jobs")
  .insert([jobData])
  .select()
  
  if (error) {
    console.error("Error Creating ob:", error);
    return null;
  }
  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}