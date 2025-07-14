import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const PetDetails = ({ pet }) => {
  const { name, age, category, location, shortDescription, longDescription, imageUrl } = pet;
  const { user } = UseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.imageUrl,
      userName: user?.displayName,
      email: user?.email,
      phone: formData.phone,
      address: formData.address,
      timestamp: new Date(),
    };

    try {
      const res = await fetch("/api/adoptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adoptionData),
      });

      if (res.ok) {
        alert("Adoption request sent!");
        setIsOpen(false);
        setFormData({ phone: "", address: "" });
      } else {
        alert("Failed to send adoption request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={imageUrl} alt={name} className="w-full rounded-xl object-cover" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-1">Age: {age} years</p>
          <p className="text-gray-600 dark:text-gray-300 mb-1">Category: {category}</p>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
            <FaMapMarkerAlt /> {location}
          </p>
          <p className="text-gray-700 dark:text-gray-200 font-medium mb-2">{shortDescription}</p>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: longDescription }} />
          <Button className="mt-6" onClick={() => setIsOpen(true)}>
            Adopt
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 p-6">
            <Dialog.Title className="text-xl font-semibold mb-4 text-center">
              Adopt: {name}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Disabled Name & Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2"
                />
              </div>

              {/* Editable Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white dark:bg-gray-800">
                  <FaPhoneAlt className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Enter your address"
                  className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800"
                />
              </div>

              <div className="text-center pt-4">
                <Button type="submit" className="w-full">
                  Submit Adoption Request
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default PetDetails;
