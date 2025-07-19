import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const petCategories = [
  { value: "dog", label: "🐕 Dog" },
  { value: "cat", label: "🐈 Cat" },
  { value: "bird", label: "🦜 Bird" },
  { value: "fish", label: "🐠 Fish" },
  { value: "rabbit", label: "🐇 Rabbit" },
  { value: "hamster", label: "🐹 Hamster" },
  { value: "reptile", label: "🦎 Reptile" },
  { value: "other", label: "🐾 Other" },
];

const AddPetForm = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

  const initialValues = {
    petName: "",
    petAge: "",
    petCategory: null,
    petLocation: "",
    shortDescription: "",
    longDescription: "",
  };

  const validationSchema = Yup.object({
    petName: Yup.string().required("Pet name is required"),
    petAge: Yup.number()
      .required("Pet age is required")
      .min(0, "Age can't be negative")
      .max(30, "Age is too high"),
    petCategory: Yup.object().required("Pet category is required"),
    petLocation: Yup.string().required("Location is required"),
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

  const handleSubmit = async (values, { resetForm }) => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    const pet = {
      name: values.petName,
      email: user.email,
      age: Number(values.petAge),
      category: values.petCategory.value,
      location: values.petLocation,
      shortDescription: values.shortDescription,
      longDescription: values.longDescription,
      imageUrl: uploadedImage,
      adopted: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await axiosSecure.post("/pets", pet);
      toast.success("Pet added successfully!");
      setUploadedImage("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add pet");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-1 md:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-2">
          Add a New Pet for Adoption
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Help us find a loving home for this pet
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="space-y-8">
            {/* Image Upload */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-teal-200 dark:border-gray-600">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Pet Image
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
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md p-2 w-full"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="h-48 w-48 object-cover mt-4 rounded-xl border dark:border-gray-600"
                  alt="Preview"
                />
              )}
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-teal-200 dark:border-gray-600">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                  Pet Name
                </label>
                <Field
                  name="petName"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded-md"
                />
                <ErrorMessage
                  name="petName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                  Pet Age
                </label>
                <Field
                  name="petAge"
                  type="number"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded-md"
                />
                <ErrorMessage
                  name="petAge"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                  Category
                </label>
                <Select
                  options={petCategories}
                  value={values.petCategory}
                  onChange={(option) => setFieldValue("petCategory", option)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                      ...theme.colors,
                      primary25: "#ccfbf1",
                      primary: "#14b8a6",
                    },
                  })}
                />
                {touched.petCategory && errors.petCategory && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.petCategory}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                  Location
                </label>
                <Field
                  name="petLocation"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded-md"
                />
                <ErrorMessage
                  name="petLocation"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-teal-200 dark:border-gray-600">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                  Short Description
                </label>
                <Field
                  name="shortDescription"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded-md"
                />
                <ErrorMessage
                  name="shortDescription"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-teal-200 dark:border-gray-600">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
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
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 dark:from-teal-500 dark:to-teal-600 hover:dark:from-teal-600 hover:dark:to-teal-700 text-white py-4 text-lg font-semibold rounded-xl shadow-md"
            >
              List Pet for Adoption
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPetForm;
