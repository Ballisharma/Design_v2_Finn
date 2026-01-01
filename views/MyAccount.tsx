import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { fetchCustomerOrders, updateCustomerProfile } from '../utils/wordpress';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, Clock, LogOut, MapPin, ShoppingBag, AlertCircle, RefreshCw, HelpCircle, ExternalLink, ChevronRight, User, Edit2, Save, X } from 'lucide-react';

const MyAccount: React.FC = () => {
   const { user, logout, isAuthenticated, refreshUser } = useUser();
   const navigate = useNavigate();
   const [orders, setOrders] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isEditingProfile, setIsEditingProfile] = useState(false);
   const [profileData, setProfileData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_1: '',
      city: '',
      state: '',
      postcode: ''
   });
   const [isSavingProfile, setIsSavingProfile] = useState(false);
   const [profileError, setProfileError] = useState('');

   useEffect(() => {
      if (!isAuthenticated) {
         navigate('/login');
         return;
      }

      const loadOrders = async () => {
         if (user?.id) {
            setIsLoading(true);
            const data = await fetchCustomerOrders(user.id);
            setOrders(data);
            setIsLoading(false);
         }
      };

      loadOrders();
   }, [isAuthenticated, user, navigate]);

   // Initialize profile data when user changes
   useEffect(() => {
      if (user) {
         setProfileData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone: user.billing?.phone || '',
            address_1: user.billing?.address_1 || '',
            city: user.billing?.city || '',
            state: user.billing?.state || '',
            postcode: user.billing?.postcode || ''
         });
      }
   }, [user]);

   const handleSaveProfile = async () => {
      if (!user?.id) return;

      setIsSavingProfile(true);
      setProfileError('');

      try {
         await updateCustomerProfile(user.id, {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            billing: {
               first_name: profileData.first_name,
               last_name: profileData.last_name,
               phone: profileData.phone,
               address_1: profileData.address_1,
               city: profileData.city,
               state: profileData.state,
               postcode: profileData.postcode,
               country: 'IN'
            }
         });

         // Refresh user data
         await refreshUser();
         setIsEditingProfile(false);
         alert('Profile updated successfully!');
      } catch (error: any) {
         setProfileError(error.message || 'Failed to update profile. Please try again.');
      } finally {
         setIsSavingProfile(false);
      }
   };

   const handleLogout = () => {
      logout();
      navigate('/');
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'completed': return 'bg-green-100 text-green-700 border-green-200';
         case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
         case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
         case 'refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
         case 'failed': return 'bg-red-100 text-red-700 border-red-200';
         default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
   };

   if (!user) return null;

   return (
      <div className="min-h-screen bg-funky-light pt-28 pb-20 px-6 animate-fade-in">
         <div className="max-w-6xl mx-auto">

            {/* Profile Header */}
            <div className="bg-funky-dark rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-funky-blue rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>

               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-funky-yellow">
                     <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                     <h1 className="font-heading font-black text-3xl md:text-5xl mb-2">HELLO, {user.first_name.toUpperCase()}! 👋</h1>
                     <p className="font-mono opacity-60 text-sm md:text-base">{user.email} • Joined {new Date().getFullYear()}</p>
                  </div>
                  <button
                     onClick={handleLogout}
                     className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
                  >
                     <LogOut size={16} /> Log Out
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

               {/* Sidebar Nav */}
               <div className="lg:col-span-1">
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
                     <h3 className="font-heading font-black text-xl text-funky-dark mb-4 uppercase tracking-tight text-center lg:text-left">ACCOUNT</h3>
                     <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all mb-2"
                     >
                        <User size={20} /> {isEditingProfile ? 'View Orders' : 'Edit Profile'}
                     </button>
                     <div className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold bg-funky-light text-funky-dark mb-2">
                        <Package size={20} /> My Orders
                     </div>
                     <Link to="/shop" className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all mb-2">
                        <ShoppingBag size={20} /> Shop More
                     </Link>
                  </div>
               </div>

               <div className="lg:col-span-3 space-y-8">
                  {isEditingProfile ? (
                     <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="font-heading font-black text-2xl text-funky-dark flex items-center gap-2">
                              <User className="text-funky-blue" /> EDIT PROFILE
                           </h2>
                           <button
                              onClick={() => setIsEditingProfile(false)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                           >
                              <X size={20} />
                           </button>
                        </div>

                        {profileError && (
                           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                              <p className="text-red-600 text-sm font-bold">{profileError}</p>
                           </div>
                        )}

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-xs font-bold uppercase text-gray-400 mb-2">First Name</label>
                                 <input
                                    type="text"
                                    value={profileData.first_name}
                                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                    className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors"
                                    required
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Last Name</label>
                                 <input
                                    type="text"
                                    value={profileData.last_name}
                                    onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                    className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors"
                                    required
                                 />
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email</label>
                              <input
                                 type="email"
                                 value={profileData.email}
                                 disabled
                                 className="w-full bg-gray-100 border-2 border-transparent rounded-xl px-4 py-3 font-medium text-gray-500 cursor-not-allowed"
                              />
                              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                           </div>

                           <div>
                              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Phone</label>
                              <input
                                 type="tel"
                                 value={profileData.phone}
                                 onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                 className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors"
                              />
                           </div>

                           <div>
                              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Address</label>
                              <input
                                 type="text"
                                 value={profileData.address_1}
                                 onChange={(e) => setProfileData({ ...profileData, address_1: e.target.value })}
                                 className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors"
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                 <label className="block text-xs font-bold uppercase text-gray-400 mb-2">City</label>
                                 <input
                                    type="text"
                                    value={profileData.city}
                                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                    className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors"
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold uppercase text-gray-400 mb-2">State</label>
                                 <input
                                    type="text"
                                    value={profileData.state}
                                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                    className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors"
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold uppercase text-gray-400 mb-2">PIN Code</label>
                                 <input
                                    type="text"
                                    value={profileData.postcode}
                                    onChange={(e) => setProfileData({ ...profileData, postcode: e.target.value })}
                                    className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors"
                                 />
                              </div>
                           </div>

                           <div className="flex gap-4 pt-4">
                              <button
                                 type="submit"
                                 disabled={isSavingProfile}
                                 className="flex-1 bg-funky-dark text-white py-3 rounded-xl font-heading font-black hover:bg-funky-pink transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                              >
                                 {isSavingProfile ? <RefreshCw className="animate-spin" size={20} /> : <><Save size={20} /> SAVE CHANGES</>}
                              </button>
                              <button
                                 type="button"
                                 onClick={() => {
                                    setIsEditingProfile(false);
                                    // Reset to original values
                                    if (user) {
                                       setProfileData({
                                          first_name: user.first_name || '',
                                          last_name: user.last_name || '',
                                          email: user.email || '',
                                          phone: user.billing?.phone || '',
                                          address_1: user.billing?.address_1 || '',
                                          city: user.billing?.city || '',
                                          state: user.billing?.state || '',
                                          postcode: user.billing?.postcode || ''
                                       });
                                    }
                                 }}
                                 className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                              >
                                 Cancel
                              </button>
                           </div>
                        </form>
                     </div>
                  ) : (
                     <>
                        <h2 className="font-heading font-black text-2xl text-funky-dark mb-6 flex items-center gap-2">
                           <ShoppingBag className="text-funky-pink" /> ORDER HISTORY
                        </h2>

                  {isLoading ? (
                     <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
                        <RefreshCw className="animate-spin mx-auto text-gray-400 mb-4" size={32} />
                        <p className="text-gray-500 font-bold">Fetching your funky socks...</p>
                     </div>
                  ) : orders.length > 0 ? (
                     <div className="space-y-6">
                        {orders.map((order) => (
                           <div key={order.id} className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm hover:border-funky-blue transition-colors group">
                              {/* Order Header */}
                              <div className="bg-gray-50 p-6 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
                                 <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center font-black text-gray-400 text-xs">
                                       #{order.id}
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Order Placed</p>
                                       <p className="font-bold text-funky-dark text-sm">{new Date(order.date_created).toLocaleDateString()}</p>
                                    </div>
                                 </div>

                                 <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                    {order.status === 'processing' && <Clock size={12} />}
                                    {order.status === 'completed' && <Truck size={12} />}
                                    {order.status === 'cancelled' && <AlertCircle size={12} />}
                                    {order.status}
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                 {/* Order Items */}
                                 <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">ITEMS</h3>
                                    <div className="space-y-4">
                                       {order.line_items.map((item: any, idx: number) => (
                                          <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                             <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                                   {item.image?.src ? (
                                                      <img src={item.image.src} alt={item.name} className="w-full h-full object-cover" />
                                                   ) : (
                                                      <span className="text-lg">🧦</span>
                                                   )}
                                                </div>
                                                <div>
                                                   <span className="font-bold text-gray-700 block text-xs leading-tight mb-1">{item.name}</span>
                                                   <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">Qty: {item.quantity}</span>
                                                </div>
                                             </div>
                                             <span className="font-mono font-bold text-gray-900 text-xs text-right">₹{item.total}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 {/* Shipping Address */}
                                 <div className="p-6 bg-funky-light/20">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                       <MapPin size={10} /> SHIPPING TO
                                    </h3>
                                    <div className="space-y-1">
                                       <p className="font-bold text-funky-dark text-sm leading-tight">
                                          {order.shipping?.first_name} {order.shipping?.last_name}
                                       </p>
                                       <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                          {order.shipping?.address_1}, {order.shipping?.address_2 && `${order.shipping.address_2}, `}
                                          {order.shipping?.city}, {order.shipping?.state} - {order.shipping?.postcode}<br />
                                          {order.shipping?.country === 'IN' ? 'India' : order.shipping?.country}
                                       </p>
                                       <p className="text-[10px] font-bold text-funky-blue mt-2 pt-2 border-t border-gray-100 border-dashed">
                                          📞 {order.billing?.phone || 'No phone provided'}
                                       </p>
                                    </div>
                                 </div>
                              </div>

                              <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
                                 <div className="text-[10px] text-gray-400 font-bold uppercase">Total Order Value</div>
                                 <div className="text-xl font-heading font-black text-funky-dark">₹{order.total}</div>
                              </div>

                              {/* Order Actions */}
                              <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
                                 {/* Tracking Button */}
                                 {order.status === 'completed' || order.status === 'shipped' ? (
                                    <button
                                       onClick={() => alert(`Tracking Number: TRK-${order.id}-IN\nCourier: BlueDart`)}
                                       className="text-[10px] font-black bg-funky-dark text-white px-4 py-2 rounded-lg hover:bg-funky-pink transition-colors flex items-center gap-2 uppercase tracking-wide"
                                    >
                                       <Truck size={12} /> TRACK PACKAGE
                                    </button>
                                 ) : order.status === 'processing' ? (
                                    <span className="text-[10px] font-black text-funky-blue flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                       <Clock size={10} /> Packing your socks...
                                    </span>
                                 ) : (
                                    <span></span>
                                 )}

                                 <div className="flex gap-3">
                                    <Link to="/contact" className="text-[10px] font-black text-gray-500 hover:text-funky-dark flex items-center gap-1 transition-colors border border-gray-200 px-3 py-2 rounded-lg bg-white uppercase tracking-tighter">
                                       <HelpCircle size={12} /> Need Help?
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-4">🌵</div>
                        <h3 className="font-heading font-bold text-xl text-funky-dark mb-2">No Orders Yet</h3>
                        <p className="text-gray-500 mb-6">Your sock drawer is looking a little empty.</p>
                        <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-funky-dark text-white rounded-xl font-bold hover:bg-funky-pink transition-colors">
                           Start Shopping
                        </button>
                     </div>
                  )}
                  </>
               )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default MyAccount;