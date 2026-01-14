import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) => file && file[0] && (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only PNG or JPEG images are allowed",
      }
    ),
});

const AddCompanyModal = ({ fetchCompanies }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.logo && data.logo[0]) {
      formData.append('logo', data.logo[0]);
    }
    
    fnAddCompany(formData);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  // Close modal after successful submission
  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      setIsOpen(false);
      fetchCompanies(); // Refresh company list
      reset(); // Reset form
    }
  }, [dataAddCompany, fetchCompanies, reset]);

  if (!isOpen) {
    return (
      <Button 
        onClick={toggleModal} 
        variant="outline"
      >
        Add Company
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Add New Company</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Input
              placeholder="Company name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <Input
              type="file"
              accept="image/*"
              className="file:text-gray-500"
              {...register("logo")}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>
            )}
          </div>

          {errorAddCompany?.message && (
            <p className="text-red-500 text-sm mb-2">{errorAddCompany?.message}</p>
          )}

          {loadingAddCompany && (
            <div className="mb-2">
              <BarLoader width={"100%"} color="#36d7b7" />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={toggleModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;