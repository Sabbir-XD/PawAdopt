import React, { useEffect, useRef, useState } from "react";
import { FaUserEdit, FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { CardSkeleton } from "@/components/Loading/Loading";

const Profile = () => {
  const { user, handleUpdateProfile, setLoading } = UseAuth();
  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ✅ Fetch backend user data
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  // ✅ Backend update mutation
  const updateUserMutation = useMutation({
    mutationFn: async (payload) => {
      const { email, data } = payload;
      const res = await axiosSecure.patch(`/users/${email}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", user.email]);
    },
    onError: () => {
      setError("❌ Backend update failed.");
    },
  });

  // ✅ Trigger file input
  const triggerFileInput = () => fileInputRef.current?.click();

  // ✅ Handle image change
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "petcare");

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/ddgcar30i/image/upload`,
        formData
      );

      const imageUrl = cloudRes.data.secure_url;

      await handleUpdateProfile({
        displayName: userData?.name,
        photoURL: imageUrl,
      });

      await updateUserMutation.mutateAsync({
        email: user.email,
        data: {
          name: userData?.name,
          photoURL: imageUrl,
        },
      });

      setSuccess("✅ Profile picture updated successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to upload image or update profile.");
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  // ✅ Handle name update
  const handleNameUpdate = async () => {
    if (!displayName.trim()) {
      setError("Display name cannot be empty");
      return;
    }

    try {
      await handleUpdateProfile({ displayName });

      await updateUserMutation.mutateAsync({
        email: user.email,
        data: {
          name: displayName,
          photoURL: userData?.photoURL,
        },
      });

      setSuccess("✅ Profile name updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError("❌ Failed to update name.");
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  // ✅ Update local state when userData loads
  useEffect(() => {
    if (userData) {
      setDisplayName(userData?.name || user?.displayName || "");
      setPhotoURL(userData?.photoURL || user?.photoURL || "");
    }
  }, [userData, user]);

  if (isUserLoading)
    return (
      <div className="text-center py-10">
        <CardSkeleton count={1} />
      </div>
    );

  return (
    <div className="dark:bg-gray-900 py-5 lg:py-12">
      <div className="lg:w-10/12 mx-auto p-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-32 relative">
            <div className="absolute -bottom-16 left-6">
              <div className="relative group">
                <img
                  src={
                    photoURL ||
                    `https://ui-avatars.com/api/?name=${displayName}&background=teal-500&color=fff&size=128`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Change photo"
                  disabled={isUploading}
                >
                  <FaCamera />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-6 pb-6">
            {/* Name Edit */}
            <div className="flex items-center justify-between mb-6">
              {editMode ? (
                <div className="flex-1 flex items-center">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-2xl font-bold bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 flex-1 mr-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleNameUpdate}
                    className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition-colors"
                    title="Save changes"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setDisplayName(userData?.name || user?.displayName || "");
                      setError(null);
                    }}
                    className="ml-2 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-700 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {displayName || "Your Name"}
                  </h2>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-teal-500 hover:text-teal-600 transition-colors"
                    title="Edit name"
                  >
                    <FaUserEdit size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                {success}
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <MdEmail className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">
                    Email
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-gray-100">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {user?.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <RiLockPasswordLine className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">
                    Account Security
                  </h3>
                </div>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Change Password
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Last login:{" "}
                  {user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
