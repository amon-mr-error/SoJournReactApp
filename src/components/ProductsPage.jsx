import React, { useEffect, useState, useRef } from "react";
import api, { handleApiError } from "../api";

const defaultForm = {
  name: "",
  description: "",
  detailedDescription: "",
  price: "",
  origin: "",
  usageInstructions: "",
  careInstructions: "",
  nutritionalInfo: "",
  category: "",
  stock: "",
  discountPercentage: "",
  discountValidFrom: "",
  discountValidUntil: "",
  image: null,
  multipleImages: [],
};

const ProductsPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Form state for create/edit
  const [form, setForm] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [multiImagePreviews, setMultiImagePreviews] = useState([]);
  const fileInputRef = useRef();
  const multiFileInputRef = useRef();

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(""); setMsg("");
    try {
      const res = await api.get("/api/localmarket/");
      setProducts(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/");
      setCategories(res.data);
    } catch {}
  };

  // Product details modal
  const openDetails = (product) => setSelected(product);
  const closeDetails = () => setSelected(null);

  // Edit modal logic
  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      detailedDescription: product.detailedDescription || "",
      price: (typeof product.price === "string" ? product.price.replace(/[^\d.]/g, "") : product.price) || "",
      origin: product.origin || "",
      usageInstructions: product.usageInstructions || "",
      careInstructions: product.careInstructions || "",
      nutritionalInfo: product.nutritionalInfo || "",
      category: product.category?.id || product.category || "",
      stock: product.stock || "",
      discountPercentage: product.discount?.percentage || "",
      discountValidFrom: product.discount?.validFrom ? product.discount.validFrom.slice(0,10) : "",
      discountValidUntil: product.discount?.validUntil ? product.discount.validUntil.slice(0,10) : "",
      image: null,
      multipleImages: [],
    });
    setImagePreview(product.image ? (product.image.startsWith("http") ? product.image : `/api/localmarket/image/${product.image}`) : null);
    setMultiImagePreviews(
      product.multipleImages
        ? product.multipleImages.map((img) =>
            img.startsWith("http") ? img : `/api/localmarket/image/${img}`
          )
        : []
    );
    setShowModal(true);
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(defaultForm);
    setImagePreview(null);
    setMultiImagePreviews([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditProduct(null);
    setForm(defaultForm);
    setImagePreview(null);
    setMultiImagePreviews([]);
    setShowModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (multiFileInputRef.current) multiFileInputRef.current.value = "";
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, image: files[0] }));
      setImagePreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (name === "multipleImages") {
      const filesArr = Array.from(files).slice(0, 5);
      setForm((f) => ({ ...f, multipleImages: filesArr }));
      setMultiImagePreviews(filesArr.map((file) => URL.createObjectURL(file)));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Create or update product
// ...existing code...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      const fd = new FormData();

      // Required fields
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", Number(form.price));
      fd.append("category", form.category);
      fd.append("stock", Number(form.stock));

      // Optional fields
      if (form.detailedDescription) fd.append("detailedDescription", form.detailedDescription);
      if (form.origin) fd.append("origin", form.origin);
      if (form.usageInstructions) fd.append("usageInstructions", form.usageInstructions);
      if (form.careInstructions) fd.append("careInstructions", form.careInstructions);
      if (form.nutritionalInfo) fd.append("nutritionalInfo", form.nutritionalInfo);

      // Image fields
      if (form.image) fd.append("image", form.image);
      if (form.multipleImages && form.multipleImages.length > 0) {
        form.multipleImages.forEach((file) => fd.append("multipleImages", file));
      }

      // Discount as JSON string if any discount field is present
      if (
        form.discountPercentage ||
        form.discountValidFrom ||
        form.discountValidUntil
      ) {
        fd.append(
          "discount",
          JSON.stringify({
            // isActive: !!form.discountPercentage,  
            percentage: Number(form.discountPercentage) || 0,
            validFrom: form.discountValidFrom ? new Date(form.discountValidFrom).toISOString() : undefined,
            validUntil: form.discountValidUntil ? new Date(form.discountValidUntil).toISOString() : undefined,
          })
        );
      }

      // Vendor (required)
      if (!editProduct) {
        fd.append("vendor", user.id || user._id);
      }

      let res;
      if (editProduct) {
        res = await api.put(`/api/localmarket/product/${editProduct.id || editProduct._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Product updated!");
      } else {
        res = await api.post("/api/localmarket/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Product created!");
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };
// ...existing code...

  // Delete product
  const handleDelete = async (id) => {
    setError(""); setMsg("");
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/localmarket/${id}`);
      setMsg("Product deleted!");
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Delete image
  const handleDeleteImage = async (filename) => {
    const filename1 = filename.split("/").pop();
    console.log("Deleting image with filename:", filename1);
    
    setError(""); setMsg("");
    try {
      await api.delete(`/api/localmarket/image/${filename1}`);
      setMsg("Image deleted!");
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Vendor can edit only their products
  const canEdit = (product) =>
    user.role === "admin" ||
    (user.role === "vendor" && product.vendor?.id === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your product inventory with ease
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {user.role === "vendor" && (
                <button 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  onClick={fetchProducts}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
                  </svg>
                  My Products
                </button>
              )}
              {user.role === "admin" && (
                <button 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  onClick={fetchProducts}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  All Products
                </button>
              )}
              {(user.role === "vendor" || user.role === "admin") && (
                <button 
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={openAdd}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {msg && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 font-medium">{msg}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !showModal && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p._id || p.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image.startsWith("http") ? p.image : `/api/localmarket/image/${p.image}`}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {p.discount?.isActive && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        {p.discount.percentage}% OFF
                      </span>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock > 10 ? 'bg-green-100 text-green-800' : p.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">{p.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{p.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-gray-900">₹{typeof p.price === "string" ? p.price.replace(/^₹+/, "") : p.price?.toLocaleString()}</span>
                      {p.discount?.isActive && (
                        <span className="text-xs text-gray-500">Valid until {p.discount.validUntil?.slice(0,10)}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">{p.category?.name}</div>
                      {p.rating && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-gray-600">{p.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                      onClick={() => openDetails(p)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    
                    {canEdit(p) && (
                      <>
                        <button 
                          className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                          onClick={() => openEdit(p)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        
                        <button 
                          className="bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                          onClick={() => handleDelete(p._id || p.id)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                        
                        {p.image && (
                          <button 
                            className="bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center"
                            onClick={() => handleDeleteImage(p.image)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Del Img
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Get started by adding your first product.</p>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={closeDetails}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {selected.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={selected.image.startsWith("http") ? selected.image : `/api/localmarket/image/${selected.image}`}
                      alt={selected.name}
                      className="w-full md:w-48 h-48 object-cover rounded-xl shadow-md"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.name}</h2>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl font-bold text-blue-600">₹{typeof selected.price === "string" ? selected.price.replace(/^₹+/, "") : selected.price?.toLocaleString()}</span>
                    {selected.discount?.isActive && (
                      <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {selected.discount.percentage}% OFF until {selected.discount.validUntil?.slice(0,10)}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600">Category</span>
                      <p className="font-semibold text-gray-900">{selected.category?.name}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600">Stock</span>
                      <p className="font-semibold text-gray-900">{selected.stock}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600">Rating</span>
                      <p className="font-semibold text-gray-900">{selected.rating ?? "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600">Vendor</span>
                      <p className="font-semibold text-gray-900">{selected.vendor?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selected.description}</p>
                </div>

                {selected.detailedDescription && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Detailed Description</h4>
                    <p className="text-gray-700">{selected.detailedDescription}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {selected.origin && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Origin</h4>
                      <p className="text-gray-700">{selected.origin}</p>
                    </div>
                  )}

                  {selected.usageInstructions && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Usage Instructions</h4>
                      <p className="text-gray-700">{selected.usageInstructions}</p>
                    </div>
                  )}

                  {selected.careInstructions && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
                      <p className="text-gray-700">{selected.careInstructions}</p>
                    </div>
                  )}

                  {selected.nutritionalInfo && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Nutritional Information</h4>
                      <p className="text-gray-700">{selected.nutritionalInfo}</p>
                    </div>
                  )}
                </div>

                {selected.multipleImages && selected.multipleImages.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Images</h4>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {selected.multipleImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.startsWith("http") ? img : `/api/localmarket/image/${img}`}
                          alt={`Additional ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Vendor Information</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700">{selected.vendor?.name}</p>
                    <p className="text-gray-600 text-sm">{selected.vendor?.mobile}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={closeModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={form.name} 
                      onChange={handleFormChange} 
                      placeholder="Enter product name" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                    <input 
                      type="text" 
                      name="description" 
                      value={form.description} 
                      onChange={handleFormChange} 
                      placeholder="Brief product description" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                    <textarea 
                      name="detailedDescription" 
                      value={form.detailedDescription} 
                      onChange={handleFormChange} 
                      placeholder="Detailed product information" 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                      <input 
                        type="number" 
                        name="price" 
                        value={form.price} 
                        onChange={handleFormChange} 
                        placeholder="0.00" 
                        required 
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                      <input 
                        type="number" 
                        name="stock" 
                        value={form.stock} 
                        onChange={handleFormChange} 
                        placeholder="0" 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select 
                      name="category" 
                      value={form.category} 
                      onChange={handleFormChange} 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                    <input 
                      type="text" 
                      name="origin" 
                      value={form.origin} 
                      onChange={handleFormChange} 
                      placeholder="Product origin/source" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Instructions</label>
                    <textarea 
                      name="usageInstructions" 
                      value={form.usageInstructions} 
                      onChange={handleFormChange} 
                      placeholder="How to use this product" 
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
                    <textarea 
                      name="careInstructions" 
                      value={form.careInstructions} 
                      onChange={handleFormChange} 
                      placeholder="How to care for this product" 
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nutritional Information</label>
                    <textarea 
                      name="nutritionalInfo" 
                      value={form.nutritionalInfo} 
                      onChange={handleFormChange} 
                      placeholder="Nutritional details (if applicable)" 
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Discount Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Discount Settings</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Discount %</label>
                        <input 
                          type="number" 
                          name="discountPercentage" 
                          value={form.discountPercentage} 
                          onChange={handleFormChange} 
                          placeholder="0" 
                          min={0} 
                          max={100}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Valid From</label>
                        <input 
                          type="date" 
                          name="discountValidFrom" 
                          value={form.discountValidFrom} 
                          onChange={handleFormChange} 
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Valid Until</label>
                        <input 
                          type="date" 
                          name="discountValidUntil" 
                          value={form.discountValidUntil} 
                          onChange={handleFormChange} 
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image</label>
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFormChange} 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="mt-3">
                          <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg shadow-md object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (Max 5)</label>
                      <input 
                        type="file" 
                        name="multipleImages" 
                        accept="image/*" 
                        multiple 
                        ref={multiFileInputRef} 
                        onChange={handleFormChange} 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {multiImagePreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-5 gap-2">
                          {multiImagePreviews.map((src, idx) => (
                            <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-16 h-16 rounded-lg shadow-md object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? "Saving..." : (editProduct ? "Update Product" : "Create Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;