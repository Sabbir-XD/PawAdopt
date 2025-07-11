import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Card Skeleton
export const CardSkeleton = ({ count = 1 }) => {
  return Array(count).fill(0).map((_, index) => (
    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton height={200} />
      <div className="p-4">
        <Skeleton width={150} height={24} />
        <Skeleton width={100} height={20} className="mt-2" />
        <div className="flex justify-between mt-4">
          <Skeleton width={80} height={32} />
          <Skeleton width={100} height={32} />
        </div>
      </div>
    </div>
  ));
};

// Banner Skeleton
export const BannerSkeleton = () => (
  <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl h-96 w-full">
    <div className="p-8">
      <Skeleton width={200} height={40} />
      <Skeleton width={300} height={24} className="mt-4" />
      <div className="flex gap-4 mt-6">
        <Skeleton width={150} height={48} />
        <Skeleton width={150} height={48} />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} height={80} />
        ))}
      </div>
    </div>
  </div>
);

// Pet Detail Skeleton
export const PetDetailSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-8">
    <div>
      <Skeleton height={400} />
    </div>
    <div className="space-y-4">
      <Skeleton width={200} height={32} />
      <Skeleton count={4} />
      <div className="flex gap-4 mt-6">
        <Skeleton width={120} height={48} />
        <Skeleton width={120} height={48} />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr>
    {Array(columns).fill(0).map((_, i) => (
      <td key={i} className="p-4">
        <Skeleton />
      </td>
    ))}
  </tr>
);


//from skeleton

export const FromSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-4">
      <Skeleton width={150} height={24} />
      <Skeleton width={100} height={20} className="mt-2" />
      <div className="flex justify-between mt-4">
        <Skeleton width={80} height={32} />
        <Skeleton width={100} height={32} />
      </div>
    </div>
  </div>
);