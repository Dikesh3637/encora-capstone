import React from "react";

export default function ProductDescriptionPage() {
    const product = {
        id: 101,
        name: "Premium Cotton Oversized Hoodie",
        description:
            "A high-quality oversized hoodie made with soft premium cotton. Perfect for casual wear and layering.",
        price: 1299,
        category: "Men",
        size: ["S", "M", "L", "XL"],
        image:
            "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    };

    return (
        <div className="max-w-5xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-base-100 shadow-xl rounded-xl border border-base-300 mt-10">
            
            {/* PRODUCT IMAGE */}
            <div className="rounded-xl overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[420px] object-cover rounded-xl"
                />
            </div>

            {/* PRODUCT DETAILS */}
            <div>
                <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
                <p className="text-base-content/70 mb-6">{product.description}</p>

                <p className="text-2xl font-semibold mb-4">₹ {product.price}</p>

                <p className="font-medium">Select Size:</p>
                <div className="flex gap-2 mt-2 mb-6">
                    {product.size.map((s) => (
                        <span
                            key={s}
                            className="badge badge-lg bg-base-200 hover:bg-primary hover:text-primary-content cursor-pointer transition"
                        >
                            {s}
                        </span>
                    ))}
                </div>

                <button className="btn btn-primary btn-wide">Add to Cart</button>

                <div className="mt-8">
                    <p className="text-sm text-base-content/50">Category: {product.category}</p>
                    <p className="text-sm text-base-content/50">Product ID: {product.id}</p>
                </div>
            </div>
        </div>
    );
}
