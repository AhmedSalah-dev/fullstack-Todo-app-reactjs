import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Login_Form } from "../data";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios.config";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";



interface IFormInput {
  identifier: string;
  password: string;
}
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
   
    try {
      // Fulfilled
     const {status,data: resData} = await axiosInstance.post("/auth/local", data)
     console.log(resData)
     if(status===200) {
      toast.success("You will navigate to the Home page after 3 seconde", {
        position:"bottom-center",
        duration:1500,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content"
        },
      });
      // ** Store the resDate in local storage. 
      localStorage.setItem('loggedInUser',JSON.stringify(resData))

      setTimeout(() => {
        location.replace("/")
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

  

  // Renders
  const renderLoginForm = Login_Form.map(
    ({ name, placeholder, type, validation }, idx) => {
      return (
        <div key={idx}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
        </div>
      );
    }
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
