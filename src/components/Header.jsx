import React, { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import logo from '../assets/icons/logo.svg'
import roundDropdown from '../assets/icons/round-dropdown.svg'
import princessDropdown from '../assets/icons/princess-dropdown.svg'
import emeraldDropdown from '../assets/icons/emerald-dropdown.svg'
import asscherDropdown from '../assets/icons/asscher-dropdown.svg'
import cushionDropdown from '../assets/icons/cushion-dropdown.svg'
import marquiseDropdown from '../assets/icons/marquise-dropdown.svg'
import radiantDropdown from '../assets/icons/radiant-dropdown.svg'
import ovalDropdown from '../assets/icons/oval-dropdown.svg'
import pearDropdown from '../assets/icons/pear-dropdown.svg'
import heartDropdown from '../assets/icons/heart-dropdown.svg'

function Header({ setInquiryState }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pathname = location.pathname.toLowerCase();
  const currentSubCategory = searchParams.get('subCategory') || '';
  const currentShape = searchParams.get('shape') || '';
  const stateCategory = location.state?.category?.toLowerCase();

  const isCategoryActive = (slugs) => {
    const list = Array.isArray(slugs) ? slugs : [slugs];
    return list.some((slug) => 
      pathname === `/category/${slug}` || 
      pathname.startsWith(`/category/${slug}/`) ||
      (pathname.startsWith('/products/') && stateCategory && list.includes(stateCategory))
    );
  };

  const isDiamondsActive = () => {
    return pathname === '/diamonds' || pathname.startsWith('/diamonds') || pathname === '/category/diamonds';
  };

  const isGiftsActive = () => {
    return pathname === '/category/gifts' || pathname.startsWith('/category/gifts') || pathname === '/gifts';
  };

  const getNavLinkClass = (isActive, extraClasses = '') =>
    `${extraClasses} transition-colors ${
      isActive
        ? 'text-[#12798C] font-semibold'
        : 'text-[#1A1A1A] hover:text-[#12798C]'
    }`;

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="w-full flex flex-col bg-white z-50 sticky top-0 left-0 right-0">
      <div className="w-full py-2 border-b border-[#9C9C9C66] bg-[#13778d] hidden">
        <div className="container mx-auto px-6">
          <p className="text-center text-[14px] 3xl:text-[12px] text-[#000000] py-3">
            Best special offers every week 40% Off! Free delivery time
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-5 flex justify-between items-center bg-white relative z-50">
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={logo} alt="Parvati Jewels Logo" className="xl:h-[50px] lg:h-[35px] md:h-[40px] h-[36px] w-auto" />
          </Link>
        </div>

        <nav className="hidden lg:flex xl:space-x-8 space-x-6 items-center text-[#1A1A1A] xl:text-[16px] text-[14px]">
          {/* Rings Dropdown */}
          <div className="relative group h-full flex items-center">
            <Link to="/category/rings" className={getNavLinkClass(isCategoryActive(['rings', 'ring']), 'py-4')}>Rings</Link>
            <div className="absolute top-[100%] pt-2 left-1/2 -translate-x-1/2 w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2.5">
                <Link to="/category/rings" className={`block px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider border-b border-gray-100 mb-1 transition-colors ${isCategoryActive(['rings', 'ring']) && !currentSubCategory ? 'text-[#12798C] bg-gray-50' : 'text-[#12798C] hover:bg-gray-50'}`}>All Rings</Link>
                <Link to="/category/rings?subCategory=3-stone-ring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === '3-stone-ring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>3 Stone Ring</Link>
                <Link to="/category/rings?subCategory=art-deco" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === 'art-deco' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Art Deco</Link>
                <Link to="/category/rings?subCategory=color-stone-ring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === 'color-stone-ring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Color Stone Ring</Link>
                <Link to="/category/rings?subCategory=et" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === 'et' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>ET (Eternity Band)</Link>
                <Link to="/category/rings?subCategory=halo-ring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === 'halo-ring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Halo Ring</Link>
                <Link to="/category/rings?subCategory=plain-solitaire-ring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === 'plain-solitaire-ring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Plain Solitaire Ring</Link>
                <Link to="/category/rings?subCategory=side-stone-ring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === 'side-stone-ring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Side Stone Ring</Link>
                <Link to="/category/rings?subCategory=toi-moi-ring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['rings', 'ring']) && currentSubCategory === 'toi-moi-ring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Toi Moi Ring</Link>
              </div>
            </div>
          </div>

          {/* Earrings Dropdown */}
          <div className="relative group h-full flex items-center">
            <Link to="/category/earrings" className={getNavLinkClass(isCategoryActive(['earrings', 'earring']), 'py-4')}>Earrings</Link>
            <div className="absolute top-[100%] pt-2 left-1/2 -translate-x-1/2 w-[210px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2.5">
                <Link to="/category/earrings" className={`block px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider border-b border-gray-100 mb-1 transition-colors ${isCategoryActive(['earrings', 'earring']) && !currentSubCategory ? 'text-[#12798C] bg-gray-50' : 'text-[#12798C] hover:bg-gray-50'}`}>All Earrings</Link>
                <Link to="/category/earrings?subCategory=halo-earring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['earrings', 'earring']) && currentSubCategory === 'halo-earring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Halo Earring</Link>
                <Link to="/category/earrings?subCategory=hoop-earring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['earrings', 'earring']) && currentSubCategory === 'hoop-earring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Hoop Earring</Link>
                <Link to="/category/earrings?subCategory=single-stone-earring" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['earrings', 'earring']) && currentSubCategory === 'single-stone-earring' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Single Stone Earring</Link>
              </div>
            </div>
          </div>

          <Link to="/category/bracelets" className={getNavLinkClass(isCategoryActive(['bracelets', 'bracelet']), 'py-4')}>Bracelets</Link>
          <Link to="/category/necklaces" className={getNavLinkClass(isCategoryActive(['necklaces', 'necklace']), 'py-4')}>Necklaces</Link>

          {/* Pendants Dropdown */}
          <div className="relative group h-full flex items-center">
            <Link to="/category/pendants" className={getNavLinkClass(isCategoryActive(['pendants', 'pendant']), 'py-4')}>Pendants</Link>
            <div className="absolute top-[100%] pt-2 left-1/2 -translate-x-1/2 w-[210px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2.5">
                <Link to="/category/pendants" className={`block px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider border-b border-gray-100 mb-1 transition-colors ${isCategoryActive(['pendants', 'pendant']) && !currentSubCategory ? 'text-[#12798C] bg-gray-50' : 'text-[#12798C] hover:bg-gray-50'}`}>All Pendants</Link>
                <Link to="/category/pendant?subCategory=cross-pendant" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['pendants', 'pendant']) && currentSubCategory === 'cross-pendant' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Cross Pendant</Link>
                <Link to="/category/pendant?subCategory=halo-pendant" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['pendants', 'pendant']) && currentSubCategory === 'halo-pendant' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Halo Pendant</Link>
                <Link to="/category/pendant?subCategory=single-stone-pendant" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['pendants', 'pendant']) && currentSubCategory === 'single-stone-pendant' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Single Stone Pendant</Link>
                <Link to="/category/pendant?subCategory=two-stone-pendant" className={`block px-4 py-1.5 text-[13px] transition-colors ${isCategoryActive(['pendants', 'pendant']) && currentSubCategory === 'two-stone-pendant' ? 'text-[#12798C] font-semibold bg-gray-50' : 'text-[#1A1A1A] hover:bg-gray-50 hover:text-[#12798C]'}`}>Two Stone Pendant</Link>
              </div>
            </div>
          </div>

          {/* Diamonds Dropdown */}
          <div className="relative group h-full flex items-center">
            <Link to="/diamonds" className={getNavLinkClass(isDiamondsActive(), 'py-4')}>Diamonds</Link>

            <div className="absolute top-[100%] pt-2 left-1/2 -translate-x-1/2 w-[420px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-2 gap-x-7 gap-y-6 p-5">
                  <Link to="/diamonds?shape=Round" className="flex items-center gap-4 group/item">
                    <img src={roundDropdown} alt="Round" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'round' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Round</span>
                  </Link>
                  <Link to="/diamonds?shape=Marquise" className="flex items-center gap-4 group/item">
                    <img src={marquiseDropdown} alt="Marquise" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'marquise' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Marquise</span>
                  </Link>
                  <Link to="/diamonds?shape=Princess" className="flex items-center gap-4 group/item">
                    <img src={princessDropdown} alt="Princess" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'princess' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Princess</span>
                  </Link>
                  <Link to="/diamonds?shape=Radiant" className="flex items-center gap-4 group/item">
                    <img src={radiantDropdown} alt="Radiant" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'radiant' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Radiant</span>
                  </Link>
                  <Link to="/diamonds?shape=Emerald" className="flex items-center gap-4 group/item">
                    <img src={emeraldDropdown} alt="Emerald" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'emerald' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Emerald</span>
                  </Link>
                  <Link to="/diamonds?shape=Oval" className="flex items-center gap-4 group/item">
                    <img src={ovalDropdown} alt="Oval" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'oval' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Oval</span>
                  </Link>
                  <Link to="/diamonds?shape=Asscher" className="flex items-center gap-4 group/item">
                    <img src={asscherDropdown} alt="Asscher" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'asscher' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Asscher</span>
                  </Link>
                  <Link to="/diamonds?shape=Pear" className="flex items-center gap-4 group/item">
                    <img src={pearDropdown} alt="Pear" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'pear' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Pear</span>
                  </Link>
                  <Link to="/diamonds?shape=Cushion" className="flex items-center gap-4 group/item">
                    <img src={cushionDropdown} alt="Cushion" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'cushion' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Cushion</span>
                  </Link>
                  <Link to="/diamonds?shape=Heart" className="flex items-center gap-4 group/item">
                    <img src={heartDropdown} alt="Heart" className="" />
                    <span className={`text-[14px] transition-colors ${isDiamondsActive() && currentShape.toLowerCase() === 'heart' ? 'text-[#12798C] font-semibold' : 'text-[#1A1A1A] group-hover/item:text-[#12798C]'}`}>Heart</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/category/gifts" className={getNavLinkClass(isGiftsActive(), 'py-4')}>Gifts</Link>
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/contact"
            className={`border xl:px-3.5 px-3 xl:py-2.5 py-2 xl:text-[16px] text-[14px] font-medium cursor-pointer transition-colors flex items-center justify-center ${
              pathname === '/contact'
                ? 'bg-[#12798C] text-white border-[#12798C]'
                : 'border-[#12798C] text-[#12798C] hover:bg-[#12798C] hover:text-white'
            }`}
          >
            Contact
          </Link>
          <button
            onClick={() => setInquiryState({ isOpen: true, type: 'general' })}
            className="bg-[#12798C] text-white xl:px-4.5 px-4 xl:py-2.5 py-2 xl:text-[16px] text-[14px] font-medium hover:bg-white hover:text-[#12798C] transition-colors border border-[#12798C] cursor-pointer"
          >
            Inquiry
          </button>
        </div>

        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#1A1A1A] focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile & Tablet Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 overflow-hidden z-50 ${isMenuOpen ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'
          }`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-4 text-[15px]">
          <Link to="/category/rings" onClick={() => setIsMenuOpen(false)} className={getNavLinkClass(isCategoryActive(['rings', 'ring']))}>Rings</Link>
          <Link to="/category/earrings" onClick={() => setIsMenuOpen(false)} className={getNavLinkClass(isCategoryActive(['earrings', 'earring']))}>Earrings</Link>
          <Link to="/category/bracelets" onClick={() => setIsMenuOpen(false)} className={getNavLinkClass(isCategoryActive(['bracelets', 'bracelet']))}>Bracelets</Link>
          <Link to="/category/necklaces" onClick={() => setIsMenuOpen(false)} className={getNavLinkClass(isCategoryActive(['necklaces', 'necklace']))}>Necklaces</Link>
          <Link to="/category/pendants" onClick={() => setIsMenuOpen(false)} className={getNavLinkClass(isCategoryActive(['pendants', 'pendant']))}>Pendants</Link>
          <Link to="/diamonds" onClick={() => setIsMenuOpen(false)} className={getNavLinkClass(isDiamondsActive())}>Diamonds</Link>
          <Link to="/category/gifts" onClick={() => setIsMenuOpen(false)} className={getNavLinkClass(isGiftsActive())}>Gifts</Link>
          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={`py-2 text-center font-medium border transition-colors ${
                pathname === '/contact'
                  ? 'bg-[#12798C] text-white border-[#12798C]'
                  : 'border-[#12798C] text-[#12798C] hover:bg-[#12798C] hover:text-white'
              }`}
            >
              Contact
            </Link>
            <button
              onClick={() => { setInquiryState({ isOpen: true, type: 'general' }); setIsMenuOpen(false); }}
              className="bg-[#12798C] text-white py-2 text-center font-medium border border-[#12798C] hover:bg-white hover:text-[#12798C] transition-colors cursor-pointer"
            >
              Inquiry
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header