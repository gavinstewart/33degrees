import Image from "next/image";
import type { MerchItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CartProvider } from "@/app/components/site/CartProvider";
import { AddToCartButton, CartDrawer, CartToggle } from "@/app/components/site/MerchCart";

export default function Merch({ items }: { items: MerchItem[] }) {
  return (
    <CartProvider>
      <section id="merch" className="section">
        <div className="container">
          <h2 className="section-heading">Merch</h2>
          {items.length === 0 ? (
            <p className="empty-state">Merch store coming soon.</p>
          ) : (
            <div className="merch-grid">
              {items.map((item) => (
                <div key={item.id} className="merch-card">
                  {item.image_url && (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="merch-image"
                    />
                  )}
                  <div className="merch-info">
                    <div className="merch-name">{item.name}</div>
                    {item.description && <p>{item.description}</p>}
                    <div className="merch-price">{formatPrice(item.price_cents)}</div>
                    {item.sizes && item.sizes.length > 0 && (
                      <div className="merch-sizes">Sizes: {item.sizes.join(", ")}</div>
                    )}
                    {item.in_stock ? (
                      <AddToCartButton
                        id={item.id}
                        name={item.name}
                        priceCents={item.price_cents}
                      />
                    ) : (
                      <span className="merch-out-of-stock">Out of stock</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <CartToggle />
      <CartDrawer />
    </CartProvider>
  );
}
