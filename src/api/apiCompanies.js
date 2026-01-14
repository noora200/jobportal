import supabaseClient from "@/utils/supabase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error Fetching companies:", error);
    return null;
  }
  return data
}

export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);
  
  // Handle form data or regular object
  let companyInfo;
  if (companyData instanceof FormData) {
    // If it's FormData (for file upload)
    const name = companyData.get('name');
    const logoFile = companyData.get('logo');
    
    companyInfo = { name };
    
    // If there's a logo file, upload it to Supabase storage
    if (logoFile && logoFile.size > 0) {
      // Upload logo to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(`${Date.now()}-${logoFile.name}`, logoFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
      } else {
        // Get the public URL of the uploaded logo
        const { data: publicData } = supabase.storage
          .from('company-logos')
          .getPublicUrl(uploadData.path);
          
        companyInfo.logo_url = publicData.publicUrl;
      }
    }
  } else {
    // If it's a regular object
    companyInfo = companyData;
  }
  
  const { data, error } = await supabase
    .from('companies')
    .insert([companyInfo])
    .select();
    
  if (error) {
    console.error('Error adding company:', error);
    return null;
  }
  
  return data;
}