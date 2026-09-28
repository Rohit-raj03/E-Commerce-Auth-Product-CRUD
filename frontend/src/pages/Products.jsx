import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Star,
  ArrowRight,
} from "lucide-react";

const Products = () => {
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      setDeleting(true);
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      setDeleteModalId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const defaultDemoProducts = [
    {
      _id: "demo-1",
      name: "Cashmere Ribbed Knitwear Sweater",
      description:
        "Ultra-soft 100% Mongolian cashmere crewneck sweater tailored for effortlessness.",
      price: 240,
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
    },
    {
      _id: "demo-2",
      name: "Tailored Linen Oversized Shirt",
      description:
        "Breathable organic linen shirt designed with dropped shoulders and subtle cuff detailing.",
      price: 135,
      stock: 8,
      image:
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop",
    },
    {
      _id: "demo-3",
      name: "Pleated High-Waist Wool Trousers",
      description:
        "Structured wool-blend trousers featuring deep front pleats and a relaxed straight leg.",
      price: 195,
      stock: 15,
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    },
    {
      _id: "demo-4",
      name: "Minimalist Belted Trench Coat",
      description:
        "Double-breasted water-repellent trench coat with horn buttons and removable waist tie.",
      price: 340,
      stock: 5,
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const displayProducts = products.length > 0 ? products : defaultDemoProducts;

  return (
    <div className="space-y-20 pb-16">
      <section className="max-w-aura-container mx-auto px-4 md:px-8 pt-8 md:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#EFE9DF] border border-[#D5CEC1] p-8 md:p-16 rounded-[2px]">
          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#5F5A52] block font-sans">
              Autumn / Winter 2026 Collection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#24221F] leading-[1.1]">
              Modern Essentials. <br />
              <span className="italic font-normal">Effortless Every Day.</span>
            </h1>
            <p className="text-xs md:text-sm text-[#5F5A52] max-w-md leading-relaxed font-sans">
              Timeless pieces crafted with thoughtful design and premium
              sustainable materials. Created for quiet confidence.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="bg-[#8B9686] hover:bg-[#24221F] text-white text-xs uppercase tracking-widest px-6 py-3.5 rounded-[2px] transition-colors inline-flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#lookbook"
                className="text-xs uppercase tracking-widest text-[#24221F] hover:opacity-60 transition-opacity underline underline-offset-4"
              >
                New Arrivals →
              </a>
            </div>
          </div>

          <div className="aspect-[4/5] overflow-hidden bg-[#E4DED3] border border-[#D5CEC1] rounded-[2px]">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
              alt="AURA Lifestyle Model"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      <section className="max-w-aura-container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-6 border-b border-[#D5CEC1] pb-4">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-[#24221F] font-medium">
              Shop By Category
            </h2>
            <p className="text-xs text-[#5F5A52] uppercase tracking-wider mt-1 font-sans">
              Curated wardrobe staples
            </p>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#24221F] cursor-pointer hover:opacity-60">
            View All →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              name: "Knitwear",
              img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400&auto=format&fit=crop",
            },
            {
              name: "Shirts",
              img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=400&auto=format&fit=crop",
            },
            {
              name: "Trousers",
              img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop",
            },
            {
              name: "Jackets",
              img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop",
            },
            {
              name: "Basics",
              img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop",
            },
            {
              name: "Accessories",
              img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=400&auto=format&fit=crop",
            },
          ].map((cat, idx) => (
            <div key={idx} className="group cursor-pointer text-center">
              <div className="aspect-[4/5] bg-[#E4DED3] border border-[#D5CEC1] overflow-hidden rounded-[2px] mb-2">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#24221F] font-sans font-medium">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="catalog"
        className="max-w-aura-container mx-auto px-4 md:px-8 pt-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#D5CEC1] pb-4 gap-4">
          <div>
            <h2 className="font-serif text-3xl text-[#24221F] font-medium">
              Product Catalog
            </h2>
            <p className="text-xs text-[#5F5A52] uppercase tracking-wider mt-1 font-sans">
              {displayProducts.length} Essential Products Available
            </p>
          </div>

          {isAuthenticated ? (
            <Link
              to="/products/add"
              className="bg-[#8B9686] hover:bg-[#24221F] text-white text-xs uppercase tracking-widest px-4 py-2.5 rounded-[2px] transition-colors flex items-center space-x-2"
            >
              <Plus size={14} />
              <span>Add New Product</span>
            </Link>
          ) : (
            <p className="text-xs text-[#5F5A52]">
              <Link
                to="/login"
                className="text-[#24221F] underline font-medium"
              >
                Sign in
              </Link>{" "}
              to add, edit, or manage products.
            </p>
          )}
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-[#8B9686] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-xs tracking-widest text-[#5F5A52] uppercase">
              Loading Catalog...
            </p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((prod) => (
              <div
                key={prod.id || prod._id}
                className="group bg-[#FFFFFF] border border-[#D5CEC1] p-3 rounded-[2px] flex flex-col justify-between hover:border-[#24221F]/40 transition-colors"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-[#F7F3ED] overflow-hidden border border-[#D5CEC1]/50 rounded-[2px] mb-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                    <button
                      className="absolute top-2.5 right-2.5 p-1.5 bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] text-[#24221F] rounded-full backdrop-blur-sm transition-colors"
                      aria-label="Wishlist"
                    >
                      <Heart size={14} strokeWidth={1.5} />
                    </button>
                    {prod.stock <= 0 && (
                      <span className="absolute bottom-2 left-2 bg-[#24221F] text-white text-[10px] uppercase tracking-widest px-2 py-0.5">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs md:text-sm font-medium text-[#24221F] line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-[#5F5A52] line-clamp-2 mt-1 leading-relaxed font-sans">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D5CEC1]/50">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs uppercase tracking-wider text-[#5F5A52]">
                      Stock: {prod.stock}
                    </span>
                    <span className="text-sm font-serif font-semibold text-[#24221F]">
                      ${Number(prod.price).toLocaleString()}
                    </span>
                  </div>

                  {isAuthenticated && (
                    <div className="flex space-x-2 pt-1">
                      <Link
                        to={`/products/${prod.id || prod._id}/edit`}
                        className="flex-1 bg-[#EFE9DF] hover:bg-[#D5CEC1] text-[#24221F] text-[11px] uppercase tracking-wider py-1.5 rounded-[2px] transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => setDeleteModalId(prod.id || prod._id)}
                        className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-[2px] transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        id="lookbook"
        className="max-w-aura-container mx-auto px-4 md:px-8"
      >
        <div className="bg-[#EFE9DF] border border-[#D5CEC1] p-8 md:p-12 rounded-[2px]">
          <div className="mb-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#5F5A52] block font-sans">
              Editorial Feature
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#24221F] font-medium mt-1">
              Curated Looks for Spring
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Look 01 — Monochrome Warmth",
                img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop",
              },
              {
                title: "Look 02 — Structured Tailoring",
                img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
              },
              {
                title: "Look 03 — Soft Wool Layers",
                img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
              },
              {
                title: "Look 04 — Minimal Evening",
                img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
              },
            ].map((look, idx) => (
              <div
                key={idx}
                className="group relative aspect-[3/4] bg-[#E4DED3] overflow-hidden rounded-[2px]"
              >
                <img
                  src={look.img}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24221F]/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs uppercase tracking-wider font-sans">
                    {look.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-aura-container mx-auto px-4 md:px-8 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#24221F] font-medium">
          Customer Favorites
        </h2>
        <p className="text-xs text-[#5F5A52] uppercase tracking-widest font-sans">
          Timeless pieces. Loved every day.
        </p>

        <div className="flex justify-center items-center space-x-1 text-[#8B9686] pt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="#8B9686" />
          ))}
          <span className="text-xs text-[#24221F] font-semibold ml-2">
            (124 Reviews)
          </span>
        </div>
      </section>

      <section className="max-w-aura-container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-3 bg-[#FFFFFF] border border-[#D5CEC1] p-8 rounded-[2px]">
          <div className="flex items-start space-x-4 ">
            <Truck
              size={24}
              className="text-[#8B9686] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24221F]">
                Free Shipping
              </h4>
              <p className="text-xs text-[#5F5A52] mt-1">
                On orders over $150 worldwide
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <RotateCcw
              size={24}
              className="text-[#8B9686] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24221F]">
                Easy Returns
              </h4>
              <p className="text-xs text-[#5F5A52] mt-1">
                30 days hassle-free return policy
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <ShieldCheck
              size={24}
              className="text-[#8B9686] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24221F]">
                Secure Payments
              </h4>
              <p className="text-xs text-[#5F5A52] mt-1">
                Safe 256-bit encrypted checkout
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Headphones
              size={24}
              className="text-[#8B9686] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24221F]">
                Customer Care
              </h4>
              <p className="text-xs text-[#5F5A52] mt-1">
                Dedicated support 7 days a week
              </p>
            </div>
          </div>
        </div>
      </section>

      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-[#24221F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#D5CEC1] p-6 max-w-sm w-full rounded-[2px] space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#24221F]">
              Confirm Delete
            </h3>
            <p className="text-xs text-[#5F5A52] leading-relaxed">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 border border-[#D5CEC1] text-xs uppercase tracking-wider text-[#24221F] rounded-[2px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteModalId)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider rounded-[2px] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
