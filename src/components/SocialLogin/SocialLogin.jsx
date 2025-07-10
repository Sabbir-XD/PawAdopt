import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";

const SocialLogin = () => {
  const { handleGoogleLoginUser } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const googleLogin = () => {
    handleGoogleLoginUser()
      .then((result) => {
        console.log(result.user);
        const data = result.user;

        const dataUser = {
          name: data.displayName,
          email: data.email,
          role: "user",
          photoURL: data.photoURL,
          uid: data.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        axiosSecure.put("/users", dataUser).then((data) => {
          console.log(data);
        }).catch((error) => {
          console.log(error);
        })


        // setUser(dataUser);
        console.log(dataUser);
        toast.success("Google Login successful!");
        navigate(location?.state || "/");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        onClick={googleLogin}
        variant="outline"
        className="flex items-center justify-center border-teal-300 hover:bg-teal-50"
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center border-teal-300 hover:bg-teal-50"
      >
        <FaGithub className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
};

export default SocialLogin;
