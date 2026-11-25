const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const existingProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Filter out old pendants
const nonPendantProducts = existingProducts.filter(
  (p) => p.category !== 'pendants' && p.category !== 'pendant'
);

// All 36 pendants across the 4 subcategories
const pendantsInput = [
  // 1. CROSS PENDANT (8 items)
  { name: 'PJP 212 Round', subCategory: 'cross-pendant', shape: 'Round', bestseller: true },
  { name: 'PJP 213 LC1', subCategory: 'cross-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 213 LC2', subCategory: 'cross-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 213 LC3', subCategory: 'cross-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 213 LC4', subCategory: 'cross-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 215 A15 (1)', subCategory: 'cross-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 215 A15 (2)', subCategory: 'cross-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 215 A15 (3)', subCategory: 'cross-pendant', shape: 'Round', bestseller: false },

  // 2. HALO PENDANT (12 items)
  { name: 'PJP 111 Blue CS', subCategory: 'halo-pendant', shape: 'Cushion', bestseller: true },
  { name: 'PJP 111 Emerald', subCategory: 'halo-pendant', shape: 'Emerald', bestseller: false },
  { name: 'PJP 202 Cushion', subCategory: 'halo-pendant', shape: 'Cushion', bestseller: false },
  { name: 'PJP 203 Cushion', subCategory: 'halo-pendant', shape: 'Cushion', bestseller: false },
  { name: 'PJP 204 Emerald', subCategory: 'halo-pendant', shape: 'Emerald', bestseller: true },
  { name: 'PJP 205 Emerald', subCategory: 'halo-pendant', shape: 'Emerald', bestseller: false },
  { name: 'PJP 206 Oval', subCategory: 'halo-pendant', shape: 'Oval', bestseller: false },
  { name: 'PJP 207 Oval', subCategory: 'halo-pendant', shape: 'Oval', bestseller: false },
  { name: 'PJP 208 Pear', subCategory: 'halo-pendant', shape: 'Pear', bestseller: false },
  { name: 'PJP 209 Pear', subCategory: 'halo-pendant', shape: 'Pear', bestseller: false },
  { name: 'PJP 210 Round', subCategory: 'halo-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 211 Round', subCategory: 'halo-pendant', shape: 'Round', bestseller: false },

  // 3. SINGLE STONE PENDANT (12 items)
  { name: 'PJP 201 Emerald', subCategory: 'single-stone-pendant', shape: 'Emerald', bestseller: true },
  { name: 'PJP 201 Oval', subCategory: 'single-stone-pendant', shape: 'Oval', bestseller: false },
  { name: 'PJP 201 Princess', subCategory: 'single-stone-pendant', shape: 'Princess', bestseller: false },
  { name: 'PJP 201 Radiant', subCategory: 'single-stone-pendant', shape: 'Radiant', bestseller: false },
  { name: 'PJP 201 Round', subCategory: 'single-stone-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 221 Emerald', subCategory: 'single-stone-pendant', shape: 'Emerald', bestseller: false },
  { name: 'PJP 221 Princess', subCategory: 'single-stone-pendant', shape: 'Princess', bestseller: false },
  { name: 'PJP 221 Radiant', subCategory: 'single-stone-pendant', shape: 'Radiant', bestseller: false },
  { name: 'PJP 221 Round', subCategory: 'single-stone-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 222 Princess', subCategory: 'single-stone-pendant', shape: 'Princess', bestseller: false },
  { name: 'PJP 222 Round', subCategory: 'single-stone-pendant', shape: 'Round', bestseller: false },
  { name: 'PJP 221 Pear', subCategory: 'single-stone-pendant', shape: 'Pear', bestseller: false },

  // 4. TWO STONE PANDNET (4 items)
  { name: 'GPD-1MX-66', subCategory: 'two-stone-pendant', shape: 'Round', bestseller: true },
  { name: 'GPD-1MX-139', subCategory: 'two-stone-pendant', shape: 'Round', bestseller: false },
  { name: 'GPD-1MX-140', subCategory: 'two-stone-pendant', shape: 'Round', bestseller: false },
  { name: 'GPD-1MX-141', subCategory: 'two-stone-pendant', shape: 'Round', bestseller: false },
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

// 1. Rings, Earrings, Bracelets, Necklaces (all before pendants)
const beforePendants = nonPendantProducts
  .filter((p) => p.category !== 'diamonds')
  .map((p) => ({ ...p, id: currentId++ }));

// 2. New Pendants (36 items)
const newPendants = pendantsInput.map((item) => {
  const slug = slugify(item.name);
  const specifications = {
    stone_shape: item.shape,
    weightDetails: standardWeightDetails,
  };

  return {
    id: currentId++,
    name: item.name,
    slug,
    category: 'pendants',
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
    image: '../assets/dummy-data/pendant1.webp',
    additionalImages: [
      '../assets/dummy-data/pendant2.webp',
      '../assets/dummy-data/pendant3.webp',
    ],
    weightDetails: standardWeightDetails,
    specifications,
  };
});

// 3. Diamonds (10 items)
const afterPendants = nonPendantProducts
  .filter((p) => p.category === 'diamonds')
  .map((p) => ({ ...p, id: currentId++ }));

const combined = [...beforePendants, ...newPendants, ...afterPendants];

// Backup old products.json
fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'products.json.pendant.bak'),
  JSON.stringify(existingProducts, null, 2)
);

// Write updated products.json
fs.writeFileSync(productsFilePath, JSON.stringify(combined, null, 2));

console.log(`Successfully updated ${productsFilePath}`);
console.log(`Total before pendants: ${beforePendants.length}`);
console.log(`Total pendants created: ${newPendants.length}`);
console.log(`Total diamonds after: ${afterPendants.length}`);
console.log(`Total overall products: ${combined.length}`);
