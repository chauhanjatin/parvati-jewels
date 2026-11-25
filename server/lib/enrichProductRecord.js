function enrichProductRecord(item) {
  const id = Number(item.id) || 1;
  const weightDetails =
    item.weightDetails || item.specifications?.weightDetails || null;

  const specifications = weightDetails ? { weightDetails } : {};

  return {
    id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    subCategory: item.subCategory || null,
    weightDetails,
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
