import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingBag, X, Plus, Minus, Trash2, Send, Clock, Sparkles } from 'lucide-react';

interface Props {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  whatsappNumber?: string;
}

export const TakeawayCartModal: React.FC<Props> = ({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onClearCart,
  whatsappNumber = '9620532473',
}) => {
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'Takeaway' | 'DineIn'>('Takeaway');
  const [pickupTime, setPickupTime] = useState('In 20–30 Minutes');
  const [specialNote, setSpecialNote] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => {
    return sum + (item.item.price || 0) * item.quantity;
  }, 0);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  const handleSendWhatsApp = () => {
    const itemsList = cart
      .map(
        (ci) =>
          `• ${ci.quantity}x ${ci.item.name} (${ci.item.price ? `₹${ci.item.price * ci.quantity}` : 'Specialty'})`
      )
      .join('\n');

    const nameText = customerName.trim() ? customerName.trim() : 'Guest Customer';
    const typeText = orderType === 'Takeaway' ? '🥡 Parcel / Takeaway' : '🍽️ Dine-in Pre-order';

    const messageLines = [
      `*AL-TAJ HOTEL HASSAN - ORDER REQUEST*`,
      `Aapki Khidmat, Hamara Fakhr 👑`,
      ``,
      `👤 *Guest:* ${nameText}`,
      `📦 *Type:* ${typeText}`,
      `⏰ *Requested Time:* ${pickupTime}`,
      ...(specialNote.trim() ? [`📝 *Special Instructions:* ${specialNote.trim()}`] : []),
      ``,
      `📋 *SELECTED DISHES:*`,
      itemsList,
      ``,
      `💰 *Estimated Bill Total:* ₹${totalAmount}`,
      ``,
      `Please confirm availability & kitchen preparation time. Shukriya!`,
    ];

    const encoded = encodeURIComponent(messageLines.join('\n'));
    const url = `https://wa.me/91${cleanWhatsApp}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121217] border border-[#c5a869]/40 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-[#c5a869]/20 flex items-center justify-between bg-[#16161d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a869] to-[#dfb75a] text-[#070709] flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-royal text-lg sm:text-xl font-bold text-[#f5f0e6]">
                  Dastarkhwan Parcel Order
                </h3>
                <span className="font-urdu text-base text-[#dfb75a] font-semibold hidden sm:inline">
                  پارسل آرڈر
                </span>
              </div>
              <p className="text-xs text-[#a8a396]">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} • Hot & Fresh from Charcoal Tandoor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c1c25] hover:bg-[#252532] text-[#f5f0e6] flex items-center justify-center border border-[#c5a869]/30 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#dfb75a]/40 mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#f5f0e6] mb-1">Your Parcel Cart is Empty</p>
              <p className="text-xs text-[#a8a396] mb-4">
                Explore our authentic Tandoori, Dum Biryani, and Nawabi curries to build your order.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-[#c5a869] to-[#dfb75a] text-[#070709] text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Browse Dastarkhwan
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#dfb75a]">
                  <span>Selected Delicacies</span>
                  <button
                    onClick={onClearCart}
                    className="text-[#a8a396] hover:text-red-400 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-2.5 divide-y divide-[#c5a869]/10">
                  {cart.map((cartItem) => {
                    const item = cartItem.item;
                    const itemTotal = (item.price || 0) * cartItem.quantity;
                    const photo =
                      item.image ||
                      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop';

                    return (
                      <div
                        key={item._id || (item as any).id}
                        className="pt-2.5 first:pt-0 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={photo}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover object-center border border-[#c5a869]/20 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-[#f5f0e6] truncate">
                              {item.name}
                            </h4>
                            {item.urduName && (
                              <p className="font-urdu text-xs text-[#dfb75a] truncate">
                                {item.urduName}
                              </p>
                            )}
                            <p className="text-[11px] text-[#a8a396]">
                              ₹{item.price || 0} each
                            </p>
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-lg bg-[#1c1c25] border border-[#c5a869]/30">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item._id || (item as any).id, -1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded-l-lg transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-[#f5f0e6]">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item._id || (item as any).id, 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#dfb75a] hover:bg-[#252532] rounded-r-lg transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-bold text-xs sm:text-sm text-[#dfb75a] w-14 text-right">
                            ₹{itemTotal}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details Form */}
              <div className="bg-[#181822] border border-[#c5a869]/20 rounded-xl p-4 space-y-3.5 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb75a] block">
                  Pickup & Guest Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#d0cbc0] font-semibold mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 bg-[#0e0e13] border border-[#c5a869]/30 rounded-lg text-xs text-[#f5f0e6] focus:border-[#dfb75a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#d0cbc0] font-semibold mb-1">
                      Order Type
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOrderType('Takeaway')}
                        className={`py-2 px-2 text-center rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                          orderType === 'Takeaway'
                            ? 'bg-[#dfb75a] text-[#070709]'
                            : 'bg-[#0e0e13] text-[#a8a396] border border-[#c5a869]/20'
                        }`}
                      >
                        Takeaway Parcel
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('DineIn')}
                        className={`py-2 px-2 text-center rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                          orderType === 'DineIn'
                            ? 'bg-[#dfb75a] text-[#070709]'
                            : 'bg-[#0e0e13] text-[#a8a396] border border-[#c5a869]/20'
                        }`}
                      >
                        Dine-in Order
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#d0cbc0] font-semibold mb-1">
                      Ready In / Pickup Time
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-[#dfb75a] absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-[#0e0e13] border border-[#c5a869]/30 rounded-lg text-xs text-[#f5f0e6] focus:border-[#dfb75a] focus:outline-none"
                      >
                        <option value="In 20–30 Minutes">In 20–30 Minutes</option>
                        <option value="In 45 Minutes">In 45 Minutes</option>
                        <option value="In 1 Hour">In 1 Hour</option>
                        <option value="Tonight 8:30 PM">Tonight 8:30 PM</option>
                        <option value="Tonight 9:30 PM">Tonight 9:30 PM</option>
                        <option value="Tonight 10:30 PM">Tonight 10:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#d0cbc0] font-semibold mb-1">
                      Special Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      placeholder="E.g., extra spicy, pack chutney, lemon"
                      className="w-full px-3 py-2 bg-[#0e0e13] border border-[#c5a869]/30 rounded-lg text-xs text-[#f5f0e6] focus:border-[#dfb75a] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-[#14141c] rounded-xl p-4 border border-[#c5a869]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#a8a396] block uppercase tracking-wider font-semibold">
                    Estimated Total Bill
                  </span>
                  <span className="text-[11px] text-[#dfb75a] font-medium">
                    Pay at hotel pickup or via UPI upon arrival
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-royal text-2xl sm:text-3xl font-bold text-[#dfb75a]">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#c5a869]/20 bg-[#16161d] space-y-2">
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>Send Order to WhatsApp Manager (+91 {whatsappNumber})</span>
            </button>
            <p className="text-[11px] text-center text-[#a8a396]">
              Ameer Mohalla, Hassan kitchen will confirm your order preparation time right away.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
