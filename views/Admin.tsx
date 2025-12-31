import React, { useState, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product, ProductVariant } from '../types';
import { Plus, Trash2, Package, Image as ImageIcon, Box, Tag, Upload, X as XIcon, PenSquare, RotateCcw, Sparkles, Loader2, Settings, Save, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const Admin: React.FC = () => {
  const { products, categories, addProduct, deleteProduct, updateProduct, addCategory, availableSizes, addAvailableSize, settings, updateSettings, dataSource, setDataSource } = useProducts();
  
  // State for image handling
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for new category
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // State for new global size
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [newSizeName, setNewSizeName] = useState('');

  // State for Variant Management
  const [selectedVariantSize, setSelectedVariantSize] = useState<string>('');
  const [variantStock, setVariantStock] = useState<string>('10');
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // State for Settings
  const [tempSettings, setTempSettings] = useState(settings);

  // Editing State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    subtitle: string;
    description: string;
    price: string;
    category: string;
    colorHex: string;
    isNew: boolean;
  }>({
    name: '',
    subtitle: '',
    description: '',
    price: '',
    category: categories[0] || 'Crew',
    colorHex: '#FFD166',
    isNew: true
  });

  const handleAddImage = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault(); 
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages([...images, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGeneration = async () => {
    if (!formData.name) {
      alert("Please enter a Product Name first so the AI knows what to generate!");
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Professional product photography of ${formData.name}. ${formData.description}. High quality, studio lighting, minimal, isolated on white background, 4k resolution.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      if (response.candidates?.[0]?.content?.parts) {
        let foundImage = false;
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64 = part.inlineData.data;
            const mime = part.inlineData.mimeType;
            const imgUrl = `data:${mime};base64,${base64}`;
            setImages(prev => [...prev, imgUrl]);
            foundImage = true;
          }
        }
        if (!foundImage) {
           alert("AI generated text instead of an image. Please try again.");
        }
      }
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate image. Please check your API key configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddNewCategory = () => {
     if(newCategoryName.trim()) {
       addCategory(newCategoryName);
       setFormData({...formData, category: newCategoryName});
       setIsAddingCategory(false);
       setNewCategoryName('');
     }
  };

  const handleAddNewSize = () => {
     if(newSizeName.trim()) {
       addAvailableSize(newSizeName);
       setSelectedVariantSize(newSizeName.trim()); // Auto select
       setIsAddingSize(false);
       setNewSizeName('');
     }
  };

  // Add a size+stock pair to the product
  const handleAddVariant = () => {
    if (!selectedVariantSize) {
      alert("Please select a size first");
      return;
    }
    const stock = parseInt(variantStock);
    if (isNaN(stock) || stock < 0) {
      alert("Please enter a valid stock quantity");
      return;
    }

    // Check if variant exists
    const existingIndex = variants.findIndex(v => v.size === selectedVariantSize);
    if (existingIndex >= 0) {
      // Update existing
      const updated = [...variants];
      updated[existingIndex].stock = stock;
      setVariants(updated);
    } else {
      // Add new
      setVariants([...variants, { size: selectedVariantSize, stock }]);
    }
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleEditProduct = (product: Product) => {
    if (dataSource === 'wordpress') {
      alert("Please edit this product in your WordPress Dashboard.");
      return;
    }
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      subtitle: product.subtitle,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      colorHex: product.colorHex || '#FFD166',
      isNew: product.isNew || false
    });
    setImages(product.images);
    setVariants(product.variants);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormData({
       name: '',
       subtitle: '',
       description: '',
       price: '',
       category: categories[0] || 'Crew',
       colorHex: '#FFD166',
       isNew: true
    });
    setImages([]);
    setImageUrlInput('');
    setVariants([]);
    setSelectedVariantSize('');
    setVariantStock('10');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(dataSource === 'wordpress') return;

    if (variants.length === 0) {
      alert("Please add at least one size variant with stock.");
      return;
    }

    let finalImages = [...images];
    if (imageUrlInput.trim()) {
        finalImages.push(imageUrlInput.trim());
    }
    if (finalImages.length === 0) {
        finalImages = ['https://images.unsplash.com/photo-1586350971171-84552199db3e?q=80&w=1000&auto=format&fit=crop'];
    }

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formData.name,
        subtitle: formData.subtitle,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        images: finalImages,
        isNew: formData.isNew,
        colorHex: formData.colorHex,
        stock: totalStock,
        variants: variants,
      });
      alert('Product updated successfully!');
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        subtitle: formData.subtitle,
        description: formData.description,
        price: Number(formData.price),
        currency: 'INR',
        category: formData.category,
        images: finalImages,
        tags: ['New Arrival'],
        isNew: formData.isNew,
        colorHex: formData.colorHex,
        stock: totalStock,
        variants: variants
      };
      addProduct(newProduct);
      alert('Product added successfully!');
    }
    
    resetForm();
  };

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    alert("Store settings saved!");
  };

  return (
    <div className="min-h-screen bg-funky-light animate-fade-in pb-20">
      
      {/* WordPress Mode Banner */}
      {dataSource === 'wordpress' && (
        <div className="bg-funky-blue text-white p-4 text-center font-bold sticky top-20 z-50 shadow-lg">
          <Globe className="inline-block mr-2" /> 
          WORDPRESS MODE ACTIVE: Products are managed in your <a href="#" className="underline text-funky-yellow">WordPress Admin Dashboard</a>. This local admin is read-only.
        </div>
      )}

      <div className="bg-funky-dark text-white py-12 px-6 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
             <div>
                <h1 className="font-heading font-black text-4xl mb-2">BACKSTAGE PASS 🎸</h1>
                <p className="opacity-80 font-mono">Manage your inventory and drop new styles.</p>
             </div>
             <Link to="/" className="px-6 py-3 border-2 border-white/20 rounded-xl hover:bg-white hover:text-funky-dark transition-all font-bold">
               Back to Store
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Settings & Add Form */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Data Source Toggle */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100">
             <h2 className="font-heading font-black text-xl mb-4 text-funky-dark">DATA SOURCE</h2>
             <div className="flex gap-2 bg-funky-light p-1 rounded-xl">
                <button 
                  onClick={() => setDataSource('local')}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${dataSource === 'local' ? 'bg-white shadow-sm text-funky-dark' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Local
                </button>
                <button 
                  onClick={() => setDataSource('wordpress')}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${dataSource === 'wordpress' ? 'bg-funky-blue text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  WordPress
                </button>
             </div>
             <p className="text-xs text-gray-400 mt-2 px-1">
               Switch to 'WordPress' to fetch products from your WooCommerce site (requires configuration in code).
             </p>
          </div>

          {/* Store Settings Card */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100">
             <h2 className="font-heading font-black text-xl mb-4 flex items-center gap-2 text-funky-dark">
               <Settings size={24} className="text-gray-400"/> GLOBAL SETTINGS
             </h2>
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Free Shipping Above (INR)</label>
                   <input 
                      type="number"
                      value={tempSettings.freeShippingThreshold}
                      onChange={e => setTempSettings({...tempSettings, freeShippingThreshold: Number(e.target.value)})}
                      className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-3 py-2 text-sm font-mono font-bold"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Shipping Fee (INR)</label>
                   <input 
                      type="number"
                      value={tempSettings.shippingFee}
                      onChange={e => setTempSettings({...tempSettings, shippingFee: Number(e.target.value)})}
                      className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-3 py-2 text-sm font-mono font-bold"
                   />
                </div>
                <button 
                  onClick={handleSaveSettings}
                  className="w-full py-2 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-funky-green transition-colors flex items-center justify-center gap-2"
                >
                   <Save size={16} /> SAVE SETTINGS
                </button>
             </div>
          </div>

          {/* Add/Edit Product Form (Disabled in WP Mode) */}
          <div className={`bg-white p-8 rounded-3xl shadow-xl border-2 sticky top-24 ${editingProductId ? 'border-funky-blue ring-4 ring-funky-blue/10' : 'border-gray-100'} ${dataSource === 'wordpress' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            <h2 className={`font-heading font-black text-2xl mb-6 flex items-center gap-2 ${editingProductId ? 'text-funky-blue' : 'text-funky-dark'}`}>
              {editingProductId ? (
                 <><PenSquare className="bg-funky-blue text-white rounded-md p-1" size={28} /> EDITING PRODUCT</>
              ) : (
                 <><Plus className="bg-funky-yellow rounded-full p-1 text-funky-dark" size={28} /> ADD NEW DROP</>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Product Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-bold text-funky-dark outline-none transition-colors"
                  placeholder="e.g. Cosmic Toes"
                />
              </div>

              {/* ... (Rest of the form remains mostly the same, just visually suppressed by parent opacity) ... */}
              {/* Shortened for brevity in XML output since main change is the wrapping div class */}
               <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle</label>
                <input 
                  required
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 text-sm"
                  placeholder="e.g. Space Series"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price (INR)</label>
                <input 
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-mono"
                  placeholder="399"
                />
              </div>

              {/* INVENTORY & VARIANTS SECTION */}
              <div className="bg-funky-light/50 p-4 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold uppercase text-funky-dark mb-2">Inventory by Size</label>
                
                {/* Size Creator */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">1. Select Size</span>
                    {!isAddingSize && (
                      <button 
                          type="button" 
                          onClick={() => setIsAddingSize(true)}
                          className="text-[10px] font-bold text-funky-blue hover:underline uppercase"
                      >
                          + Create New Size
                      </button>
                    )}
                </div>

                {isAddingSize && (
                    <div className="flex gap-2 animate-fade-in mb-3">
                      <input 
                          type="text" 
                          value={newSizeName}
                          onChange={e => setNewSizeName(e.target.value)}
                          className="flex-1 bg-white border-2 border-funky-blue rounded-lg px-2 py-1 text-sm outline-none"
                          placeholder="New Size (e.g. XL)"
                          autoFocus
                      />
                      <button 
                          type="button"
                          onClick={handleAddNewSize}
                          className="bg-funky-blue text-white px-3 rounded-lg font-bold text-xs"
                      >
                          OK
                      </button>
                      <button 
                          type="button"
                          onClick={() => setIsAddingSize(false)}
                          className="bg-gray-200 text-gray-600 px-2 rounded-lg"
                      >
                          <XIcon size={14} />
                      </button>
                    </div>
                )}

                {/* Variant Adder Inputs */}
                <div className="flex gap-2 mb-4">
                  <select 
                    value={selectedVariantSize}
                    onChange={e => setSelectedVariantSize(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="">-- Size --</option>
                    {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input 
                    type="number"
                    value={variantStock}
                    onChange={e => setVariantStock(e.target.value)}
                    className="w-20 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-center"
                    placeholder="Qty"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddVariant}
                    className="bg-funky-dark text-white px-3 rounded-xl hover:bg-funky-pink transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Added Variants List */}
                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-funky-dark text-sm">{v.size}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="font-mono text-xs font-bold text-funky-blue">{v.stock} in stock</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {variants.length === 0 && (
                    <p className="text-xs text-center text-gray-400 italic">No inventory added yet.</p>
                  )}
                </div>
              </div>

               {/* Category Selection */}
               <div>
                  <div className="flex justify-between items-center mb-1">
                     <label className="block text-xs font-bold uppercase text-gray-500">Category</label>
                     {!isAddingCategory && (
                        <button 
                           type="button" 
                           onClick={() => setIsAddingCategory(true)}
                           className="text-[10px] font-bold text-funky-blue hover:underline uppercase"
                        >
                           + Create New
                        </button>
                     )}
                  </div>
                  
                  {isAddingCategory ? (
                     <div className="flex gap-2 animate-fade-in">
                        <input 
                           type="text" 
                           value={newCategoryName}
                           onChange={e => setNewCategoryName(e.target.value)}
                           className="flex-1 bg-white border-2 border-funky-blue rounded-xl px-3 py-2 text-sm outline-none"
                           placeholder="New Category Name"
                           autoFocus
                        />
                        <button 
                           type="button"
                           onClick={handleAddNewCategory}
                           className="bg-funky-blue text-white px-3 rounded-xl font-bold text-sm"
                        >
                           OK
                        </button>
                        <button 
                           type="button"
                           onClick={() => setIsAddingCategory(false)}
                           className="bg-gray-200 text-gray-600 px-3 rounded-xl font-bold text-sm"
                        >
                           X
                        </button>
                     </div>
                  ) : (
                     <div className="relative">
                        <Tag size={18} className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" />
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl pl-10 pr-4 py-3 text-sm appearance-none cursor-pointer"
                        >
                          {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                     </div>
                  )}
                </div>

              {/* Multi-Image Input Section */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Product Images</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon size={18} className="absolute left-4 top-3.5 text-gray-400" />
                      <input 
                        value={imageUrlInput}
                        onChange={e => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImage(e);
                          }
                        }}
                        className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl pl-11 pr-4 py-3 text-sm"
                        placeholder="Paste URL or upload"
                      />
                    </div>
                    <button 
                      onClick={handleAddImage}
                      type="button"
                      className="bg-funky-light text-funky-dark border-2 border-funky-dark/10 w-12 rounded-xl hover:bg-funky-blue hover:text-white hover:border-funky-blue transition-colors flex items-center justify-center"
                      title="Add URL"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                     <button
                        type="button"
                        onClick={handleAiGeneration}
                        disabled={isGenerating}
                        className="flex-1 py-2 bg-gradient-to-r from-funky-pink to-funky-yellow text-white font-bold text-sm rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                       {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                       {isGenerating ? "Creating..." : "AI Generate"}
                     </button>
                     <input 
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       ref={fileInputRef} 
                       onChange={handleFileUpload}
                     />
                     <button
                       type="button"
                       onClick={triggerFileInput}
                       className="flex-1 py-2 bg-gray-100 text-gray-600 font-bold text-sm rounded-xl border-2 border-dashed border-gray-300 hover:bg-white hover:border-funky-blue hover:text-funky-blue transition-all flex items-center justify-center gap-2"
                     >
                       <Upload size={16} /> Upload
                     </button>
                  </div>
                </div>

                {images.length > 0 ? (
                   <div className="grid grid-cols-4 gap-2 mt-4">
                     {images.map((img, idx) => (
                       <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border-2 border-gray-100 bg-white shadow-sm">
                         <img src={img} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                         <button
                           type="button"
                           onClick={() => removeImage(idx)}
                           className="absolute inset-0 bg-funky-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white hover:text-funky-pink"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                     ))}
                   </div>
                ) : (
                  <p className="text-xs text-gray-400 italic mt-2 text-center">No images added yet.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Accent Color</label>
                    <div className="flex items-center gap-2 bg-funky-light p-2 rounded-xl">
                      <input 
                        type="color" 
                        value={formData.colorHex}
                        onChange={e => setFormData({...formData, colorHex: e.target.value})}
                        className="w-8 h-8 rounded cursor-pointer border-none p-0"
                      />
                      <span className="text-xs font-mono text-gray-500">{formData.colorHex}</span>
                    </div>
                 </div>
                 <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={e => setFormData({...formData, isNew: e.target.checked})}
                        className="w-5 h-5 accent-funky-green rounded"
                      />
                      <span className="text-sm font-bold text-funky-dark">Mark as New?</span>
                    </label>
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 text-sm min-h-[100px]"
                  placeholder="Describe the funkiness..."
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className={`flex-1 py-4 text-white font-heading font-black rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${editingProductId ? 'bg-funky-blue' : 'bg-funky-dark hover:bg-funky-pink'}`}>
                  {editingProductId ? 'UPDATE PRODUCT' : 'LAUNCH PRODUCT'}
                </button>
                
                {editingProductId && (
                   <button 
                     type="button" 
                     onClick={resetForm}
                     className="px-4 bg-gray-200 text-gray-600 rounded-xl hover:bg-red-100 hover:text-red-500 transition-colors"
                     title="Cancel Edit"
                   >
                     <RotateCcw size={24} />
                   </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="font-heading font-black text-2xl text-funky-dark flex items-center gap-2">
              <Package className="text-funky-blue" /> CURRENT INVENTORY ({products.length})
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {products.map(product => (
               <div key={product.id} className={`bg-white p-4 rounded-2xl shadow-sm border flex gap-4 group transition-all ${editingProductId === product.id ? 'border-funky-blue ring-2 ring-funky-blue/20 bg-blue-50/50' : 'border-gray-100 hover:border-funky-dark/20'}`}>
                  <div className="w-20 h-20 rounded-xl bg-funky-light overflow-hidden flex-shrink-0 relative">
                     <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                     {product.isNew && <div className="absolute top-0 right-0 w-3 h-3 bg-funky-pink rounded-bl-lg"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading font-bold text-funky-dark truncate">{product.name}</h3>
                      
                      <div className="flex gap-2">
                         <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-gray-300 hover:text-funky-blue transition-colors"
                            title="Edit"
                         >
                            <PenSquare size={16} />
                         </button>
                         <button 
                            onClick={() => {
                              if(window.confirm('Are you sure you want to delete this product?')) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Delete"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{product.subtitle}</p>
                    
                    <div className="mt-2 text-xs">
                        <div className="flex flex-wrap gap-1">
                            {product.variants.map((v, i) => (
                                <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                                    {v.size}: {v.stock}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-xs font-bold bg-funky-light px-2 py-1 rounded-md text-funky-dark/70">{product.category}</span>
                       
                       {/* Total Stock Badge */}
                       <div className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
                          product.stock === 0 
                            ? 'bg-red-50 border-red-100 text-red-600' 
                            : product.stock < 10 
                              ? 'bg-yellow-50 border-yellow-100 text-yellow-700' 
                              : 'bg-green-50 border-green-100 text-green-700'
                       }`}>
                          <Box size={12} />
                          <span className="text-xs font-bold font-mono">
                            {product.stock === 0 ? 'TOTAL: 0' : `TOTAL: ${product.stock}`}
                          </span>
                       </div>

                       <div className="w-3 h-3 rounded-full ml-auto border border-black/10" style={{ backgroundColor: product.colorHex }}></div>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;