import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";

const EditDonationCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);
  const [campaignData, setCampaignData] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get(`/donations-campaigns/${id}`);
        setCampaignData(res.data);
        setUploadedImage(res.data.imageUrl);
        setImagePreview(res.data.imageUrl);
      } catch {
        toast.error("Failed to load campaign data");
      }
    };
    fetchData();
  }, [id]);

  const validationSchema = Yup.object({
    petName: Yup.string().required("Pet name is required"),
    maxDonation: Yup.number()
      .required("Maximum donation amount is required")
      .min(1, "Must be at least 1"),
    deadline: Yup.date()
      .required("Last donation date is required")
      .min(new Date(), "Date must be in the future"),
    shortDescription: Yup.string()
      .max(100, "Max 100 characters")
      .required("Short description is required"),
    longDescription: Yup.string().required("Long description is required"),
  });

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "petcare");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/ddgcar30i/image/upload",
        formData
      );
      setUploadedImage(res.data.secure_url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (values) => {
    if (!uploadedImage) {
      toast.error("Please upload an image");
      return;
    }

    const updatedCampaign = {
      petName: values.petName,
      createdBy: user?.email,
      imageUrl: uploadedImage,
      maxDonationAmount: Number(values.maxDonation),
      deadline: values.deadline,
      shortDescription: values.shortDescription,
      longDescription: values.longDescription,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.put(
        `/donations-campaigns/${id}`,
        updatedCampaign
      );
      if (res.data.modifiedCount > 0) {
        toast.success("Campaign updated successfully!");
        navigate("/dashboard/my-donations");
      }
    } catch {
      toast.error("Failed to update donation");
    }
  };

  if (!campaignData) {
    return (
      <p className="text-center text-gray-500">Loading campaign data...</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
        Edit Donation Campaign
      </h2>

      <Formik
        initialValues={{
          petName: campaignData.petName || "",
          maxDonation: campaignData.maxDonationAmount,
          deadline: campaignData.deadline.split("T")[0],
          shortDescription: campaignData.shortDescription,
          longDescription: campaignData.longDescription,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, touched, errors }) => (
          <Form className="space-y-6">
            {/* Image Upload */}
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
                    handleImageUpload(file);
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
              <label className="block font-medium text-gray-700 mb-1">
                Pet Name
              </label>
              <Field name="petName" className="w-full border p-2 rounded-md" />
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
                onChange={(value) => setFieldValue("longDescription", value)}
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
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-xl shadow-md"
            >
              Update Campaign
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditDonationCampaign;
