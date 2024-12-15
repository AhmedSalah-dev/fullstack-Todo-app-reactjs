import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { Register_Form } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  username : String;
  email : String;
  password : String;
  
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const[isLoading,setIsLoading] = useState(false);
  const { register,
     handleSubmit
     , formState: {errors}
     } = useForm<IFormInput>({
      resolver: yupResolver<IFormInput>(registerSchema),
     });

  // ** Handlers 
  const onSubmit : SubmitHandler<IFormInput> = async(data) => {
    setIsLoading(true)

    try {
      // Fulfilled
     const {status} = await axiosInstance.post("/auth/local/register", data)
     if(status===200) {
      toast.success("You will navigate to the login page after 3 seconde", {
        position:"bottom-center",
        duration:1500,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content"
        },
      });
      setTimeout(() => {
        navigate('/login')
      }, 3000);
     };

     //Rejected
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      console.log(errorObj.response?.data.error?.message)
      toast.error(`${errorObj.response?.data.error?.message}`, {
        position:"bottom-center",
        duration:4000,
    })
  }
    finally {
      setIsLoading(false);
    };
  };

  // ** Renders
  const renderRegisterForm = Register_Form.map(({name,placeholder,type,validation}, idx) =>(
    <div key={idx}>
          <Input 
          type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          /> 
          {errors[name] && <InputErrorMessage msg={errors[name]?.message}/>}
        </div>
  ))
   
  

  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterForm}
        <Button fullWidth isLoading={isLoading}>Register</Button>

      </form>
    </div>
  );
};

export default RegisterPage;
