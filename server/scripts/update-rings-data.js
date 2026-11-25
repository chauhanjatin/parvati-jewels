const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const existingProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Non-ring products to keep
const nonRingProducts = existingProducts.filter((p) => p.category !== 'rings');

// The 57 rings from the 8 screenshots
const ringsInput = [
  // 1. 3 Stone Ring (3 items)
  { name: 'PJR 506 Marquise', subCategory: '3-stone-ring', shape: 'Marquise', bestseller: true },
  { name: 'PJR 548 Emerald', subCategory: '3-stone-ring', shape: 'Emerald', bestseller: false },
  { name: 'PJR 631 Round 3stone', subCategory: '3-stone-ring', shape: 'Round', bestseller: false },

  // 2. Art Deco (10 items)
  { name: 'A145', subCategory: 'art-deco', shape: 'Emerald', bestseller: false },
  { name: 'GRG-62', subCategory: 'art-deco', shape: 'Round', bestseller: false },
  { name: 'PJR 38 Asscher', subCategory: 'art-deco', shape: 'Asscher', bestseller: false },
  { name: 'PJR 38 Cushion', subCategory: 'art-deco', shape: 'Cushion', bestseller: true },
  { name: 'PJR 38 Oval', subCategory: 'art-deco', shape: 'Oval', bestseller: false },
  { name: 'PJR 71 Radiant CS', subCategory: 'art-deco', shape: 'Radiant', bestseller: false },
  { name: 'PJR 75 Radiant', subCategory: 'art-deco', shape: 'Radiant', bestseller: false },
  { name: 'PJR 110 Emerald CS', subCategory: 'art-deco', shape: 'Emerald', bestseller: false },
  { name: 'PJR 153 Emerald', subCategory: 'art-deco', shape: 'Emerald', bestseller: false },
  { name: 'PJR 513 Oval CS', subCategory: 'art-deco', shape: 'Oval', bestseller: false },

  // 3. Color Stone Ring (6 items)
  { name: 'PJR 314 (PE-EM) CS', subCategory: 'color-stone-ring', shape: 'Pear', bestseller: true },
  { name: 'PJR 315 (MQ-OV) CS', subCategory: 'color-stone-ring', shape: 'Marquise', bestseller: false },
  { name: 'PJR 363 (OV-PE) CS', subCategory: 'color-stone-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 371 (OV-PE) CS', subCategory: 'color-stone-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 551 Emerald CS', subCategory: 'color-stone-ring', shape: 'Emerald', bestseller: false },
  { name: 'PJR 553 Marquise CS', subCategory: 'color-stone-ring', shape: 'Marquise', bestseller: false },

  // 4. ET (12 items)
  { name: 'PJR 591 Round', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 594 Round', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 601 Round Full', subCategory: 'et', shape: 'Round', bestseller: true },
  { name: 'PJR 602 Round Half', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 605 Round Full Eternity', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 608 Half', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 609 Full', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 611 Half', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 614 Half', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 615 7stone', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 618 Half', subCategory: 'et', shape: 'Round', bestseller: false },
  { name: 'PJR 630 Round 5stone', subCategory: 'et', shape: 'Round', bestseller: false },

  // 5. Halo Ring (6 items)
  { name: 'GRG-OV-23', subCategory: 'halo-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 512 Emerald', subCategory: 'halo-ring', shape: 'Emerald', bestseller: true },
  { name: 'PJR 537 Round', subCategory: 'halo-ring', shape: 'Round', bestseller: false },
  { name: 'PJR 540 Oval', subCategory: 'halo-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 579 Cushion', subCategory: 'halo-ring', shape: 'Cushion', bestseller: false },
  { name: 'PJR 582 Oval', subCategory: 'halo-ring', shape: 'Oval', bestseller: false },

  // 6. Plain Solitaire Ring (10 items)
  { name: 'PJR 318 Emerald', subCategory: 'plain-solitaire-ring', shape: 'Emerald', bestseller: false },
  { name: 'PJR 318 Oval', subCategory: 'plain-solitaire-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 501 Round', subCategory: 'plain-solitaire-ring', shape: 'Round', bestseller: true },
  { name: 'PJR 502 Round', subCategory: 'plain-solitaire-ring', shape: 'Round', bestseller: false },
  { name: 'PJR 504 Round', subCategory: 'plain-solitaire-ring', shape: 'Round', bestseller: false },
  { name: 'PJR 505 Round', subCategory: 'plain-solitaire-ring', shape: 'Round', bestseller: false },
  { name: 'PJR 519 Pear', subCategory: 'plain-solitaire-ring', shape: 'Pear', bestseller: false },
  { name: 'PJR 538 Oval', subCategory: 'plain-solitaire-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 541 Pear', subCategory: 'plain-solitaire-ring', shape: 'Pear', bestseller: false },
  { name: 'PJR 556 Princess', subCategory: 'plain-solitaire-ring', shape: 'Princess', bestseller: false },

  // 7. Side Stone Ring (8 items)
  { name: 'PJR 516 Marquise', subCategory: 'side-stone-ring', shape: 'Marquise', bestseller: true },
  { name: 'PJR 518 Pear', subCategory: 'side-stone-ring', shape: 'Pear', bestseller: false },
  { name: 'PJR 520 Emerald', subCategory: 'side-stone-ring', shape: 'Emerald', bestseller: false },
  { name: 'PJR 536 Round', subCategory: 'side-stone-ring', shape: 'Round', bestseller: false },
  { name: 'PJR 547 Oval', subCategory: 'side-stone-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 584 Oval', subCategory: 'side-stone-ring', shape: 'Oval', bestseller: false },
  { name: 'PJR 628 Round', subCategory: 'side-stone-ring', shape: 'Round', bestseller: false },
  { name: 'PJR 722 Round', subCategory: 'side-stone-ring', shape: 'Round', bestseller: false },

  // 8. Toi Moi Ring (2 items)
  { name: 'PJR 363 (PE-EM)', subCategory: 'toi-moi-ring', shape: 'Pear', bestseller: true },
  { name: 'PJR 371 (PE-EM)', subCategory: 'toi-moi-ring', shape: 'Pear', bestseller: false },
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
    ['4.0mm', '0.56', '2.49', '2.90', '3.48', '4.52'],
    ['5.0mm', '0.70', '2.75', '3.19', '3.83', '4.99'],
    ['6.5mm', '1.05', '3.33', '3.89', '4.64', '6.03'],
  ],
};

let currentId = 1;
const newRingProducts = ringsInput.map((item) => {
  const slug = slugify(item.name);
  const specifications = {
    stone_shape: item.shape,
    weightDetails: standardWeightDetails,
  };

  return {
    id: currentId++,
    name: item.name,
    slug,
    category: 'rings',
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
    image: '../assets/dummy-data/demo.png',
    additionalImages: [
      '../assets/dummy-data/demo2.png',
      '../assets/dummy-data/demo3.png',
    ],
    weightDetails: standardWeightDetails,
    specifications,
  };
});

// Update IDs for non-ring products
const renumberedNonRings = nonRingProducts.map((p) => ({
  ...p,
  id: currentId++,
}));

const combinedProducts = [...newRingProducts, ...renumberedNonRings];

fs.writeFileSync(
  productsFilePath,
  JSON.stringify(combinedProducts, null, 2),
  'utf8'
);

console.log(`Successfully updated ${productsFilePath}`);
console.log(`Total rings created: ${newRingProducts.length}`);
console.log(`Total other products: ${renumberedNonRings.length}`);
console.log(`Total overall products: ${combinedProducts.length}`);
