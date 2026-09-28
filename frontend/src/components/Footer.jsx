import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#EFE9DF] border-t border-[#D5CEC1] text-[#24221F] mt-24">
      <div className="max-w-aura-container mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-serif text-2xl tracking-[0.2em] uppercase font-medium">
              A U R A
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-[#5F5A52]">
              E S S E N T I A L S
            </p>
            <p className="text-xs text-[#5F5A52] max-w-sm leading-relaxed mt-4">
              Designed for life. Made to last. Quiet luxury, modern minimalism, and timeless craftsmanship.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#24221F]">Shop</h3>
            <ul className="space-y-2 text-xs text-[#5F5A52] tracking-wide">
              <li className="hover:text-[#24221F] cursor-pointer">All Products</li>
              <li className="hover:text-[#24221F] cursor-pointer">Knitwear</li>
              <li className="hover:text-[#24221F] cursor-pointer">Shirts & Tops</li>
              <li className="hover:text-[#24221F] cursor-pointer">Trousers</li>
              <li className="hover:text-[#24221F] cursor-pointer">Outerwear</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#24221F]">About</h3>
            <ul className="space-y-2 text-xs text-[#5F5A52] tracking-wide">
              <li className="hover:text-[#24221F] cursor-pointer">Our Story</li>
              <li className="hover:text-[#24221F] cursor-pointer">Sustainability</li>
              <li className="hover:text-[#24221F] cursor-pointer">Craftsmanship</li>
              <li className="hover:text-[#24221F] cursor-pointer">Careers</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#24221F]">Help</h3>
            <ul className="space-y-2 text-xs text-[#5F5A52] tracking-wide">
              <li className="hover:text-[#24221F] cursor-pointer">Size Guide</li>
              <li className="hover:text-[#24221F] cursor-pointer">Shipping & Delivery</li>
              <li className="hover:text-[#24221F] cursor-pointer">Returns Policy</li>
              <li className="hover:text-[#24221F] cursor-pointer">FAQ</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#D5CEC1] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-[#5F5A52] tracking-wider">
          <p>© {new Date().getFullYear()} AURA ESSENTIALS. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-[#24221F] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#24221F] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#24221F] cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
