const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const existingProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Keep all products except bracelets
const nonBraceletProducts = existingProducts.filter((p) => p.category !== 'bracelets');

// The 38 bracelets from the screenshot
const braceletsInput = [
  { name: 'GBG-RD-26', shape: 'Round', bestseller: true },
  { name: 'PJBR 21 Mix Bug-Round', shape: 'Round', bestseller: false },
  { name: 'PJBR 201 Emerald', shape: 'Emerald', bestseller: true },
  { name: 'PJBR 202 Emerald', shape: 'Emerald', bestseller: false },
  { name: 'PJBR 203 Oval', shape: 'Oval', bestseller: false },
  { name: 'PJBR 204 Marquise', shape: 'Marquise', bestseller: false },
  { name: 'PJBR 205 Mix Oval', shape: 'Oval', bestseller: false },
  { name: 'PJBR 206 Round', shape: 'Round', bestseller: false },
  { name: 'PJBR 207 Mix OV-MQ', shape: 'Oval', bestseller: false },
  { name: 'PJBR 208 Mix PE-MQ', shape: 'Pear', bestseller: false },
  { name: 'PJBR 209 Mix EM-RD', shape: 'Emerald', bestseller: false },
  { name: 'PJBR 210 Mix PE-RD', shape: 'Pear', bestseller: false },
  { name: 'PJBR 211 Oval', shape: 'Oval', bestseller: false },
  { name: 'PJBR 212 Pear', shape: 'Pear', bestseller: false },
  { name: 'PJBR 500 Round', shape: 'Round', bestseller: false },
  { name: 'PJBR 501 Round', shape: 'Round', bestseller: false },
  { name: 'PJBR 506 Across-EM-BZ', shape: 'Emerald', bestseller: true },
  { name: 'PJBR 506 Across-OV-BZ', shape: 'Oval', bestseller: false },
  { name: 'PJBR 506 EM-BZ', shape: 'Emerald', bestseller: false },
  { name: 'PJBR 506 OV-BZ', shape: 'Oval', bestseller: false },
  { name: 'PJBR 506 PE-BZ', shape: 'Pear', bestseller: false },
  { name: 'PJBR 506 RD-BZ', shape: 'Round', bestseller: false },
  { name: 'PJBR 508 Pear', shape: 'Pear', bestseller: false },
  { name: 'PJBR 513 Pear', shape: 'Pear', bestseller: false },
  { name: 'PJBR 514 Round', shape: 'Round', bestseller: false },
  { name: 'PJBR 516 MLT RD-PR', shape: 'Round', bestseller: false },
  { name: 'PJBR 520 Across-OV-BZ', shape: 'Oval', bestseller: true },
  { name: 'PJBR 520 Across-EM-BZ', shape: 'Emerald', bestseller: false },
  { name: 'PJBR 520 EM-BZ', shape: 'Emerald', bestseller: false },
  { name: 'PJBR 520 OV-BZ', shape: 'Oval', bestseller: false },
  { name: 'PJBR 520 PE-BZ', shape: 'Pear', bestseller: false },
  { name: 'PJBR 520 RD-BZ', shape: 'Round', bestseller: false },
  { name: 'PJBR 521 Across-EM', shape: 'Emerald', bestseller: false },
  { name: 'PJBR 521 Emerald', shape: 'Emerald', bestseller: false },
  { name: 'PJBR 522 across Oval', shape: 'Oval', bestseller: false },
  { name: 'PJBR 523 Pear', shape: 'Pear', bestseller: false },
  { name: 'PJBR 524 Round', shape: 'Round', bestseller: false },
  { name: 'PJBR 525 MLT', shape: 'Round', bestseller: false },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const standardWeightDetails = {
  type: 'table',
  title: 'Metal & Weight Breakdown',
  headers: [
    'Head size',
    'Approx Ct Wt',
    'PT',
    '9kt',
    '14kt',
    '18kt',
    'Plat',
  ],
  rows: [
    [
      '3.5x2.2 mm - 2mm',
      '2.68',
      '11-3',
      '4.70',
      '5.46',
      '6.54',
      '8.53',
    ],
  ],
};

let currentId = 1;

// 1. Rings & Earrings (before bracelets)
const beforeBracelets = nonBraceletProducts
  .filter((p) => p.category === 'rings' || p.category === 'earrings')
  .map((p) => ({ ...p, id: currentId++ }));

// 2. Bracelets (38 items)
const newBracelets = braceletsInput.map((item) => {
  const slug = slugify(item.name);
  const specifications = {
    stone_shape: item.shape,
    weightDetails: standardWeightDetails,
  };

  return {
    id: currentId++,
    name: item.name,
    slug,
    category: 'bracelets',
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
    image: '../assets/dummy-data/bracelet1.webp',
    additionalImages: [
      '../assets/dummy-data/bracelet2.webp',
      '../assets/dummy-data/bracelet3.webp',
    ],
    weightDetails: standardWeightDetails,
    specifications,
  };
});

// 3. Necklaces, Pendants & Diamonds (after bracelets)
const afterBracelets = nonBraceletProducts
  .filter((p) => p.category !== 'rings' && p.category !== 'earrings')
  .map((p) => ({ ...p, id: currentId++ }));

const allProducts = [...beforeBracelets, ...newBracelets, ...afterBracelets];

fs.writeFileSync(
  productsFilePath,
  JSON.stringify(allProducts, null, 2),
  'utf8'
);

console.log(`Successfully updated ${productsFilePath}`);
console.log(`Total before bracelets: ${beforeBracelets.length}`);
console.log(`Total bracelets created: ${newBracelets.length}`);
console.log(`Total after bracelets: ${afterBracelets.length}`);
console.log(`Total overall products: ${allProducts.length}`);
