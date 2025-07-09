import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { FaPaw } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import SocialLogin from "@/components/SocialLogin/SocialLogin";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLoginUser } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // TODO: Call your login handler here
    handleLoginUser(data.email, data.password)
      .then((result) => {
        console.log("User logged in successfully:", result.user);
        // TODO: Redirect to home page or dashboard

        navigate(location?.state || "/");
        toast.success("Login successful!");
      })
      .catch((error) => {
        console.error("Error logging in user:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg overflow-hidden border-teal-100">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6">
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="w-24 h-24 flex items-center justify-center"
              >
                <FaPaw className="text-6xl text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              Welcome to PetAdopt
            </CardTitle>
            <CardDescription className="text-center text-teal-100">
              Find your perfect pet companion
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-teal-800">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1 border-teal-300 focus:ring-teal-500"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-teal-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="mt-1 border-teal-300 pr-10 pl-3 focus:ring-teal-500 w-full"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 mt-2"
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-teal-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-teal-600">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <SocialLogin />
          </CardContent>

          <CardFooter className="bg-teal-50 p-6 flex justify-center">
            <p className="text-sm text-teal-800">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-teal-600 font-medium hover:underline"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
