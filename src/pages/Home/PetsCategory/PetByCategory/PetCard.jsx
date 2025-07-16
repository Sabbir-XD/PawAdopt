import { FaMapMarkerAlt } from "react-icons/fa";

const PetCard = ({ pet }) => {
  return (
    <div className="border rounded-xl shadow hover:shadow-md p-4 bg-white">
      <img
        src={pet.imageUrl}
        alt={pet.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold capitalize text-gray-800">{pet.name}</h3>
      <p className="text-sm text-gray-600 mb-2">
        Age: {pet.age} | <FaMapMarkerAlt className="inline text-teal-500" />{" "}
        {pet.location}
      </p>
      <p className="text-gray-500">{pet.shortDescription}</p>
    </div>
  );
};

export default PetCard;
