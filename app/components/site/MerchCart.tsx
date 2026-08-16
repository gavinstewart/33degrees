"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/app/components/site/CartProvider";

export function AddToCartButton({
  id,
  name,
  priceCents,
}: {
  id: string;
  name: string;
  priceCents: number;
}) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className="btn btn--small"
      onClick={() => addItem({ id, name, priceCents })}
    >
      Add to cart
    </button>
  );
}

export function CartToggle() {
  const { items, open } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  if (count === 0) return null;

  return (
    <button type="button" className="btn cart-toggle" onClick={open}>
      Cart ({count})
    </button>
  );
}

export function CartDrawer() {
  const { items, removeItem, totalCents, isOpen, close } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={close} />
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your cart</h3>
          <button type="button" className="btn btn--ghost btn--small" onClick={close}>
            Close
          </button>
        </div>
        {items.length === 0 ? (
          <p className="empty-state">Your cart is empty.</p>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <div className="cart-item-name">
                    {item.name} &times; {item.qty}
                  </div>
                  <div>{formatPrice(item.priceCents * item.qty)}</div>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="cart-item">
              <strong>Total</strong>
              <strong>{formatPrice(totalCents)}</strong>
            </div>
            {checkingOut ? (
              <p className="cart-checkout-note">
                Online checkout isn&apos;t set up yet — hit us up directly to grab this
                merch in person or at a show.
              </p>
            ) : (
              <button
                type="button"
                className="btn"
                style={{ marginTop: 16 }}
                onClick={() => setCheckingOut(true)}
              >
                Checkout
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
