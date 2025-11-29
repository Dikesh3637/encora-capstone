import { useUser } from "../../provider/userProvider";
import { Package, Clock, Truck, User } from "lucide-react";

export default function ProfileOverview() {
  const { user } = useUser();

  return (
    <div className="space-y-8 mt-6">

      {/* WELCOME CARD */}
      <div className="p-8 bg-base-100 rounded-xl border border-base-300 shadow-sm">
        <h2 className="text-3xl font-bold">Welcome back {user?.userName}!</h2>
        <p className="text-base-content/70 mt-1">
          Here’s a quick summary of your account activity.
        </p>
      </div>

      {/* USER INFO CARD */}
      <div className="p-8 bg-base-100 rounded-xl border border-base-300 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
          {user?.userName?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="text-xl font-semibold">{user?.userName}</h3>
          <p className="text-base-content/70">{user?.email}</p>
          <p className="text-base-content/50 text-sm mt-1">Member since 2024</p>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-base-100 rounded-xl border border-base-300 shadow-sm">
          <Package size={30} className="mb-3" />
          <h3 className="font-bold text-xl">3 Orders</h3>
          <p className="text-base-content/70 text-sm">Total items purchased.</p>
        </div>

        <div className="p-6 bg-base-100 rounded-xl border border-base-300 shadow-sm">
          <Clock size={30} className="mb-3" />
          <h3 className="font-bold text-xl">1 Pending</h3>
          <p className="text-base-content/70 text-sm">Orders on the way.</p>
        </div>

        <div className="p-6 bg-base-100 rounded-xl border border-base-300 shadow-sm">
          <Truck size={30} className="mb-3" />
          <h3 className="font-bold text-xl">Fast Delivery</h3>
          <p className="text-base-content/70 text-sm">
            Track deliveries easily.
          </p>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="p-8 bg-base-100 rounded-xl border border-base-300 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>

        <div className="space-y-3">
          <div className="p-4 border border-base-300 rounded-lg">🧥 Hoodie — Delivered</div>
          <div className="p-4 border border-base-300 rounded-lg">🧵 Jacket — In Transit</div>
          <div className="p-4 border border-base-300 rounded-lg">👟 Sneakers — Preparing Dispatch</div>
        </div>
      </div>
    </div>
  );
}
