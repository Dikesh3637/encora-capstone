// src/pages/OrderHistoryPage.js

import { useQuery } from "@tanstack/react-query";
import { fetchUserOrders } from "../../query/getOrdersQuery";

const OrderHistoryPage = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchUserOrders,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError || !orders) {
    return (
      <div className="min-h-screen flex items-center justify-center text-error bg-base-100">
        Failed to load orders.
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-base-100 text-base-content/60">
        <h2 className="text-xl font-bold">No orders found</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-1 w-full bg-base-100 py-8 px-4 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold mb-2">Your Orders</h1>

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card bg-base-100 border border-base-200 shadow-sm"
            >
              <div className="card-body p-5">
                {/* Header: ID and Status */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-xs text-base-content/60">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleString()
                        : ""}
                    </p>
                  </div>
                  <div
                    className={`badge ${
                      order.status === "CONFIRMED"
                        ? "badge-success text-white"
                        : order.status === "FAILED"
                        ? "badge-error text-white"
                        : "badge-ghost"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="text-sm text-base-content/80 bg-base-200/50 p-3 rounded-md">
                  {order.items && order.items.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.productName}{" "}
                          <span className="opacity-70">
                            x{item.quantity} ({item.size})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic opacity-50">No items details</span>
                  )}
                </div>

                {/* Footer: Total Price */}
                <div className="mt-2 flex justify-end">
                  <span className="text-lg font-bold text-primary">
                    Total: ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
