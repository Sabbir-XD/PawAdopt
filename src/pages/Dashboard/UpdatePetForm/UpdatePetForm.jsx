import { useEffect, useState, useRef } from "react";
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
import { useParams, useNavigate } from "react-router";
import { FromSkeleton } from "@/components/Loading/Loading";

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

const UpdatePetForm = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [initialData, setInitialData] = useState(null);
  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.get(`/pets/${id}`).then((res) => {
      const pet = res.data;
      console.log(pet);
      setInitialData({
        petName: pet.name,
        petAge: pet.age,
        petCategory: petCategories.find((c) => c.value === pet.category),
        petLocation: pet.location,
        shortDescription: pet.shortDescription,
        longDescription: pet.longDescription,
      });
      setUploadedImage(pet.imageUrl);
      setImagePreview(pet.imageUrl);
    });
  }, [axiosSecure, id]);

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

  const handleSubmit = async (values) => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    const updatedPet = {
      name: values.petName,
      email: user.email,
      age: Number(values.petAge),
      category: values.petCategory.value,
      location: values.petLocation,
      shortDescription: values.shortDescription,
      longDescription: values.longDescription,
      imageUrl: uploadedImage,
      updatedAt: new Date().toISOString(),
    };

    try {
      await axiosSecure.patch(`/pets/${id}`, updatedPet);
      toast.success("Pet updated successfully!");
      navigate("/dashboard/my-pets"); // or any other route
    } catch (error) {
      console.log(error);
      toast.error("Failed to update pet");
    }
  };

  if (!initialData)
    return (
      <div className="text-center">
        <FromSkeleton />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-1 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-teal-700 mb-2">
          Update Pet Information
        </h2>
        <p className="text-gray-600 text-lg">Modify your pet's details below</p>
      </div>

      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="space-y-8">
            {/* Image Upload */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
              <label className="block text-gray-700 font-medium mb-2">
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
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="h-48 w-48 object-cover mt-4 rounded-xl border"
                  alt="Preview"
                />
              )}
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
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

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Pet Age
                </label>
                <Field
                  name="petAge"
                  type="number"
                  className="w-full border p-2 rounded-md"
                />
                <ErrorMessage
                  name="petAge"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <Select
                  options={petCategories}
                  value={values.petCategory}
                  onChange={(option) => setFieldValue("petCategory", option)}
                />
                {touched.petCategory && errors.petCategory && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.petCategory}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Location
                </label>
                <Field
                  name="petLocation"
                  className="w-full border p-2 rounded-md"
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
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
                <label className="block text-gray-700 font-medium mb-1">
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

              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
                <label className="block text-gray-700 font-medium mb-1">
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
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-4 text-lg font-semibold rounded-xl shadow-md"
            >
              Update Pet Info
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdatePetForm;
