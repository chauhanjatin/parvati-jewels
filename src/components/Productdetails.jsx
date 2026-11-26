import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CTA from "./CTA";
import ScrollReveal from "./ScrollReveal";
import { fetchJson } from "../lib/api";
import Loader from "./Loader";
import { productImageUrl } from "../lib/productImage";

const METAL_OPTIONS = [
  {
    id: "white-gold",
    name: "White Gold",
    color: "#E2E6E9",
    border: "#CBD5E1",
  },
  {
    id: "yellow-gold",
    name: "Yellow Gold",
    color: "#ECC88B",
    border: "#E5BE78",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    color: "#F0BFAB",
    border: "#E5ADA0",
  },
  {
    id: "pt950",
    name: "PT950",
    color: "#DFE4E8",
    border: "#CBD5E1",
  },
];

const KARAT_OPTIONS = [
  { id: "9kt", label: "9KT" },
  { id: "14kt", label: "14KT" },
  { id: "18kt", label: "18KT" },
];

function Productdetails({ setInquiryState }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("white-gold");
  const [selectedKarat, setSelectedKarat] = useState("18kt");
  const scrollRef = useRef(null);

  const handleKaratSelect = (karatId) => {
    setSelectedKarat(karatId);
    if (selectedColor === "pt950") {
      setSelectedColor("white-gold");
    }
  };

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setActiveIndex(0);
    setLoading(true);
    fetchJson(`/api/products/${slug}`)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <Loader isLoading={true} />;
  if (error)
    return (
      <div className="py-20 text-center text-xl text-red-500">{error}</div>
    );
  if (!product)
    return <div className="py-20 text-center text-xl">Product not found.</div>;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ imageUrl: "" }];

  const productDetails =
    product.productDetails ||
    product.specifications?.productDetails ||
    (product.specifications?.productInformation
      ? {
          productInformation: product.specifications.productInformation,
          accentStones: product.specifications.accentStones,
        }
      : null) ||
    (product.variants?.[0]?.specifications
      ? (() => {
          try {
            const s =
              typeof product.variants[0].specifications === "string"
                ? JSON.parse(product.variants[0].specifications)
                : product.variants[0].specifications;
            return (
              s.productDetails ||
              (s.productInformation
                ? {
                    productInformation: s.productInformation,
                    accentStones: s.accentStones,
                  }
                : null)
            );
          } catch {
            return null;
          }
        })()
      : null);

  const activeMetal =
    METAL_OPTIONS.find((m) => m.id === selectedColor) || METAL_OPTIONS[0];
  const activeKarat =
    KARAT_OPTIONS.find((k) => k.id === selectedKarat) || KARAT_OPTIONS[2];
  const dynamicMetalValue =
    selectedColor === "pt950"
      ? "Platinum (PT950)"
      : `${activeMetal.name} (${activeKarat.label.toLowerCase()})`;

  // Assemble dynamic product information with reactive Metal value
  const rawProdInfo = productDetails?.productInformation || {};
  const prodInfoEntries = [];
  let metalAdded = false;

  Object.entries(rawProdInfo).forEach(([key, val]) => {
    if (key.toLowerCase() === "metal") {
      prodInfoEntries.push(["Metal", dynamicMetalValue]);
      metalAdded = true;
    } else {
      prodInfoEntries.push([key, val]);
      if (key.toLowerCase() === "setting" && !metalAdded) {
        prodInfoEntries.push(["Metal", dynamicMetalValue]);
        metalAdded = true;
      }
    }
  });

  if (!metalAdded && Object.keys(rawProdInfo).length > 0) {
    prodInfoEntries.splice(1, 0, ["Metal", dynamicMetalValue]);
  }

  const rawAccentStones = productDetails?.accentStones || {};
  const accentEntries = Object.entries(rawAccentStones);

  const parentCategory = product.category?.parent;
  const currentCategory = parentCategory || product.category;
  const currentSubCategory = parentCategory ? product.category : null;

  return (
    <div>
      {/* Hero Section */}
      <div className="container mx-auto px-6 2xl:py-14 py-5">
        <div className="flex flex-col lg:flex-row gap-8">
          <ScrollReveal
            animation="fade-up"
            duration={900}
            delay={150}
            className="2xl:w-[785px] xl:w-[785px] lg:w-[765px] md:w-[720px] w-full flex flex-col"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-black hover:text-[#12798C] transition-colors duration-300 w-fit mb-3 group cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-[11px] md:text-[13px] 2xl:text-[16px] uppercase font-medium tracking-wide">
                BACK
              </span>
            </button>
            <div className="w-full 2xl:h-[600px] xl:h-[655px] lg:h-[465px] md:h-[495px] h-[260px] flex items-center justify-center overflow-hidden md:mb-8 mb-5">
              <img
                src={productImageUrl(images[activeIndex]?.imageUrl)}
                alt="Main product view"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>

            <div className="relative flex items-center group">
              {images.length > 5 && (
                <button
                  onClick={() => scrollThumbnails("left")}
                  className="absolute left-0 z-10 bg-white/90 hover:bg-white shadow-md p-1.5 rounded-full -ml-3 flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              <div
                ref={scrollRef}
                className="flex lg:gap-5 md:gap-3 gap-2 overflow-x-auto pb-2 scroll-smooth w-full"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
                {images.map((item, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 xl:w-[15%] lg:w-[18%] w-[16%] cursor-pointer transition-all duration-300 border ${activeIndex === index ? "border-[#3D3D3D] shadow-sm" : "border-transparent hover:border-gray-300"}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img
                      src={productImageUrl(item.imageUrl)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full 2xl:h-[134px] xl:h-[110px] md:h-[105px] h-[56px] object-cover"
                    />
                  </div>
                ))}
              </div>

              {images.length > 5 && (
                <button
                  onClick={() => scrollThumbnails("right")}
                  className="absolute right-0 z-10 bg-white/90 hover:bg-white shadow-md p-1.5 rounded-full -mr-3 flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal
            animation="fade-up"
            duration={900}
            delay={150}
            className="w-full lg:w-[582px] flex flex-col"
          >
            {/* Breadcrumb */}
            <div className="text-[11px] 2xl:text-[15px] md:text-[13px] text-[#7A7A7A] 2xl:mb-6 xl:mb-5 lg:mb-3 mb-4 uppercase font-medium flex flex-wrap items-center italic">
              <Link to="/" className="hover:text-black transition-colors">
                HOME
              </Link>
              <span className="mx-2 text-gray-300">|</span>
              <Link
                to={`/category/${currentCategory?.slug || "rings"}`}
                className="hover:text-black transition-colors"
              >
                {currentCategory?.name?.toUpperCase() || "CATEGORY"}
              </Link>
              {currentSubCategory && (
                <>
                  <span className="mx-2 text-gray-300">|</span>
                  <Link
                    to={`/category/${currentCategory?.slug}?subCategory=${currentSubCategory.slug}`}
                    className="hover:text-[#12798C] transition-colors"
                  >
                    {currentSubCategory.name?.toUpperCase()}
                  </Link>
                </>
              )}
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-[#3D3D3D]">{product.name}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-[32px] md:text-[38px] xl:text-[42px] font-bellefair text-[#12798C] mb-3">
              {product.name}
            </h1>

            {/* Metal Selection Section */}
            <div className="mb-6 p-3.5 sm:p-4 bg-[#FBFBFB] border border-gray-200/80 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[12px] 2xl:text-[14px] font-medium text-gray-500 uppercase tracking-wider">
                  Metal:
                </span>
                <span className="text-[13px] sm:text-[14px] 2xl:text-[16px] font-semibold text-[#12798C]">
                  {selectedColor === "pt950"
                    ? "Platinum (pt950)"
                    : `${selectedKarat.toUpperCase()} ${
                        METAL_OPTIONS.find((m) => m.id === selectedColor)?.name || "White Gold"
                      }`}
                </span>
              </div>

              {/* Circular Metal Swatches */}
              <div className="flex items-center gap-4 sm:gap-6 pt-1">
                {METAL_OPTIONS.map((metal) => {
                  const isSelected = selectedColor === metal.id;

                  return (
                    <button
                      key={metal.id}
                      type="button"
                      onClick={() => setSelectedColor(metal.id)}
                      className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
                      title={metal.name}
                    >
                      <div
                        className={`w-[30px] h-[30px] rounded-full border transition-all duration-200 ${
                          isSelected
                            ? "ring-1 ring-[#12798C] ring-offset-2 scale-105 shadow-xs"
                            : "hover:scale-105 hover:shadow-xs border-gray-300 opacity-85 hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: metal.color,
                          borderColor: metal.border,
                        }}
                      />
                      <span
                        className={`text-[11px] sm:text-[12px] tracking-tight transition-colors whitespace-nowrap ${
                          isSelected
                            ? "text-[#12798C] font-semibold"
                            : "text-gray-500 group-hover:text-gray-800"
                        }`}
                      >
                        {metal.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Karat Tabs at bottom */}
              <div className="mt-4 pt-3.5 border-t border-gray-200/70">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {KARAT_OPTIONS.map((k) => {
                    const isSelected = selectedColor !== "pt950" && selectedKarat === k.id;
                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => handleKaratSelect(k.id)}
                        className={`min-w-[64px] sm:min-w-[76px] px-3.5 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] tracking-wider uppercase transition-all duration-150 cursor-pointer text-center border ${
                          isSelected
                            ? "border-[#12798C] text-[#12798C] bg-[#12798C]/5 font-semibold"
                            : "border-gray-200 text-gray-400 bg-white hover:border-[#12798C]/40 hover:text-[#12798C] font-normal"
                        }`}
                      >
                        {k.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product Specifications Section - Exactly like Screenshot 1 */}
            {productDetails && (
              <div className="py-4 my-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                  {/* Left Column: Product Information */}
                  {prodInfoEntries.length > 0 && (
                    <div>
                      <h4 className="text-[15px] 2xl:text-[16px] font-bold text-[#1A1A1A] mb-3">
                        Product Information:
                      </h4>
                      <div className="space-y-2 text-[14px] 2xl:text-[15px]">
                        {prodInfoEntries.map(([key, val]) => (
                          <div key={key} className="text-[#1A1A1A]">
                            <span className="font-normal text-[#1A1A1A]">{key}:</span>{" "}
                            <span className="text-[#333333]">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Right Column: Accent stones */}
                  {accentEntries.length > 0 && (
                    <div>
                      <h4 className="text-[15px] 2xl:text-[16px] font-bold text-[#1A1A1A] mb-3">
                        Accent stones:
                      </h4>
                      <div className="space-y-2 text-[14px] 2xl:text-[15px]">
                        {accentEntries.map(([key, val]) => (
                          <div key={key} className="text-[#1A1A1A]">
                            <span className="font-normal text-[#1A1A1A]">{key}:</span>{" "}
                            <span className="text-[#333333]">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-[#7A7A7A] text-[12px] md:text-[13px] 2xl:text-[15px] font-light mt-2 italic">
              Please note weights, gem colours and sizes are approximate and may
              vary slightly.
            </p>

            {/* Inquiry Button */}
            <button
              onClick={() =>
                setInquiryState({
                  isOpen: true,
                  type: "product",
                  product: {
                    ...product,
                    selectedMetal:
                      selectedColor === "pt950"
                        ? "Platinum (pt950)"
                        : `${selectedKarat.toUpperCase()} ${
                            METAL_OPTIONS.find((m) => m.id === selectedColor)?.name || "White Gold"
                          }`,
                  },
                })
              }
              className="w-full bg-[#1A1A1A] text-white py-3.5 xl:py-4 text-[16px] 2xl:text-[20px] font-medium hover:bg-[#12798C] transition-colors 2xl:mb-8 xl:mb-6 mb-6 cursor-pointer tracking-wider uppercase mt-5"
            >
              Inquiry
            </button>
          </ScrollReveal>
        </div>
      </div>

      {/* CTA */}
      <CTA />
    </div>
  );
}

export default Productdetails;
