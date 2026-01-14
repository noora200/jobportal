/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from "@/components/ui/button";
// Replacing drawer with a simple modal implementation
// Import for modal functionality if needed
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) => {
        console.log('File validation:', file);
        if (!file) return false;
        const fileObj = file[0] || file;
        console.log('File type:', fileObj?.type);
        console.log('File name:', fileObj?.name);
        
        if (!fileObj) return false;
        
        // Check by MIME type
        const validMimeTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        
        if (validMimeTypes.includes(fileObj.type)) {
          return true;
        }
        
        // Check by file extension as fallback
        if (fileObj.name) {
          const lowerName = fileObj.name.toLowerCase();
          return lowerName.endsWith('.pdf') || 
                 lowerName.endsWith('.doc') || 
                 lowerName.endsWith('.docx');
        }
        
        return false;
      },
      { message: "Only PDF or Word documents are allowed" }
    ),
});

export function ApplyJobDrawer({ user, job, fetchJob, applied: initialApplied = false }) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [localApplied, setLocalApplied] = useState(initialApplied);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [dataApply, loadingApply, errorApply, fnApply] = useFetch(applyToJob);

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    console.log('Job ID:', job?.id);
    console.log('User:', user);
    
    try {
      // Handle file differently depending on how it's stored in the form
      let resumeFile;
      if (data.resume && data.resume[0]) {
        resumeFile = data.resume[0];
      } else if (data.resume && data.resume instanceof File) {
        resumeFile = data.resume;
      } else {
        resumeFile = data.resume;
      }
      
      console.log('Resume file:', resumeFile);
      
      const result = await fnApply({
        ...data,
        job_id: job.id,
        candidate_id: user.id,
        name: user.fullName,
        status: "applied",
        resume: resumeFile,
      });
      
      console.log('Application result:', result);
      
      fetchJob();
      reset();
      // Hide the form after successful application
      setShowForm(false);
      // Update the applied state to reflect that the user has applied
      setLocalApplied(true);
      // Redirect to application confirmation page
      navigate('/application-confirmation', { state: { job } });
    } catch (error) {
      console.error('Application error:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <Button
          size="lg"
          variant={job?.isOpen && !localApplied ? "blue" : "destructive"}
          disabled={!job?.isOpen || localApplied}
          onClick={() => !localApplied && job?.isOpen && setShowForm(true)}
          className="w-full mb-4 py-6 text-lg"
        >
          {job?.isOpen ? (localApplied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
        
        {showForm && (
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Apply for {job?.title} at {typeof job?.company === 'object' ? job?.company?.name : job?.company}
              </h3>
              <Button
                onClick={() => setShowForm(false)}
                variant="ghost"
                size="sm"
                style={{
                  padding: '0.25rem',
                  minWidth: '30px',
                  height: '30px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  fontSize: '0.875rem',
                  borderRadius: '0.25rem',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ←
              </Button>
            </div>
            
            <form
              onSubmit={(e) => {
                console.log('Form submit event triggered');
                const formData = new FormData(e.target);
                console.log('Form validity:', e.target.checkValidity());
                console.log('FormData entries:', [...formData.entries()]);
                handleSubmit(onSubmit)(e);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <Input
                  type="number"
                  placeholder="Years of Experience"
                  className="w-full"
                  required
                  {...register("experience", {
                    valueAsNumber: true,
                  })}
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Skills (Comma Separated)</label>
                <Input
                  type="text"
                  placeholder="Skills"
                  className="w-full"
                  required
                  {...register("skills")}
                />
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Education</label>
                <Controller
                  name="education"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} {...field} required>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Intermediate" id="intermediate" />
                          <Label htmlFor="intermediate">Intermediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Graduate" id="graduate" />
                          <Label htmlFor="graduate">Graduate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Post Graduate" id="post-graduate" />
                          <Label htmlFor="post-graduate">Post Graduate</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.education && (
                  <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Upload Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full block file:border-0 file:bg-transparent file:h-10 file:py-2 file:px-3 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full border border-input bg-background px-3 py-2"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    console.log('File selected:', file);
                    if (file) {
                      setValue("resume", file, { shouldValidate: true });
                    }
                  }}
                />
                {errors.resume && (
                  <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
                )}
              </div>
              
              {errorApply && (
                <p className="text-red-500 text-sm">{errorApply.message}</p>
              )}
              {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mt-2">
                  <p>Please fix the following errors:</p>
                  <ul className="list-disc pl-5 mt-1">
                    {errors.experience && <li>{errors.experience.message}</li>}
                    {errors.skills && <li>{errors.skills.message}</li>}
                    {errors.education && <li>{errors.education.message}</li>}
                    {errors.resume && <li>{errors.resume.message}</li>}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  variant="blue" 
                  size="lg"
                  className="flex-1"
                >
                  Submit
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
