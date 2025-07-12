import { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";

const CreateDonationCampaign = () => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const initialValues = {
    petName: "",
    maxDonation: "",
    deadline: "",
    shortDescription: "",
    longDescription: "",
  };

  const validationSchema = Yup.object({
    petName: Yup.string().required("Pet name is required"),
    maxDonation: Yup.number()
      .required("Max donation is required")
      .min(1, "Must be at least 1"),
    deadline: Yup.date()
      .required("Deadline is required")
      .min(new Date(), "Date must be in the future"),
    shortDescription: Yup.string()
      .max(100, "Max 100 characters")
      .required("Short description is required"),
    longDescription: Yup.string().required("Long description is required"),
  });

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "petcare");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/ddgcar30i/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      toast.error("Image upload failed");
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    try {
      toast.info("Uploading image...");
      const imageUrl = await uploadImageToCloudinary(file);

      const campaign = {
        petName: values.petName,
        createdBy: user?.email,
        imageUrl,
        maxDonationAmount: Number(values.maxDonation),
        deadline: values.deadline,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/donations-campaigns", campaign);
      if (res.data.insertedId) {
        toast.success("Campaign created!");
        resetForm();
        setImagePreview(null);
        fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error("Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
        Create Donation Campaign
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, touched, errors, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Pet Image Upload */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Pet Picture
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full border p-2 rounded-md"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 w-48 h-48 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Pet Name
              </label>
              <Field
                name="petName"
                className="w-full border p-2 rounded-md"
              />
              <ErrorMessage
                name="petName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Max Donation */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Maximum Donation Amount
              </label>
              <Field
                type="number"
                name="maxDonation"
                className="w-full border p-2 rounded-md"
              />
              <ErrorMessage
                name="maxDonation"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Last Date of Donation
              </label>
              <Field
                type="date"
                name="deadline"
                className="w-full border p-2 rounded-md"
              />
              <ErrorMessage
                name="deadline"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <Field
                name="shortDescription"
                className="w-full border p-2 rounded-md"
              />
              <ErrorMessage
                name="shortDescription"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Long Description
              </label>
              <ReactQuill
                theme="snow"
                value={values.longDescription}
                onChange={(val) => setFieldValue("longDescription", val)}
              />
              {touched.longDescription && errors.longDescription && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.longDescription}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-xl shadow-md"
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateDonationCampaign;
