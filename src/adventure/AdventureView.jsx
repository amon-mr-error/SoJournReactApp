import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { handleApiError } from "../api";

const AdventureView = () => {
  const { id } = useParams();
  const [adventure, setAdventure] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdventure();
    // eslint-disable-next-line
  }, [id]);

  const fetchAdventure = async () => {
    setError("");
    try {
      const res = await api.get(`/api/adventures/${id}`);
      setAdventure(res.data);
    } catch (err) {
      setError(handleApiError(err));
      setAdventure(null);
    }
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!adventure) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-6">
      <Link to="/adventure/explore" className="text-blue-900 hover:underline">&larr; Back to Explore</Link>
      <div className="bg-white rounded-xl shadow p-4 sm:p-8 mt-2">
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={adventure.imageUrl}
            alt={adventure.name}
            className="w-full sm:w-72 h-56 object-cover rounded"
            style={{ background: "#eee" }}
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{adventure.name}</h1>
            <div className="text-gray-600 mb-1">{adventure.location}</div>
            <div className="text-sm text-gray-500 mb-2">
              {adventure.difficulty} | {adventure.duration}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Category:</span>{" "}
              {adventure.category?.name || ""}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Price:</span> ₹{adventure.price}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Max Participants:</span> {adventure.maxParticipants}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Schedule:</span>{" "}
              {adventure.schedule?.startTime} - {adventure.schedule?.endTime} on{" "}
              {adventure.schedule?.daysAvailable?.join(", ")}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Age Restriction:</span>{" "}
              {adventure.ageRestriction?.minAge} - {adventure.ageRestriction?.maxAge}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Requirements:</span>{" "}
              {adventure.requirements?.join(", ")}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Safety Instructions:</span>{" "}
              {adventure.safetyInstructions}
            </div>
            {adventure.discount?.isActive && (
              <div className="mb-2 text-green-700 font-semibold">
                Discount: {adventure.discount.percentage}% off until{" "}
                {adventure.discount.validUntil?.slice(0, 10)}
              </div>
            )}
            <div className="mb-2">
              <span className="font-semibold">Adventurer:</span>{" "}
              {adventure.adventurer?.name}
            </div>
          </div>
        </div>
        {adventure.multipleImageUrls && adventure.multipleImageUrls.length > 0 && (
          <div className="mt-6">
            <div className="font-semibold mb-2">Gallery</div>
            <div className="flex gap-2 overflow-x-auto">
              {adventure.multipleImageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-32 h-24 object-cover rounded"
                  style={{ background: "#eee" }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="mt-6">
          <div className="font-semibold mb-1">Detailed Description</div>
          <div>{adventure.detailedDescription}</div>
        </div>
      </div>
    </div>
  );
};

export default AdventureView;