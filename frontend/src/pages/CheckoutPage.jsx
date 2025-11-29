export default function CheckoutPage() {
    return (
        <div className="max-w-3xl mx-auto p-10 bg-base-100 shadow-xl rounded-xl mt-10 border border-base-300">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <div className="space-y-4 mb-10">
                <div className="p-4 bg-base-200 rounded-lg">
                    <p className="font-semibold">Premium Cotton Hoodie</p>
                    <p className="text-sm text-base-content/70">Quantity: 1</p>
                    <p className="text-sm text-base-content/70">Price: ₹1299</p>
                </div>

                <div className="p-4 bg-base-200 rounded-lg">
                    <p className="font-semibold">Classic Blue Denim Jacket</p>
                    <p className="text-sm text-base-content/70">Quantity: 1</p>
                    <p className="text-sm text-base-content/70">Price: ₹1799</p>
                </div>
            </div>

            <div className="flex justify-between text-lg font-semibold mb-8">
                <span>Total:</span>
                <span>₹3098</span>
            </div>

            <button className="btn btn-primary btn-wide">Proceed to Payment</button>
        </div>
    );
}
