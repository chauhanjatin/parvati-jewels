const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const existingProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Keep rings and all other categories except earrings
const ringProducts = existingProducts.filter((p) => p.category === 'rings');
const otherNonEarringProducts = existingProducts.filter(
  (p) => p.category !== 'rings' && p.category !== 'earrings'
);

// The 41 earrings from the screenshots
const earringsInput = [
  // 1. Halo Earring (13 items)
  { name: 'GER-1ECU-55-DIA', subCategory: 'halo-earring', shape: 'Cushion', bestseller: false },
  { name: 'GER-1OV-61', subCategory: 'halo-earring', shape: 'Oval', bestseller: false },
  { name: 'GER-1RAD-56', subCategory: 'halo-earring', shape: 'Radiant', bestseller: false },
  { name: 'GER-1SH-38', subCategory: 'halo-earring', shape: 'Round', bestseller: false },
  { name: 'PJE 55 Round', subCategory: 'halo-earring', shape: 'Round', bestseller: true },
  { name: 'PJE 61 Round', subCategory: 'halo-earring', shape: 'Round', bestseller: false },
  { name: 'PJE 62 Emerald', subCategory: 'halo-earring', shape: 'Emerald', bestseller: false },
  { name: 'PJE 75 Emerald', subCategory: 'halo-earring', shape: 'Emerald', bestseller: false },
  { name: 'PJE 82 Round', subCategory: 'halo-earring', shape: 'Round', bestseller: false },
  { name: 'PJE 86 Emerald', subCategory: 'halo-earring', shape: 'Emerald', bestseller: false },
  { name: 'PJE 89 Pear', subCategory: 'halo-earring', shape: 'Pear', bestseller: false },
  { name: 'PJE1', subCategory: 'halo-earring', shape: 'Round', bestseller: false },
  { name: 'PJE2', subCategory: 'halo-earring', shape: 'Round', bestseller: false },

  // 2. Hoop Earring (23 items)
  { name: 'GER-1RAD-35', subCategory: 'hoop-earring', shape: 'Radiant', bestseller: false },
  { name: 'GER-1RAD-52', subCategory: 'hoop-earring', shape: 'Radiant', bestseller: false },
  { name: 'GER-5OV-34', subCategory: 'hoop-earring', shape: 'Oval', bestseller: false },
  { name: 'GER-CS-12', subCategory: 'hoop-earring', shape: 'Round', bestseller: false },
  { name: 'GER-CS-13', subCategory: 'hoop-earring', shape: 'Round', bestseller: false },
  { name: 'GER-CS-16', subCategory: 'hoop-earring', shape: 'Round', bestseller: false },
  { name: 'GER-CS-50', subCategory: 'hoop-earring', shape: 'Round', bestseller: false },
  { name: 'GER-EM-18', subCategory: 'hoop-earring', shape: 'Emerald', bestseller: true },
  { name: 'GER-EM-40', subCategory: 'hoop-earring', shape: 'Emerald', bestseller: false },
  { name: 'GER-MQ-11', subCategory: 'hoop-earring', shape: 'Marquise', bestseller: false },
  { name: 'GER-MQ-32', subCategory: 'hoop-earring', shape: 'Marquise', bestseller: false },
  { name: 'GER-MQ-43', subCategory: 'hoop-earring', shape: 'Marquise', bestseller: false },
  { name: 'GER-OCT-21', subCategory: 'hoop-earring', shape: 'Emerald', bestseller: false },
  { name: 'GER-OV-51', subCategory: 'hoop-earring', shape: 'Oval', bestseller: false },
  { name: 'GER-PE-10', subCategory: 'hoop-earring', shape: 'Pear', bestseller: false },
  { name: 'GER-PE-18', subCategory: 'hoop-earring', shape: 'Pear', bestseller: false },
  { name: 'GER-PE-62', subCategory: 'hoop-earring', shape: 'Pear', bestseller: false },
  { name: 'PJE 57 Round', subCategory: 'hoop-earring', shape: 'Round', bestseller: false },
  { name: 'PJE 59 Pear', subCategory: 'hoop-earring', shape: 'Pear', bestseller: false },
  { name: 'PJE 64 Round', subCategory: 'hoop-earring', shape: 'Round', bestseller: false },
  { name: 'PJE 66 Bag', subCategory: 'hoop-earring', shape: 'Emerald', bestseller: false },
  { name: 'PJE 68 Bag', subCategory: 'hoop-earring', shape: 'Emerald', bestseller: false },
  { name: 'PJE 74 Round', subCategory: 'hoop-earring', shape: 'Round', bestseller: false },

  // 3. Single Stone Earring (5 items)
  { name: 'GER-65', subCategory: 'single-stone-earring', shape: 'Round', bestseller: false },
  { name: 'PJE 53 Round', subCategory: 'single-stone-earring', shape: 'Round', bestseller: true },
  { name: 'PJE 54 Round', subCategory: 'single-stone-earring', shape: 'Round', bestseller: false },
  { name: 'PJE 58 Asscher', subCategory: 'single-stone-earring', shape: 'Asscher', bestseller: false },
  { name: 'PJE 93 Emerald', subCategory: 'single-stone-earring', shape: 'Emerald', bestseller: false },
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
    'Head size (mm)',
    'Approx Ct Wt',
    '9kt',
    '14kt',
    '18kt',
    'Plat',
  ],
  rows: [
    ['4.0mm', '0.32', '2.49', '2.90', '3.48', '4.52'],
    ['5.0mm', '0.40', '2.75', '3.19', '3.83', '4.99'],
    ['6.5mm', '0.60', '3.33', '3.89', '4.64', '6.03'],
  ],
};

let currentId = 1;

// 1. Rings (1 to 57)
const renumberedRings = ringProducts.map((p) => ({
  ...p,
  id: currentId++,
}));

// 2. Earrings (58 to 98)
const newEarrings = earringsInput.map((item) => {
  const slug = slugify(item.name);
  const specifications = {
    stone_shape: item.shape,
    weightDetails: standardWeightDetails,
  };

  return {
    id: currentId++,
    name: item.name,
    slug,
    category: 'earrings',
    subCategory: item.subCategory,
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
    image: '../assets/dummy-data/earring1.webp',
    additionalImages: [
      '../assets/dummy-data/earring2.webp',
      '../assets/dummy-data/earring3.webp',
    ],
    weightDetails: standardWeightDetails,
    specifications,
  };
});

// 3. Other categories (bracelets, necklaces, pendants, diamonds)
const renumberedOthers = otherNonEarringProducts.map((p) => ({
  ...p,
  id: currentId++,
}));

const allProducts = [...renumberedRings, ...newEarrings, ...renumberedOthers];

fs.writeFileSync(
  productsFilePath,
  JSON.stringify(allProducts, null, 2),
  'utf8'
);

console.log(`Successfully updated ${productsFilePath}`);
console.log(`Total rings: ${renumberedRings.length}`);
console.log(`Total earrings created: ${newEarrings.length}`);
console.log(`Total other products: ${renumberedOthers.length}`);
console.log(`Total overall products: ${allProducts.length}`);
