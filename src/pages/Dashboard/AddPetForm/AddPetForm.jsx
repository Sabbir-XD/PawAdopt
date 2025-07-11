import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, X } from "lucide-react";
import { toast } from "react-toastify";

// Pet category options
const petCategories = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "fish", label: "Fish" },
  { value: "rabbit", label: "Rabbit" },
  { value: "hamster", label: "Hamster" },
  { value: "reptile", label: "Reptile" },
  { value: "other", label: "Other" },
];

const AddPetForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "petcare");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/ddgcar30i/image/upload",
        formData
      );
      setUploadedImage(res.data.secure_url);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Image upload failed");
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedImage) {
      toast.error("Please upload an image");
      return;
    }

    if (!data.petCategory) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);

    const pet = {
      name: data.petName,
      age: Number(data.petAge),
      category: data.petCategory.value,
      location: data.petLocation,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      imageUrl: uploadedImage,
      adopted: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post("/api/pets", pet);
      toast.success("Pet added successfully!");
      reset();
      setUploadedImage("");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Failed to add pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold text-teal-600 mb-4">Add a Pet</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Image Upload */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {preview ? (
              <div className="relative">
                <img src={preview} className="h-32 w-32 object-cover rounded-md border" />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImage("");
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="h-32 w-32 border-2 border-dashed rounded-md flex justify-center items-center text-teal-400">
                <PlusCircle size={24} />
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              {preview ? "Change Image" : "Upload Image"}
            </Button>
            <p className="text-sm text-gray-500 mt-1">Upload JPG or PNG</p>
          </div>
        </div>

        {/* Form Fields */}
        <div>
          <Label>Pet Name</Label>
          <Input {...register("petName", { required: "Pet name is required" })} />
          {errors.petName && <p className="text-sm text-red-500">{errors.petName.message}</p>}
        </div>

        <div>
          <Label>Pet Age</Label>
          <Input type="number" {...register("petAge", {
            required: "Age is required",
            min: { value: 0, message: "Age can't be negative" },
            max: { value: 30, message: "Age is too high" }
          })} />
          {errors.petAge && <p className="text-sm text-red-500">{errors.petAge.message}</p>}
        </div>

        <div>
          <Label>Pet Category</Label>
          <Select
            options={petCategories}
            onChange={(option) => setValue("petCategory", option)}
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <Label>Location</Label>
          <Input {...register("petLocation", { required: "Location is required" })} />
          {errors.petLocation && <p className="text-sm text-red-500">{errors.petLocation.message}</p>}
        </div>

        <div>
          <Label>Short Description</Label>
          <Input {...register("shortDescription", {
            required: "Short description is required",
            minLength: { value: 10, message: "At least 10 characters" }
          })} />
          {errors.shortDescription && (
            <p className="text-sm text-red-500">{errors.shortDescription.message}</p>
          )}
        </div>

        <div>
          <Label>Detailed Description</Label>
          <ReactQuill onChange={(val) => setValue("longDescription", val)} />
          {errors.longDescription && (
            <p className="text-sm text-red-500">{errors.longDescription.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Submitting...
            </span>
          ) : (
            "Add Pet"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddPetForm;
