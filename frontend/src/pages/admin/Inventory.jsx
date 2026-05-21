import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Edit, X, Image as ImageIcon, Search, Filter, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // 👉 Added this! (Adjust path if needed based on your folder structure)

export default function Inventory() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👉 NEW: variants array replaces the flat price/mrp/stock
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', isNewLaunch: false, isOutOfStock: false,
    variants: [{ size: '', price: '', mrp: '' }]
  });
  const [imageFile, setImageFile] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to connect to database");
    } finally {
      setLoading(false);
    }
  };

  const baseCategories = ["Milk", "Ghee & Butter", "Curd & Buttermilk", "Paneer & Khawa", "Shrikhand & Desserts", "Sweets & Mithai", "Farsan & Snacks", "Dry Fruits & Gifting", "Ready to Cook", "Other"];
  const categories = ["All", ...new Set([...baseCategories, ...products.map(p => p.category)])];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const initiateDelete = (id) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      // 👉 Attached Token Here
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/products/${productToDelete}`, config);
      setProducts(products.filter(p => p._id !== productToDelete));
      toast.success("Product deleted successfully", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const toggleStockStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setProducts(products.map(p => p._id === id ? { ...p, isOutOfStock: newStatus } : p));
    try {
      // 👉 Attached Token Here
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/products/${id}`, { isOutOfStock: newStatus }, config);
      toast.success(newStatus ? 'Marked as Out of Stock' : 'Product is back In Stock!');
    } catch (error) {
      toast.error("Failed to update status");
      fetchProducts();
    }
  };

  // --- DYNAMIC VARIANT HANDLERS ---
  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size: '', price: '', mrp: '' }] });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleEdit = (product) => {
    // Backwards compatibility for older products in DB
    const loadedVariants = product.variants && product.variants.length > 0
      ? product.variants
      : [{ size: product.stock || '', price: product.price || '', mrp: product.mrp || '' }];

    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      isNewLaunch: product.isNewLaunch || false,
      isOutOfStock: product.isOutOfStock || false,
      variants: loadedVariants
    });
    setImageFile(null);
    setEditingId(product._id);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submitData = new FormData();

    // Add all normal fields, but stringify the variants array!
    Object.keys(formData).forEach(key => {
      if (key === 'variants') {
        submitData.append('variants', JSON.stringify(formData.variants));
      } else {
        submitData.append(key, formData[key]);
      }
    });
    if (imageFile) submitData.append('image', imageFile);

    try {
      // 👉 Attached Token Here
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      if (editingId) {
        const response = await axios.put(`http://localhost:5000/api/products/${editingId}`, submitData, config);
        setProducts(products.map(p => p._id === editingId ? response.data : p));
        toast.success("Product updated!");
      } else {
        const response = await axios.post('http://localhost:5000/api/products', submitData, config);
        setProducts([response.data, ...products]);
        toast.success("Product added!");
      }
      closeForm();
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: '', category: '', description: '', isNewLaunch: false, isOutOfStock: false,
      variants: [{ size: '', price: '', mrp: '' }]
    });
    setImageFile(null);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 px-4">

      {/* HEADER & FILTER BARS (Unchanged) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 mt-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Manage {products.length} farm-fresh products.</p>
        </div>
        <button onClick={() => { closeForm(); setIsFormOpen(true); }} className="w-full md:w-auto bg-brand text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2">
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search by product name..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand/30 outline-none transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand/30 outline-none transition-all shadow-sm font-bold text-gray-700" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* DYNAMIC FORM */}
      {isFormOpen && (
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-brand/10 mb-10 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-gray-900">{editingId ? "Edit Product" : "Create New Product"}</h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand/30" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Shrikhand" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <input required type="text" list="category-options" placeholder="Select or type new..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand/30 font-medium text-gray-700" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                <datalist id="category-options">{categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat} />)}</datalist>
              </div>
            </div>

            {/* 👉 THE NEW VARIANTS BUILDER */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-gray-900 text-lg">Product Sizes & Pricing</h3>
                <button type="button" onClick={addVariant} className="text-sm font-bold text-brand flex items-center gap-1 hover:text-brand-dark bg-white px-3 py-1.5 rounded-lg shadow-sm border border-brand/20">
                  <PlusCircle size={16} /> Add Another Size
                </button>
              </div>

              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
                    <div className="w-full md:w-1/3">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Size / Quantity</label>
                      <input required type="text" placeholder="e.g. 100g, 500ml, 1 Box" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-brand/30 font-medium" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} />
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Selling Price (₹)</label>
                      <input required type="number" className="w-full bg-gray-50 border border-brand/30 rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-brand font-bold text-brand-dark" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} />
                    </div>
                    <div className="w-full md:w-1/3 relative">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Original MRP (₹)</label>
                      <input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-gray-300 text-gray-500 line-through" value={variant.mrp} onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)} />

                      {formData.variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(index)} className="absolute -right-2 -top-2 md:-right-8 md:top-1/2 md:-translate-y-1/2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-sm">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-xl hover:bg-brand/5 transition-all w-full border border-gray-100 hover:border-brand/20 bg-gray-50">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${formData.isNewLaunch ? 'bg-brand border-brand' : 'bg-white border-gray-300 group-hover:border-brand/50'}`}>
                  <input type="checkbox" className="hidden" checked={formData.isNewLaunch} onChange={(e) => setFormData({ ...formData, isNewLaunch: e.target.checked })} />
                  {formData.isNewLaunch && <svg className="w-4 h-4 text-white animate-in zoom-in duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">New Launch</span>
                  <span className="text-xs text-gray-500 font-medium">Add a 🚀 badge to this item</span>
                </div>
              </label>

              <label className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-brand/50 transition-all cursor-pointer group w-full h-full">
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
                <div className="flex items-center gap-3 pointer-events-none">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-400 group-hover:text-brand transition-all"><ImageIcon size={20} /></div>
                  <p className="font-bold text-gray-700 text-sm truncate max-w-[150px]">{imageFile ? imageFile.name : "Upload Product Image"}</p>
                </div>
              </label>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 mt-4 bg-brand text-white rounded-xl font-black text-lg shadow-lg hover:bg-brand-dark hover:-translate-y-0.5 active:scale-95 transition-all">
              {isSubmitting ? "Processing..." : editingId ? "Update Product" : "Save Product"}
            </button>
          </form>
        </div>
      )}

      {/* INVENTORY TABLE - Updated to show variants! */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-black">
                <th className="p-5">Product</th>
                <th className="p-5">Category</th>
                <th className="p-5">Sizes Available</th>
                <th className="p-5">Price Range</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-400 font-bold animate-pulse">Loading Inventory...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-500">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => {

                  // 👉 THE INFINITY FIX: Extremely safe fallback logic
                  let sizes = product.stock || '-';
                  let lowestPrice = product.price || 0;
                  let hasMultiple = false;

                  if (product.variants && product.variants.length > 0) {
                    // Extract valid prices and find the minimum safely
                    const validPrices = product.variants.map(v => Number(v.price)).filter(p => !isNaN(p) && p > 0);
                    if (validPrices.length > 0) {
                      lowestPrice = Math.min(...validPrices);
                    }

                    // Extract valid sizes safely
                    const validSizes = product.variants.map(v => v.size).filter(Boolean);
                    if (validSizes.length > 0) {
                      sizes = validSizes.join(", ");
                    }

                    hasMultiple = product.variants.length > 1;
                  }

                  return (
                    <tr key={product._id} className={`hover:bg-[#FDFBF7] transition-colors group ${product.isOutOfStock ? 'opacity-70' : ''}`}>
                      <td className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center relative shrink-0">
                          {product.isNewLaunch && <div className="absolute -top-1 -right-1 bg-brand text-white text-[8px] px-1.5 rounded-full z-10">🚀</div>}
                          {product.image ? <img src={product.image} className="w-full h-full object-cover" alt={product.name} /> : <span className="text-xl">🥛</span>}
                        </div>
                        <span className="font-bold text-gray-900">{product.name}</span>
                      </td>
                      <td className="p-5"><span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">{product.category}</span></td>
                      <td className="p-5 font-bold text-gray-600 text-sm max-w-[150px] truncate" title={sizes}>{sizes}</td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          {hasMultiple && <span className="text-gray-400 text-xs font-bold">Starts at</span>}
                          <span className="text-brand-dark font-black text-lg">₹{lowestPrice}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <button onClick={() => toggleStockStatus(product._id, product.isOutOfStock)} className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase border transition-all ${product.isOutOfStock ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                          {product.isOutOfStock ? 'Sold Out' : 'In Stock'}
                        </button>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"><Edit size={18} /></button>
                          <button onClick={() => initiateDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOM DELETE MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
            <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-center mb-8">Are you sure you want to delete this item? It will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}