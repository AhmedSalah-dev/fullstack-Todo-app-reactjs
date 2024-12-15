import { ILoginInput, IRegisterInput } from "../interfaces";

export const Register_Form: IRegisterInput[] = [
  {
    name: "username",
    placeholder : "Username",
    type : "text" ,
    validation : {
      required : true,
      minLength : 5,
    },
  },
  {
    name: "email",
    placeholder : "Email address",
    type : "text" ,
    validation : {
      required : true,
      pattern :  /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    },
  },
  {
    name: "password",
    placeholder : "Password",
    type : "text" ,
    validation : {
      required : true,
      minLength : 5,
    },
  },
];
export const Login_Form: ILoginInput[] = [
  {
    name: "identifier",
    placeholder : "Email address",
    type : "text" ,
    validation : {
      required : true,
      pattern :  /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    },
  },
  {
    name: "password",
    placeholder : "Password",
    type : "text" ,
    validation : {
      required : true,
      minLength : 5,
    },
  },
];