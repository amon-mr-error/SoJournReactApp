import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { handleApiError } from "../api";
import { useAppContext } from "../AppContext";

const MyAdventures = () => {
  const { user } = useAppContext();
  const [adventures, setAdventures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAdventures();
    // eslint-disable-next-line
  }, []);

  const fetchMyAdventures = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/adventures/adventurer/adventures");
      setAdventures(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(handleApiError(err));
      setAdventures([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== "adventurer" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sojourn-gray">You do not have access to view your adventures.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-semibold text-sojourn-green mb-2">
            My Adventures
          </h1>
          <p className="text-sojourn-gray text-sm">Manage and view your adventure listings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-sojourn-green animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-sojourn-gray mb-2">Loading adventures...</h3>
              <p className="text-sm text-gray-500">Please wait while we fetch your adventures</p>
            </div>
          ) : adventures.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-sojourn-gray mb-2">No adventures found</h3>
              <p className="text-sm text-gray-500">Create your first adventure to get started</p>
            </div>
          ) : (
            adventures.map((adv) => (
              <div key={adv._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  {/* Adventure Info */}
                  <Link 
                    to={`/adventure/adventures/${adv._id}`}
                    className="flex-1 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-sojourn-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-sojourn-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sojourn-green group-hover:text-sojourn-teal transition-colors mb-1">
                          {adv.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{adv.location}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {adv.difficulty}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {adv.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Price & Actions */}
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-sojourn-green">
                        ₹{adv.price}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/adventure/adventures/${adv._id}/bookings`}
                        className="px-3 py-1.5 bg-sojourn-green text-white text-xs font-medium rounded-lg hover:bg-sojourn-teal transition-colors"
                      >
                        Bookings
                      </Link>
                      <Link
                        to={`/adventure/adventures/${adv._id}`}
                        className="px-3 py-1.5 bg-gray-100 text-sojourn-gray text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAdventures;