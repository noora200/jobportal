import supabaseClient from "@/utils/supabase";

export async function getInternships(token, { location, Company_id, searchquery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("internships") // Make sure you have an internships table in Supabase
    .select("*");

  if (location) {
    query = query.ilike("location", `%${location}%`); // Using ilike for partial/case-insensitive matching
  }

  if (Company_id) {
    query = query.eq("company_id", Company_id);
  }

  if (searchquery) {
    query = query.ilike("title", `%${searchquery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Internships:", error);
    return null;
  }

  // Fetch company details for each internship separately to avoid complex joins
  const internshipsWithCompanies = await Promise.all(data.map(async (internship) => {
    if (internship.company_id) {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('name, logo_url')
        .eq('id', internship.company_id)
        .single();
        
      if (companyError) {
        console.error('Error fetching company for internship:', companyError);
      }
      
      return {
        ...internship,
        company: companyData || null
      };
    }
    
    return {
      ...internship,
      company: null
    };
  }));
  
  // Fetch saved status for each internship separately
  const internshipsWithSavedStatus = await Promise.all(internshipsWithCompanies.map(async (internship) => {
    if (token) {
      const { data: savedData, error: savedError } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', internship.id);
        
      if (savedError) {
        console.error('Error fetching saved status for internship:', savedError);
      }
        
      return {
        ...internship,
        saved: savedData || []
      };
    }
      
    return {
      ...internship,
      saved: []
    };
  }));
  
  return internshipsWithSavedStatus;
}

export async function getSavedInternships(token) {
  const supabase = await supabaseClient(token);
  
  // Join saved_jobs with internships table to get internship details
  const { data, error } = await supabase
    .from('saved_jobs')
    .select(`
      id,
      created_at,
      internships!inner(*, company: companies(name,logo_url))
    `)
    .order('created_at', { referencedTable: 'saved_jobs', ascending: false });

  if (error) {
    console.error('Error fetching saved internships:', error);
    return [];
  }

  // Transform the data to match the expected structure
  return data.map(item => ({
    ...item.internships,
    savedDate: item.created_at
  }));
}

export async function removeSavedInternship(token, internshipId) {
  const supabase = await supabaseClient(token);
  
  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('job_id', internshipId);

  if (error) {
    console.error('Error removing saved internship:', error);
    // If the internship wasn't saved, don't throw an error
    if (error.code === 'PGRST116') { // Row not found error in PostgREST
      console.warn('Internship was not saved, continuing...');
      return true;
    }
    throw error;
  }

  return true;
}

export async function getInternshipById(token, internshipId) {
  const supabase = await supabaseClient(token);
  
  const { data, error } = await supabase
    .from('internships')
    .select('*, company: companies(name, logo_url)')
    .eq('id', internshipId)
    .single();
  
  if (error) {
    console.error('Error fetching internship by ID:', error);
    throw error;
  }
  
  return data;
}

export async function saveInternship(token, internshipId) {
  const supabase = await supabaseClient(token);
  
  // First check if the internship is already saved to avoid constraint violations
  const { data: existing, error: checkError } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('job_id', internshipId) // Using job_id column for both jobs and internships
    .limit(1);
  
  if (checkError) {
    console.error('Error checking existing saved internship:', checkError);
    throw checkError;
  }
  
  // If already saved, just return true
  if (existing && existing.length > 0) {
    console.warn('Internship already saved, continuing...');
    return true;
  }
  
  const { error } = await supabase
    .from('saved_jobs')
    .insert([{ job_id: internshipId }]); // Using job_id column for both jobs and internships

  if (error) {
    console.error('Error saving internship:', error);
    // Check if the error is due to a duplicate entry or constraint violation
    if (error.code === '23505' || error.code === '23514') { // Unique violation or check constraint error
      console.warn('Internship already saved, continuing...');
      return true;
    }
    throw error;
  }

  return true;
}