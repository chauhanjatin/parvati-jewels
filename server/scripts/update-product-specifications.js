const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

function detectStoneShape(name, slug) {
  const str = (name + ' ' + slug).toLowerCase();
  if (str.includes('marquise')) return 'Marquise';
  if (str.includes('emerald') || str.includes('oct')) return 'Emerald';
  if (str.includes('oval') || str.includes('1ov') || str.includes('50v')) return 'Oval';
  if (str.includes('pear')) return 'Pear';
  if (str.includes('radiant') || str.includes('rad')) return 'Radiant';
  if (str.includes('cushion') || str.includes('ecu') || str.includes('cs')) return 'Cushion';
  if (str.includes('princess')) return 'Princess';
  if (str.includes('asscher')) return 'Asscher';
  if (str.includes('heart')) return 'Heart';
  return 'Round';
}

function buildDetails(product) {
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subCategory || '').toLowerCase();
  const name = product.name || '';
  const slug = product.slug || '';
  const shape = detectStoneShape(name, slug);

  // Special match for PJR 553 Marquise CS from Screenshot 2
  if (slug === 'pjr-553-marquise-cs' || slug.includes('553-marquise')) {
    return {
      productInformation: {
        "Setting": "Prong Setting",
        "Ring Style": "Three Stone",
        "Main Stone": "Marquise Diamond",
        "Side Stones": "Baguette Diamonds",
        "Band width": "2.00 mm",
        "Band thickness": "1.60 mm",
        "Finish": "High Polish"
      },
      accentStones: {
        "Type": "Diamonds",
        "Total weight": "approx. 0.70ct",
        "Setting": "Prong Setting",
        "Colour": "DE",
        "Clarity": "VVS/VS"
      }
    };
  }

  if (cat === 'rings') {
    if (sub === '3-stone-ring') {
      return {
        productInformation: {
          "Setting": "Prong Setting",
          "Ring Style": "Three Stone",
          "Main Stone": `${shape} Diamond`,
          "Side Stones": "Baguette Diamonds",
          "Band width": "2.00 mm",
          "Band thickness": "1.60 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.70ct",
          "Setting": "Prong Setting",
          "Colour": "DE",
          "Clarity": "VVS/VS"
        }
      };
    }
    if (sub === 'art-deco') {
      return {
        productInformation: {
          "Setting": "Vintage Bezel & Prong",
          "Ring Style": "Art Deco Vintage",
          "Main Stone": `${shape} Diamond`,
          "Side Stones": "Milgrain Accent Stones",
          "Band width": "2.20 mm",
          "Band thickness": "1.60 mm",
          "Finish": "High Polish Milgrain"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.45ct",
          "Setting": "Castle",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'color-stone-ring') {
      return {
        productInformation: {
          "Setting": "Prong Setting",
          "Ring Style": "Color Stone Ring",
          "Main Stone": `${shape} Gemstone / Diamond`,
          "Side Stones": "Baguette Diamonds",
          "Band width": "2.00 mm",
          "Band thickness": "1.60 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.65ct",
          "Setting": "Prong Setting",
          "Colour": "DE",
          "Clarity": "VVS/VS"
        }
      };
    }
    if (sub === 'et') {
      return {
        productInformation: {
          "Setting": "Shared Prong",
          "Ring Style": "Eternity Band",
          "Main Stone": "Full Band Diamonds",
          "Band width": "2.80 mm",
          "Band thickness": "1.80 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 2.10ct",
          "Setting": "Shared Prong",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'halo-ring') {
      return {
        productInformation: {
          "Setting": "Halo Prong Setting",
          "Ring Style": "Halo Ring",
          "Main Stone": `${shape} Diamond`,
          "Side Stones": "Halo Round Diamonds",
          "Band width": "1.90 mm",
          "Band thickness": "1.50 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.35ct",
          "Setting": "Castle",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'plain-solitaire-ring') {
      return {
        productInformation: {
          "Setting": "Classic 4-Prong",
          "Ring Style": "Plain Solitaire",
          "Main Stone": `${shape} Diamond`,
          "Band width": "2.00 mm",
          "Band thickness": "1.60 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.15ct",
          "Setting": "Hidden Halo",
          "Colour": "F-G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'side-stone-ring') {
      return {
        productInformation: {
          "Setting": "Side Stone Prong",
          "Ring Style": "Side Stone Ring",
          "Main Stone": `${shape} Diamond`,
          "Side Stones": "Pavé Side Diamonds",
          "Band width": "2.10 mm",
          "Band thickness": "1.60 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.30ct",
          "Setting": "Castle",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'toi-moi-ring') {
      return {
        productInformation: {
          "Setting": "Two-Stone Claw Prong",
          "Ring Style": "Toi et Moi",
          "Main Stone": `Pear & ${shape} Diamonds`,
          "Band width": "2.00 mm",
          "Band thickness": "1.60 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.85ct",
          "Setting": "Prong Setting",
          "Colour": "DE",
          "Clarity": "VVS/VS"
        }
      };
    }
    // Generic ring default
    return {
      productInformation: {
        "Setting": "Prong Setting",
        "Ring Style": "Promise Ring",
        "Main Stone": `${shape} Diamond`,
        "Band width": "2.00 mm",
        "Band thickness": "1.60 mm",
        "Setting style": "Castle",
        "Finish": "High Polish"
      },
      accentStones: {
        "Type": "Diamonds",
        "Total weight": "approx. 0.25ct",
        "Setting": "Castle",
        "Colour": "G",
        "Clarity": "VS"
      }
    };
  }

  if (cat === 'earrings') {
    if (sub === 'halo-earring') {
      return {
        productInformation: {
          "Setting": "Halo Prong Basket",
          "Earring Style": "Halo Earring",
          "Main Stone": `${shape} Diamond`,
          "Backing": "Secure Push Back",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.55ct",
          "Setting": "Micro-Pavé",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'hoop-earring') {
      return {
        productInformation: {
          "Setting": "Channel & Prong",
          "Earring Style": "Hoop Earring",
          "Diameter": "15.0 mm",
          "Closure": "Snap Lock Hinge",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.80ct",
          "Setting": "Shared Prong",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    return {
      productInformation: {
        "Setting": "4-Prong Basket",
        "Earring Style": "Solitaire Stud",
        "Main Stone": `${shape} Diamond`,
        "Backing": "Push Back with Safety Groove",
        "Finish": "High Polish"
      },
      accentStones: {
        "Type": "Diamonds",
        "Total weight": "approx. 1.00ct (Pair)",
        "Setting": "Prong Setting",
        "Colour": "F-G",
        "Clarity": "VS"
      }
    };
  }

  if (cat === 'bracelets') {
    return {
      productInformation: {
        "Setting": "4-Prong Tennis Link",
        "Bracelet Style": "Tennis Bracelet",
        "Length": "7.0 Inches",
        "Band width": "3.00 mm",
        "Clasp": "Double Safety Box Clasp",
        "Finish": "High Polish"
      },
      accentStones: {
        "Type": "Diamonds",
        "Total weight": "approx. 3.20ct",
        "Setting": "Prong Setting",
        "Colour": "G",
        "Clarity": "VS"
      }
    };
  }

  if (cat === 'necklaces' || cat === 'necklace') {
    return {
      productInformation: {
        "Setting": "Collar Link / Bezel",
        "Necklace Style": "Diamond Line Necklace",
        "Length": "16 - 18 Inches Adjustable",
        "Clasp": "Box Clasp with Dual Safety",
        "Finish": "High Polish"
      },
      accentStones: {
        "Type": "Diamonds",
        "Total weight": "approx. 4.50ct",
        "Setting": "Prong Setting",
        "Colour": "G",
        "Clarity": "VS"
      }
    };
  }

  if (cat === 'pendants' || cat === 'pendant') {
    if (sub === 'cross-pendant') {
      return {
        productInformation: {
          "Setting": "Cross Prong Setting",
          "Pendant Style": "Cross Pendant",
          "Pendant Height": "22.0 mm",
          "Bail Opening": "3.50 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.50ct",
          "Setting": "Prong Setting",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'halo-pendant') {
      return {
        productInformation: {
          "Setting": "Halo Basket Setting",
          "Pendant Style": "Halo Pendant",
          "Main Stone": `${shape} Diamond`,
          "Pendant Height": "16.0 mm",
          "Bail Opening": "3.50 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.35ct",
          "Setting": "Micro-Pavé",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    if (sub === 'two-stone-pendant') {
      return {
        productInformation: {
          "Setting": "Two-Stone Tension Prong",
          "Pendant Style": "Two Stone Pendant",
          "Pendant Height": "18.0 mm",
          "Bail Opening": "3.50 mm",
          "Finish": "High Polish"
        },
        accentStones: {
          "Type": "Diamonds",
          "Total weight": "approx. 0.60ct",
          "Setting": "Prong Setting",
          "Colour": "G",
          "Clarity": "VS"
        }
      };
    }
    return {
      productInformation: {
        "Setting": "4-Prong Solitaire Basket",
        "Pendant Style": "Solitaire Pendant",
        "Main Stone": `${shape} Diamond`,
        "Pendant Height": "13.0 mm",
        "Bail Opening": "3.20 mm",
        "Finish": "High Polish"
      },
      accentStones: {
        "Type": "Diamonds",
        "Total weight": "approx. 0.50ct",
        "Setting": "Prong Setting",
        "Colour": "F-G",
        "Clarity": "VS"
      }
    };
  }

  // Loose Diamonds
  return {
    productInformation: {
      "Shape": shape,
      "Cut": "Ideal / Excellent",
      "Polish": "Excellent",
      "Symmetry": "Excellent",
      "Fluorescence": "None"
    },
    accentStones: {
      "Type": "Natural Diamond",
      "Total weight": "1.50 ct",
      "Colour": "D-F",
      "Clarity": "VVS/VS",
      "Certification": "GIA / IGI"
    }
  };
}

let count = 0;
for (const p of products) {
  const details = buildDetails(p);

  // Remove old table format
  delete p.weightDetails;

  p.productDetails = details;
  p.specifications = {
    stone_shape: detectStoneShape(p.name, p.slug),
    productInformation: details.productInformation,
    accentStones: details.accentStones
  };
  count++;
}

fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated specifications & productDetails for ${count} products in products.json.`);
