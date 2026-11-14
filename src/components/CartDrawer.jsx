import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, CreditCard, Building } from 'lucide-react';

export default function CartDrawer() {
  const { cart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal, cartCount } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'VOWLES20') {
      setDiscountPercent(0.20);
      setDiscountError('');
    } else {
      setDiscountError('Invalid code. Try "VOWLES20" for 20% off.');
    }
  };

  const finalTotal = Math.max(0, cartTotal * (1 - discountPercent)).toFixed(2);

  const handleCompletePayment = async (e) => {
    e.preventDefault();
    const orderId = 'VP-ORD-' + Math.floor(100000 + Math.random() * 900000);
    const receipt = {
      orderId,
      items: [...cart],
      totalPaid: finalTotal,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    setOrderReceipt(receipt);
    setPaymentDone(true);
    clearCart();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Background click to dismiss */}
      <div 
        style={{ flex: 1 }} 
        onClick={() => {
          setIsCartOpen(false);
          setIsCheckingOut(false);
          setPaymentDone(false);
        }} 
      />

      {/* Cart Content Drawer */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#090d16',
        borderLeft: '1px solid var(--card-border)',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={22} color="var(--primary-blue)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Your Cart</h3>
            <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>{cartCount} items</span>
          </div>
          <button 
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
              setPaymentDone(false);
            }} 
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {paymentDone && orderReceipt ? (
          /* Payment Success Confirmation */
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', flex: 1, overflowY: 'auto' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#10b981'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.35rem', marginBottom: '0.5rem' }}>Payment Successful!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your order <strong style={{ color: '#38bdf8' }}>{orderReceipt.orderId}</strong> has been confirmed. Permanent digital access has been granted to your account.
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--card-border)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{orderReceipt.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                <span style={{ color: '#fff' }}>{orderReceipt.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>${orderReceipt.totalPaid}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setPaymentDone(false);
                setIsCheckingOut(false);
                setIsCartOpen(false);
              }}
            >
              Continue Browsing
            </button>
          </div>
        ) : isCheckingOut ? (
          /* Checkout Payment Form */
          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
            <h4 style={{ color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="var(--primary-blue)" /> Complete Your Purchase
            </h4>

            <form onSubmit={handleCompletePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Billing Email
                </label>
                <input 
                  type="email" 
                  required 
                  defaultValue={localStorage.getItem('user') || 'researcher@university.edu'} 
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    outline: 'none'
                  }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Card Number
                </label>
                <input 
                  type="text" 
                  required 
                  defaultValue="4242 •••• •••• 4242" 
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    outline: 'none'
                  }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Exp Date
                  </label>
                  <input 
                    type="text" 
                    defaultValue="12/28" 
                    required 
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      color: '#fff',
                      outline: 'none'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    CVC
                  </label>
                  <input 
                    type="text" 
                    defaultValue="982" 
                    required 
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      color: '#fff',
                      outline: 'none'
                    }} 
                  />
                </div>
              </div>

              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#38bdf8',
                marginTop: '0.5rem'
              }}>
                <ShieldCheck size={18} />
                <span>256-bit encrypted academic transaction. Instant access granted.</span>
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Due:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>${finalTotal}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsCheckingOut(false)} 
                    className="btn btn-outline" 
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Back to Cart
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 2, justifyContent: 'center' }}
                  >
                    Pay ${finalTotal}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Normal Cart Items View */
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '1.05rem', color: '#fff' }}>Your cart is empty</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Explore publications and add subscriptions, articles, or author vouchers.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map((item) => (
                    <div 
                      key={`${item.id}-${item.type}`} 
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginBottom: '0.35rem' }}>
                          {item.type || 'Article PDF'}
                        </span>
                        <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: '0.25rem 0', lineHeight: 1.3 }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                          {item.authors || item.journal}
                        </p>
                        <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#38bdf8', marginTop: '0.5rem', display: 'inline-block' }}>
                          ${item.price}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.type)}
                        title="Remove item"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          opacity: 0.8
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer & Checkout Action */}
            {cart.length > 0 && (
              <div style={{
                padding: '1.25rem',
                borderTop: '1px solid var(--card-border)',
                background: 'rgba(255,255,255,0.02)'
              }}>
                {/* Coupon Code Section */}
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Promo code (e.g. VOWLES20)" 
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
                    Apply
                  </button>
                </form>

                {discountPercent > 0 && (
                  <p style={{ color: '#10b981', fontSize: '0.8rem', margin: '-0.5rem 0 0.75rem' }}>
                    ✓ 20% Discount code applied!
                  </p>
                )}
                {discountError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '-0.5rem 0 0.75rem' }}>
                    {discountError}
                  </p>
                )}

                {/* Subtotal & Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#10b981' }}>
                    <span>Discount (20%):</span>
                    <span>-${(cartTotal * discountPercent).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.15rem', fontWeight: 'bold', color: '#fff' }}>
                  <span>Total:</span>
                  <span style={{ color: '#38bdf8' }}>${finalTotal}</span>
                </div>

                <button 
                  onClick={() => setIsCheckingOut(true)} 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}