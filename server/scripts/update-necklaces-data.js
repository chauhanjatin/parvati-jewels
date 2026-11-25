const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const existingProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Keep all products except necklaces
const nonNecklaceProducts = existingProducts.filter((p) => p.category !== 'necklaces');

// The 22 necklaces from the screenshot
const necklacesInput = [
  { name: 'A26', shape: 'Round', bestseller: true },
  { name: 'A41', shape: 'Round', bestseller: false },
  { name: 'A42', shape: 'Round', bestseller: false },
  { name: 'A73', shape: 'Round', bestseller: false },
  { name: 'A74', shape: 'Round', bestseller: false },
  { name: 'A140', shape: 'Emerald', bestseller: false },
  { name: 'A149', shape: 'Emerald', bestseller: false },
  { name: 'GNK-03', shape: 'Round', bestseller: false },
  { name: 'GNK-39 62GM', shape: 'Round', bestseller: false },
  { name: 'GNK-EM-30', shape: 'Emerald', bestseller: true },
  { name: 'GNK-EM-31', shape: 'Emerald', bestseller: false },
  { name: 'GNK-OV-32', shape: 'Oval', bestseller: false },
  { name: 'GNK-OV-35', shape: 'Oval', bestseller: true },
  { name: 'GNK-OV-36', shape: 'Oval', bestseller: false },
  { name: 'GNK-OV-37', shape: 'Oval', bestseller: false },
  { name: 'GNK-OV-38', shape: 'Oval', bestseller: false },
  { name: 'GNK-PE-29', shape: 'Pear', bestseller: false },
  { name: 'GNK-PE-34', shape: 'Pear', bestseller: false },
  { name: 'GNK-RD-09', shape: 'Round', bestseller: false },
  { name: 'GNK-RD-27', shape: 'Round', bestseller: false },
  { name: 'GNK-RD-28', shape: 'Round', bestseller: false },
  { name: 'GNK-RD-33', shape: 'Round', bestseller: false },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const standardWeightDetails = {
  type: 'list',
  title: 'Metal & Weight Breakdown',
  items: [
    {
      label: '14KT Gold',
      grossWeight: '66 GM',
      finishWeight: '61 GM',
    },
    {
      label: '18KT Gold',
      grossWeight: '79 GM',
      finishWeight: '73 GM',
    },
  ],
};

let currentId = 1;

// 1. Rings & Earrings & Bracelets (before necklaces)
const beforeNecklaces = nonNecklaceProducts
  .filter((p) => p.category === 'rings' || p.category === 'earrings' || p.category === 'bracelets')
  .map((p) => ({ ...p, id: currentId++ }));

// 2. Necklaces (22 items)
const newNecklaces = necklacesInput.map((item) => {
  const slug = slugify(item.name);
  const specifications = {
    stone_shape: item.shape,
    weightDetails: standardWeightDetails,
  };

  return {
    id: currentId++,
    name: item.name,
    slug,
    category: 'necklaces',
    subCategory: null,
    isBestseller: item.bestseller,
    isFeatured: item.bestseller,
    price: 0,
    comparePrice: null,
    description: '',
    shortDescription: '',
    material: '',
    metal: '',
    brand: 'Parvati Jewels',
    rating: 0,
    reviewCount: 0,
    size: '',
    stock: 21,
    image: '../assets/dummy-data/necklace1.webp',
    additionalImages: [
      '../assets/dummy-data/necklace2.webp',
      '../assets/dummy-data/necklace3.webp',
    ],
    weightDetails: standardWeightDetails,
    specifications,
  };
});

// 3. Pendants & Diamonds (after necklaces)
const afterNecklaces = nonNecklaceProducts
  .filter((p) => p.category === 'pendants' || p.category === 'diamonds')
  .map((p) => ({ ...p, id: currentId++ }));

const allProducts = [...beforeNecklaces, ...newNecklaces, ...afterNecklaces];

fs.writeFileSync(
  productsFilePath,
  JSON.stringify(allProducts, null, 2),
  'utf8'
);

console.log(`Successfully updated ${productsFilePath}`);
console.log(`Total before necklaces: ${beforeNecklaces.length}`);
console.log(`Total necklaces created: ${newNecklaces.length}`);
console.log(`Total after necklaces: ${afterNecklaces.length}`);
console.log(`Total overall products: ${allProducts.length}`);
