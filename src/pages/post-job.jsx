import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { State, City } from "country-state-city";
import { useUser } from "@clerk/clerk-react";
import useFetch from "../hooks/use-fetch";
import { getCompanies } from "../api/apiCompanies";
import { addNewJob } from "../api/apiJobs";
import BarLoader from "react-spinners/BarLoader";
import { useEffect } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Navigate, useNavigate } from "react-router-dom";
import AddCompanyModal from '../components/add-company-modal';

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
});

const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { 
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const [dataCreateJob, loadingCreateJob, errorCreateJob, fnCreateJob] = useFetch(addNewJob);

  const onSubmit = async (data) => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const jobData = {
        ...data,
        recruiter_id: user.id,
        isOpen: true,
      };
      fnCreateJob(jobData); // useFetch hook handles token automatically
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/Joblisting");
  }, [dataCreateJob]);

  const [companies, loadingCompanies, errorCompanies, fnCompanies] = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  if (isLoaded && user && user.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/Joblisting" />;
  }


  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">Post Job & Internship</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        
        <div className="space-y-4">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="text-blue-500">
                  <SelectGroup>
                    {City.getCitiesOfCountry("BD").map(({ name }) => (
                      <SelectItem key={name} value={name} className="text-blue-500">
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )} />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
          
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="text-blue-500">
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={id} value={id.toString()} className="text-blue-500">
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )} />

          <AddCompanyModal fetchCompanies={fnCompanies} />


        {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        </div>

        <Button type="submit" variant="blue" size="lg" className="mt-2 w-full py-6 text-lg">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;