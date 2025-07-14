import { Link } from "react-router";

const PetCard = ({ pet }) => {
  const { _id, name, age, location, imageUrl } = pet;

  return (
    <div className="bg-white dark:bg-base-200 rounded-xl shadow-md mb-10 p-4 hover:shadow-lg transition">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-600">Age: {age} years</p>
      <p className="text-sm text-gray-600 mb-3">Location: {location}</p>
      <Link
        to={`/pet-listing/${_id}`}
        className="btn btn-sm btn-outline btn-primary w-full"
      >
        View Details
      </Link>
    </div>
  );
};

export default PetCard;
