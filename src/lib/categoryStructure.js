export const CATEGORY_STRUCTURE = {
  rings: {
    slug: 'rings',
    name: 'Rings',
    title: 'RINGS',
    subCategories: [
      { slug: '3-stone-ring', name: '3 Stone Ring' },
      { slug: 'art-deco', name: 'Art Deco' },
      { slug: 'color-stone-ring', name: 'Color Stone Ring' },
      { slug: 'et', name: 'ET (Eternity Band)' },
      { slug: 'halo-ring', name: 'Halo Ring' },
      { slug: 'plain-solitaire-ring', name: 'Plain Solitaire Ring' },
      { slug: 'side-stone-ring', name: 'Side Stone Ring' },
      { slug: 'toi-moi-ring', name: 'Toi Moi Ring' },
    ],
  },
  earrings: {
    slug: 'earrings',
    name: 'Earrings',
    title: 'EARRINGS',
    subCategories: [
      { slug: 'halo-earring', name: 'Halo Earring' },
      { slug: 'hoop-earring', name: 'Hoop Earring' },
      { slug: 'single-stone-earring', name: 'Single Stone Earring' },
    ],
  },
  bracelets: {
    slug: 'bracelets',
    name: 'Bracelets',
    title: 'BRACELETS',
    subCategories: [],
  },
  necklace: {
    slug: 'necklace',
    name: 'Necklaces',
    title: 'NECKLACES',
    subCategories: [],
  },
  necklaces: {
    slug: 'necklace',
    name: 'Necklaces',
    title: 'NECKLACES',
    subCategories: [],
  },
  pendant: {
    slug: 'pendant',
    name: 'Pendants',
    title: 'PENDANTS',
    subCategories: [
      { slug: 'cross-pendant', name: 'Cross Pendant' },
      { slug: 'halo-pendant', name: 'Halo Pendant' },
      { slug: 'single-stone-pendant', name: 'Single Stone Pendant' },
      { slug: 'two-stone-pendant', name: 'Two Stone Pendant' },
    ],
  },
  pendants: {
    slug: 'pendant',
    name: 'Pendants',
    title: 'PENDANTS',
    subCategories: [
      { slug: 'cross-pendant', name: 'Cross Pendant' },
      { slug: 'halo-pendant', name: 'Halo Pendant' },
      { slug: 'single-stone-pendant', name: 'Single Stone Pendant' },
      { slug: 'two-stone-pendant', name: 'Two Stone Pendant' },
    ],
  },
};

export function getCategoryInfo(slug) {
  const normalized = (slug || 'rings').toLowerCase();
  return CATEGORY_STRUCTURE[normalized] || CATEGORY_STRUCTURE.rings;
}

export function getSubCategories(slug) {
  const info = getCategoryInfo(slug);
  return info?.subCategories || [];
}
