import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { Link, useLocation, useNavigate } from "react-router";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import SocialLogin from "@/components/SocialLogin/SocialLogin";
import { toast } from "react-toastify";
import axios from "axios";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { FromSkeleton } from "@/components/Loading/Loading";

const Register = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleCreateUser, handleUpdateProfile, setUser } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    if (!imageFile) {
      toast.error("Please upload your profile image first.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "petcare");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/ddgcar30i/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            toast.info(`Uploading image: ${percentCompleted}%`);
          },
        }
      );

      const imageUrl = cloudRes.data.secure_url;

      // Create user with email and password
      const result = await handleCreateUser(data.email, data.password);
      const user = result.user;

      // Update user profile with name and image
      await handleUpdateProfile({
        displayName: data.name,
        photoURL: imageUrl,
      });

      setUser({
        ...user,
        displayName: data.name,
        photoURL: imageUrl,
      });

      // Save user to database
      const payload = {
        name: data.name,
        email: data.email,
        role: "user",
        photoURL: imageUrl,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await axiosSecure.post("/users", payload);

      toast.success("Registration Successful! Welcome to our community!");
      reset();
      setImagePreview(null);
      setImageFile(null);
      navigate(location?.state?.from?.pathname || "/");
    } catch (error) {
      console.error("Registration Error:", error);

      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered.";
          setError("email", { type: "manual", message: errorMessage });
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          setError("password", { type: "manual", message: errorMessage });
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          setError("email", { type: "manual", message: errorMessage });
          break;
        default:
          errorMessage = "An unexpected error occurred. Please try again.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg overflow-hidden border-teal-100 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-800 text-white p-6">
            <CardTitle className="text-center text-2xl font-bold">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center text-teal-100 dark:text-teal-200">
              Join our pet loving community
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-6 dark:bg-gray-800">
              {/* Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-teal-100 dark:border-gray-600">
                    {imagePreview ? (
                      <AvatarImage
                        src={imagePreview}
                        className="object-cover"
                        alt="Profile preview"
                      />
                    ) : (
                      <AvatarFallback className="bg-teal-100 dark:bg-gray-700 text-teal-600 dark:text-teal-400">
                        <FiUser className="w-8 h-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-teal-600 dark:bg-teal-700 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors">
                    <FiCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">
                  Add profile photo (max 5MB)
                </p>
              </div>

              {/* Full Name */}
              <div>
                <Label
                  htmlFor="name"
                  className="text-teal-800 dark:text-teal-200"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 h-4 w-4 text-teal-500 dark:text-teal-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className={`pl-9 mt-1 border-teal-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.name ? "border-red-500 dark:border-red-400" : ""
                    }`}
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mt-4">
                <Label
                  htmlFor="email"
                  className="text-teal-800 dark:text-teal-200"
                >
                  Email
                </Label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-4 w-4 text-teal-500 dark:text-teal-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`pl-9 mt-1 border-teal-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.email ? "border-red-500 dark:border-red-400" : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mt-4">
                <Label
                  htmlFor="password"
                  className="text-teal-800 dark:text-teal-200"
                >
                  Password
                </Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-4 h-4 w-4 text-teal-500 dark:text-teal-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-9 pr-10 mt-1 border-teal-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.password
                        ? "border-red-500 dark:border-red-400"
                        : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      validate: {
                        minLength: (v) =>
                          v.length >= 6 ||
                          "Password must be at least 6 characters",
                        hasUpper: (v) =>
                          /[A-Z]/.test(v) ||
                          "Must include at least 1 uppercase letter",
                        hasLower: (v) =>
                          /[a-z]/.test(v) ||
                          "Must include at least 1 lowercase letter",
                        hasNumber: (v) =>
                          /\d/.test(v) || "Must include at least 1 number",
                        hasSpecial: (v) =>
                          /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                          "Must include at least 1 special character",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-4 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.password.message}
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Password requirements:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>At least 6 characters</li>
                    <li>1 uppercase letter</li>
                    <li>1 lowercase letter</li>
                    <li>1 number</li>
                    <li>1 special character</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FromSkeleton count={1} />
                    </span>
                  ) : (
                    "Register"
                  )}
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-teal-200 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social login */}
              <SocialLogin />
            </CardContent>

            <CardFooter className="bg-teal-50 dark:bg-gray-700 p-6 flex justify-center">
              <p className="text-sm text-teal-800 dark:text-teal-200">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
