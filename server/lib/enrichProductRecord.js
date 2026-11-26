function enrichProductRecord(item) {
  const id = Number(item.id) || 1;
  const productDetails = item.productDetails || (item.specifications?.productInformation ? {
    productInformation: item.specifications.productInformation,
    accentStones: item.specifications.accentStones
  } : null);

  const specifications = {
    ...item.specifications,
    productDetails,
  };

  return {
    id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    subCategory: item.subCategory || null,
    productDetails,
    weightDetails: null,
    isBestseller: Boolean(item.isBestseller),
    isFeatured: item.isFeatured != null ? Boolean(item.isFeatured) : Boolean(item.isBestseller),
    price: 0,
    comparePrice: null,
    description: null,
    shortDescription: null,
    material: null,
    metal: null,
    brand: 'Parvati Jewels',
    rating: 0,
    reviewCount: 0,
    size: null,
    stock: 10,
    image: item.image,
    additionalImages: item.additionalImages,
    specifications,
  };
}

module.exports = { enrichProductRecord };
