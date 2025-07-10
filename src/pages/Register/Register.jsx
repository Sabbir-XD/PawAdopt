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

const Register = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleCreateUser, handleUpdateProfile, setUser } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // ✅ Cloudinary Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "petcare");

    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/ddgcar30i/image/upload",
        formData
      );
      setUploadedImageUrl(data.secure_url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Image upload failed.");
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedImageUrl) {
      toast.error("Please upload your profile image first.");
      return;
    }

    setLoading(true);
    try {
      await handleCreateUser(data.email, data.password)
        .then((result) => {
          const user = result.user;
          handleUpdateProfile({
            displayName: data.name,
            photoURL: uploadedImageUrl,
          });
          setUser({
            ...user,
            displayName: data.name,
            photoURL: uploadedImageUrl,
          });

          const payload = {
            name: data.name,
            email: data.email,
            role: "user",
            photoURL: uploadedImageUrl,
            uid: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          axiosSecure
            .post("/users", payload)
            .then((response) => {
              console.log("User created successfully:", response.data);
            })
            .catch((error) => {
              console.error("Error creating user:", error);
            });

          toast.success("Registration Successful!");
          navigate(location?.state || "/");
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          toast.error("Registration failed.");
        });

      reset();
      setImagePreview(null);
      setUploadedImageUrl("");
    } catch (error) {
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 mt-10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg overflow-hidden border-teal-100">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6">
            <CardTitle className="text-center text-2xl font-bold">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center text-teal-100">
              Join our pet loving community
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-teal-100">
                    {imagePreview ? (
                      <AvatarImage
                        src={imagePreview}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-teal-100 text-teal-600">
                        <FiUser className="w-8 h-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700">
                    <FiCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      {...register("photo", { required: true })}
                      onChange={handleImageChange}
                      className="file-input hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-teal-600 mt-2">Add profile photo</p>
                {errors.photo && (
                  <p className="text-sm text-red-500">Image is required</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor="name" className="text-teal-800">
                  Full Name
                </Label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-9 mt-1 border-teal-300"
                    {...register("name", { required: "Full name is required" })}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="mt-4">
                <Label htmlFor="email" className="text-teal-800">
                  Email
                </Label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-9 mt-1 border-teal-300"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email format",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="mt-4">
                <Label htmlFor="password" className="text-teal-800">
                  Password
                </Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 mt-1 border-teal-300"
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-teal-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !uploadedImageUrl}
                className="w-full bg-teal-600 hover:bg-teal-700 mt-6"
              >
                {loading ? "Registering..." : "Register"}
              </Button>

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

              {/* Social login */}
              <SocialLogin />
            </CardContent>

            <CardFooter className="bg-teal-50 p-6 flex justify-center">
              <p className="text-sm text-teal-800">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-600 font-medium hover:underline"
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
