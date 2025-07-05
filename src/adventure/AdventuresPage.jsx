import React, { useCallback, useEffect, useState, useRef } from "react";
import api, { handleApiError } from "../api";
import { useAppContext } from "../AppContext";

const defaultForm = {
  name: "",
  description: "",
  detailedDescription: "",
  price: "",
  location: "",
  duration: "",
  difficulty: "Easy",
  ageRestriction: { minAge: "", maxAge: "" },
  requirements: [""],
  safetyInstructions: "",
  category: "",
  maxParticipants: "",
  schedule: { startTime: "", endTime: "", daysAvailable: [] },
  discount: { isActive: false, percentage: "", validFrom: "", validUntil: "" },
  seatAvailability: {},
  image: null,
  multipleImages: [],
};

const difficulties = ["Easy", "Medium", "Hard", "Extreme"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdventuresPage = () => {
  const { user } = useAppContext();
  const [adventures, setAdventures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef();
  const multiFileInputRef = useRef();

  const fetchAdventures = useCallback(async () => {
    setLoading(true);
    setError(""); setMsg("");
    try {
      let res;
      if (user?.role === "adventurer") {
        res = await api.get("/api/adventures/adventurer/adventures");
        setAdventures(Array.isArray(res.data) ? res.data : []);
      } else if (user?.role === "admin") {
        res = await api.get("/api/adventures/");
        setAdventures(Array.isArray(res.data.adventures) ? res.data.adventures : []);
      } else {
        setAdventures([]);
      }
    } catch (err) {
      setError(handleApiError(err));
      setAdventures([]);
    }
    setLoading(false);
  }, [user?.role]);

  useEffect(() => {
    fetchAdventures();
    fetchCategories();
  }, [fetchAdventures]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, image: files[0] }));
    } else if (name === "multipleImages") {
      setForm((f) => ({ ...f, multipleImages: Array.from(files).slice(0, 5) }));
    } else if (name.startsWith("ageRestriction.")) {
      setForm((f) => ({
        ...f,
        ageRestriction: { ...f.ageRestriction, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("schedule.")) {
      setForm((f) => ({
        ...f,
        schedule: { ...f.schedule, [name.split(".")[1]]: value },
      }));
    } else if (name === "requirements") {
      setForm((f) => ({
        ...f,
        requirements: value.split(",").map((v) => v.trim()),
      }));
    } else if (name === "discount.isActive") {
      setForm((f) => ({
        ...f,
        discount: { ...f.discount, isActive: e.target.checked },
      }));
    } else if (name.startsWith("discount.")) {
      setForm((f) => ({
        ...f,
        discount: { ...f.discount, [name.split(".")[1]]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSeatAvailabilityChange = (date, field, value) => {
    setForm((f) => ({
      ...f,
      seatAvailability: {
        ...f.seatAvailability,
        [date]: {
          ...f.seatAvailability[date],
          [field]: value,
        },
      },
    }));
  };

  const addSeatDate = (date) => {
    if (!date) return;
    setForm((f) => ({
      ...f,
      seatAvailability: {
        ...f.seatAvailability,
        [date]: { totalSeats: "", availableSeats: "", price: "" },
      },
    }));
  };

  const removeSeatDate = (date) => {
    const copy = { ...form.seatAvailability };
    delete copy[date];
    setForm((f) => ({ ...f, seatAvailability: copy }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("detailedDescription", form.detailedDescription);
      fd.append("price", Number(form.price));
      fd.append("location", form.location);
      fd.append("duration", form.duration);
      fd.append("difficulty", form.difficulty);
      fd.append("ageRestriction", JSON.stringify(form.ageRestriction));
      fd.append("requirements", JSON.stringify(form.requirements));
      fd.append("safetyInstructions", form.safetyInstructions);
      fd.append("category", typeof form.category === "object" ? form.category._id : form.category);
      fd.append("maxParticipants", Number(form.maxParticipants));
      fd.append("schedule", JSON.stringify(form.schedule));
      fd.append("discount", JSON.stringify(form.discount));
      fd.append("seatAvailability", JSON.stringify(form.seatAvailability));
      if (form.image) fd.append("image", form.image);
      if (form.multipleImages && form.multipleImages.length)
        form.multipleImages.forEach((file) => fd.append("multipleImages", file));

      if (editId) {
        await api.put(`/api/adventures/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Adventure updated!");
      } else {
        await api.post("/api/adventures/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Adventure created!");
      }
      setForm(defaultForm);
      setEditId(null);
      setShowForm(false);
      fetchAdventures();
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  const handleEdit = (adv) => {
    setEditId(adv._id);
    setShowForm(true);
    setForm({
      ...defaultForm,
      ...adv,
      ageRestriction: adv.ageRestriction || { minAge: "", maxAge: "" },
      requirements: adv.requirements || [""],
      schedule: adv.schedule || { startTime: "", endTime: "", daysAvailable: [] },
      discount: adv.discount || { isActive: false, percentage: "", validFrom: "", validUntil: "" },
      seatAvailability: adv.seatAvailability || {},
      image: null,
      multipleImages: [],
      category: adv.category,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this adventure?")) return;
    setError(""); setMsg(""); setLoading(true);
    try {
      await api.delete(`/api/adventures/${id}`);
      setMsg("Adventure deleted!");
      fetchAdventures();
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(defaultForm);
    setShowForm(false);
  };

  if (!user || (user.role !== "adventurer" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sojourn-gray text-lg">Access Denied</div>
          <div className="text-sojourn-gray/70 text-sm mt-2">You do not have permission to manage adventures.</div>
        </div>
      </div>
    );
  }

  const getCategoryName = (cat) => {
    if (!cat) return "";
    if (typeof cat === "object" && cat.name) return cat.name;
    if (typeof cat === "string") {
      const found = categories.find((c) => c._id === cat);
      return found ? found.name : cat;
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-semibold text-sojourn-green">Adventures</h1>
              <p className="text-sojourn-gray/70 text-sm mt-1">Manage your adventure offerings</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              + New Adventure
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Messages */}
        {msg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {msg}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Form Modal/Overlay */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold text-sojourn-green">
                    {editId ? "Edit Adventure" : "Create New Adventure"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="text-sojourn-gray hover:text-sojourn-green transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sojourn-green border-b border-gray-200 pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Adventure name"
                      required
                      className="form-input"
                    />
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Location"
                      required
                      className="form-input"
                    />
                    <input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="Duration (e.g., 3 days)"
                      required
                      className="form-input"
                    />
                    <select
                      name="difficulty"
                      value={form.difficulty}
                      onChange={handleChange}
                      required
                      className="form-input"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Price (₹)"
                      type="number"
                      required
                      className="form-input"
                    />
                    <select
                      name="category"
                      value={typeof form.category === "object" ? form.category._id : form.category}
                      onChange={handleChange}
                      required
                      className="form-input"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <input
                      name="maxParticipants"
                      value={form.maxParticipants}
                      onChange={handleChange}
                      placeholder="Max participants"
                      type="number"
                      required
                      className="form-input"
                    />
                    <input
                      name="requirements"
                      value={form.requirements.join(", ")}
                      onChange={handleChange}
                      placeholder="Requirements (comma separated)"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sojourn-green border-b border-gray-200 pb-2">Descriptions</h3>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short description"
                    required
                    rows="3"
                    className="form-input"
                  />
                  <textarea
                    name="detailedDescription"
                    value={form.detailedDescription}
                    onChange={handleChange}
                    placeholder="Detailed description"
                    required
                    rows="4"
                    className="form-input"
                  />
                  <textarea
                    name="safetyInstructions"
                    value={form.safetyInstructions}
                    onChange={handleChange}
                    placeholder="Safety instructions"
                    required
                    rows="3"
                    className="form-input"
                  />
                </div>

                {/* Age Restrictions */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sojourn-green border-b border-gray-200 pb-2">Age Restrictions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="ageRestriction.minAge"
                      value={form.ageRestriction.minAge}
                      onChange={handleChange}
                      placeholder="Minimum age"
                      type="number"
                      required
                      className="form-input"
                    />
                    <input
                      name="ageRestriction.maxAge"
                      value={form.ageRestriction.maxAge}
                      onChange={handleChange}
                      placeholder="Maximum age"
                      type="number"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sojourn-green border-b border-gray-200 pb-2">Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="schedule.startTime"
                      value={form.schedule.startTime}
                      onChange={handleChange}
                      placeholder="Start time (e.g., 08:00)"
                      required
                      className="form-input"
                    />
                    <input
                      name="schedule.endTime"
                      value={form.schedule.endTime}
                      onChange={handleChange}
                      placeholder="End time (e.g., 18:00)"
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sojourn-gray mb-2">Available Days</label>
                    <div className="flex flex-wrap gap-3">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.schedule.daysAvailable.includes(day)}
                            onChange={() => {
                              setForm((f) => ({
                                ...f,
                                schedule: {
                                  ...f.schedule,
                                  daysAvailable: f.schedule.daysAvailable.includes(day)
                                    ? f.schedule.daysAvailable.filter((d) => d !== day)
                                    : [...f.schedule.daysAvailable, day],
                                },
                              }));
                            }}
                            className="rounded border-gray-300 text-sojourn-green focus:ring-sojourn-green"
                          />
                          <span className="text-sm text-sojourn-gray">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Discount */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sojourn-green border-b border-gray-200 pb-2">Discount (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="discount.isActive"
                        checked={form.discount.isActive}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-sojourn-green focus:ring-sojourn-green"
                      />
                      <span className="text-sm text-sojourn-gray">Enable discount</span>
                    </label>
                    <input
                      name="discount.percentage"
                      value={form.discount.percentage}
                      onChange={handleChange}
                      placeholder="Discount percentage"
                      type="number"
                      className="form-input"
                      disabled={!form.discount.isActive}
                    />
                    <input
                      name="discount.validFrom"
                      value={form.discount.validFrom}
                      onChange={handleChange}
                      placeholder="Valid from"
                      type="date"
                      className="form-input"
                      disabled={!form.discount.isActive}
                    />
                    <input
                      name="discount.validUntil"
                      value={form.discount.validUntil}
                      onChange={handleChange}
                      placeholder="Valid until"
                      type="date"
                      className="form-input"
                      disabled={!form.discount.isActive}
                    />
                  </div>
                </div>

                {/* Seat Availability */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sojourn-green border-b border-gray-200 pb-2">Seat Availability</h3>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      id="seat-date"
                      className="form-input flex-1"
                      placeholder="Select date"
                    />
                    <button
                      type="button"
                      className="btn-secondary whitespace-nowrap"
                      onClick={() => {
                        const date = document.getElementById("seat-date").value;
                        addSeatDate(date);
                        document.getElementById("seat-date").value = "";
                      }}
                    >
                      Add Date
                    </button>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(form.seatAvailability).map((date) => (
                      <div key={date} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-sojourn-green">{date}</span>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700 text-sm"
                            onClick={() => removeSeatDate(date)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="number"
                            placeholder="Total seats"
                            value={form.seatAvailability[date]?.totalSeats || ""}
                            onChange={(e) => handleSeatAvailabilityChange(date, "totalSeats", e.target.value)}
                            className="form-input"
                          />
                          <input
                            type="number"
                            placeholder="Available seats"
                            value={form.seatAvailability[date]?.availableSeats || ""}
                            onChange={(e) => handleSeatAvailabilityChange(date, "availableSeats", e.target.value)}
                            className="form-input"
                          />
                          <input
                            type="number"
                            placeholder="Price (₹)"
                            value={form.seatAvailability[date]?.price || ""}
                            onChange={(e) => handleSeatAvailabilityChange(date, "price", e.target.value)}
                            className="form-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sojourn-green border-b border-gray-200 pb-2">Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sojourn-gray mb-2">Main Image</label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sojourn-gray mb-2">Additional Images (Max 5)</label>
                      <input
                        type="file"
                        name="multipleImages"
                        accept="image/*"
                        multiple
                        ref={multiFileInputRef}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : editId ? "Update Adventure" : "Create Adventure"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Adventures List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-display font-semibold text-sojourn-green">Your Adventures</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-sojourn-gray">Loading adventures...</div>
          ) : Array.isArray(adventures) && adventures.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sojourn-gray uppercase tracking-wider">Adventure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sojourn-gray uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sojourn-gray uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sojourn-gray uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sojourn-gray uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-sojourn-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adventures.map((adv) => (
                    <tr key={adv._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-sojourn-green">{adv.name}</div>
                        <div className="text-sm text-sojourn-gray truncate max-w-xs">{adv.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-sojourn-gray">{adv.location}</td>
                      <td className="px-6 py-4 text-sm font-medium text-sojourn-green">₹{adv.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          adv.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          adv.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          adv.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {adv.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-sojourn-gray">{getCategoryName(adv.category)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="text-sojourn-teal hover:text-sojourn-green text-sm font-medium"
                            onClick={() => handleEdit(adv)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                            onClick={() => handleDelete(adv._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-sojourn-gray mb-2">No adventures found</div>
              <button
                onClick={() => setShowForm(true)}
                className="text-sojourn-teal hover:text-sojourn-green text-sm font-medium"
              >
                Create your first adventure
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .form-input:focus {
          outline: none;
          border-color: #00796B;
          box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.1);
        }
        .form-input:disabled {
          background-color: #f9fafb;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default AdventuresPage;