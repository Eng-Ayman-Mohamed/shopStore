import React from "react";

export default function Orders() {
  const stored = localStorage.getItem("cs_orders");
  const orders = stored ? JSON.parse(stored) : [];

  if (!orders.length)
    return (
      <div className="card form">
        <h3>No orders yet</h3>
        <p className="small">
          You haven't placed any orders. Add items to your cart and checkout to
          create an order (demo).
        </p>
      </div>
    );

  return (
    <div className="card">
      <h3>Your orders</h3>
      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {orders.map((o, idx) => (
          <div
            key={idx}
            style={{
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontWeight: 800 }}>Order #{o.id || idx + 1}</div>
            <div className="small">Items: {o.items.length}</div>
            <div className="small">Total: ${(o.total || 0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
