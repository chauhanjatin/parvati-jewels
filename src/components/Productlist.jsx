import React, { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import CTA from './CTA'
import ScrollReveal from './ScrollReveal'
import bestsellerTag from '../assets/bestsellers.png'
import { fetchJson } from '../lib/api'
import Loader from './Loader'
import { productImageUrl } from '../lib/productImage'
import { getSubCategories } from '../lib/categoryStructure'

import ringsBanner from '../assets/ring-heroimg.png'
import earringsBanner from '../assets/earrings-heroimg.png'
import necklaceBanner from '../assets/necklace-heroimg.png'
import braceletBanner from '../assets/bracelet-heroimg.png'
import pendantBanner from '../assets/pendant-heroimg.png'

const categoryData = {
  rings: { title: 'RINGS', banner: ringsBanner },
  earrings: { title: 'EARRINGS', banner: earringsBanner },
  necklace: { title: 'NECKLACES', banner: necklaceBanner },
  necklaces: { title: 'NECKLACES', banner: necklaceBanner },
  bracelets: { title: 'BRACELETS', banner: braceletBanner },
  pendant: { title: 'PENDANTS', banner: pendantBanner },
  pendants: { title: 'PENDANTS', banner: pendantBanner },
};

function Productlist() {
  const { categorySlug } = useParams();
  const currentCategory = categoryData[categorySlug] || categoryData.rings;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubCategory = searchParams.get('subCategory') || 'all';

  const availableSubCategories = getSubCategories(categorySlug);
  const activeSubCategoryObj = availableSubCategories.find(s => s.slug === selectedSubCategory);

  useEffect(() => {
    setLoading(true);
    fetchJson(`/api/products?category=${categorySlug || 'rings'}`)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [categorySlug]);

  const handleSubCategoryChange = (slugVal) => {
    const newParams = new URLSearchParams(searchParams);
    if (slugVal === 'all') {
      newParams.delete('subCategory');
    } else {
      newParams.set('subCategory', slugVal);
    }
    setSearchParams(newParams);
  };

  const displayedProducts = selectedSubCategory === 'all'
    ? products
    : products.filter(p => p.subCategory === selectedSubCategory);

  if (loading) {
    return <Loader isLoading={true} />;
  }
  if (error) {
    return <div className="py-20 text-center text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className='xl:pb-6 lg:pb-10 pb-8'>
        {/* Hero */}
        <section className="relative 3xl:h-[350px] 2xl:h-[400px] xl:h-[380px] lg:h-[307px] md:h-[240px] h-[200px] flex items-center overflow-hidden bg-[#227b8e]">
          <div className="absolute right-[8%] top-0 z-0 h-full w-[40%] bg-[#AAD1D8] blur-[100px]"></div>
          <ScrollReveal animation="fade-left" duration={900} delay={150} className="absolute z-0 w-[336px] sm:w-[300px] md:w-[404px] lg:w-[515px] xl:w-[638px] 2xl:w-[672px] 3xl:w-[38%] 2xl:right-[12%] 3xl:right-[10%] xl:right-[5%] lg:right-[2%] right-[0%] opacity-100 mx-auto flex justify-center">
            <img src={currentCategory.banner} alt="productBanner" className="w-full h-auto object-contain" />
          </ScrollReveal>
          <div className="absolute inset-0 bg-black/40 md:hidden z-[5]"></div>
          <div className="container mx-auto px-6 z-10 relative">
            <div className="flex">
              <ScrollReveal animation="fade-right" duration={900} className="w-full md:w-1/2 flex flex-col items-center text-white mt-4 md:mt-0 text-center md:text-left relative z-10">
                <p className="xl:text-[28px] lg:text-[24px] md:text-[20px] 3xl:text-[26px] text-[16px] lg:mb-7 mb-3 uppercase drop-shadow-md">Its time to show off your</p>
                <h1 className="font-bellefair text-[40px] md:text-[50px] lg:text-[54px] xl:text-[64px] 2xl:text-[92px] 3xl:text-[88px] leading-[100%] mb-4 md:mb-7 3xl:mb-0 drop-shadow-lg">
                  {currentCategory.title}
                </h1>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Main Section */}
        <section className="container mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:mb-10 mb-8 lg:mt-14 mt-10 pb-4 border-b border-gray-200">
              {/* Breadcrumb & Active Count */}
              <div className="text-[14px] 2xl:text-[16px] text-[#3D3D3D] tracking-widest uppercase font-medium flex items-center flex-wrap gap-1">
                <Link to="/" className="hover:text-black transition-colors">HOME</Link>
                <span className="mx-2 text-gray-400">|</span>
                <span className=
                "text-[#3D3D3D]">{currentCategory.title}</span>
                {activeSubCategoryObj && (
                  <>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-[#0C758C] font-semibold">{activeSubCategoryObj.name}</span>
                  </>
                )}
                <span className="ml-2 text-xs text-gray-500 font-normal">
                  ({displayedProducts.length} {displayedProducts.length === 1 ? 'Design' : 'Designs'})
                </span>
              </div>

              {/* Sub-Category Dropdown Filter */}
              {availableSubCategories.length > 0 && (
                <div className="flex items-center gap-3">
                  <label htmlFor="subCategorySelect" className="text-[13px] 2xl:text-[14px] font-medium text-[#1A1A1A] uppercase tracking-wider whitespace-nowrap">
                    Filter by Style:
                  </label>
                  <div className="relative min-w-[220px]">
                    <select
                      id="subCategorySelect"
                      value={selectedSubCategory}
                      onChange={(e) => handleSubCategoryChange(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#0C758C]/50 hover:border-[#0C758C] focus:border-[#0C758C] focus:ring-1 focus:ring-[#0C758C] px-4 py-2 text-[14px] text-[#1A1A1A] font-medium transition-all cursor-pointer pr-10 focus:outline-none shadow-sm rounded-none"
                    >
                      <option value="all">All Styles ({products.length})</option>
                      {availableSubCategories.map((sub) => {
                        const count = products.filter(p => p.subCategory === sub.slug).length;
                        return (
                          <option key={sub.slug} value={sub.slug}>
                            {sub.name} {count > 0 ? `(${count})` : ''}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#0C758C]">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  {selectedSubCategory !== 'all' && (
                    <button
                      onClick={() => handleSubCategoryChange('all')}
                      className="text-[12px] text-gray-500 hover:text-red-600 underline cursor-pointer whitespace-nowrap"
                      title="Clear Filter"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Product Grid */}
          {displayedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500 text-lg mb-4">No designs found for this style.</p>
              <button
                onClick={() => handleSubCategoryChange('all')}
                className="bg-[#0C758C] text-white px-6 py-2.5 text-sm uppercase font-medium hover:bg-[#1A1A1A] transition-colors"
              >
                View All {currentCategory.title}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {displayedProducts.map((product, index) => (
                <ScrollReveal 
                  key={product.id} 
                  animation="fade-up" 
                  delay={(index % 4) * 120} 
                  className="flex flex-col">
                  <Link to={`/products/${product.slug}`} state={{ category: categorySlug }} className="relative w-full flex items-center justify-center mb-5 overflow-hidden group">
                    {product.isBestseller && (
                      <div className="absolute top-4 left-0 z-10">
                        <img src={bestsellerTag} alt="bestsellerTag" />
                      </div>
                    )}
                    {product.primaryImage ? (
                      <img src={productImageUrl(product.primaryImage)} alt={product.name} className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500 h-[280px] w-full" />
                    ) : (
                      <div className="w-full h-[250px] bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </Link>
                  <h3 className="text-center text-[16px] 2xl:text-[24px] text-[#1A1A1A] uppercase">
                    {product.productDetails?.productInformation?.['Product Name'] || product.name}
                  </h3>
                  {product.subCategoryName && (
                    <p className="text-center text-[12px] text-[#0C758C] uppercase tracking-wider font-medium mt-1">
                      {product.subCategoryName}
                    </p>
                  )}
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
      <CTA/>
    </div>
  )
}

export default Productlist
