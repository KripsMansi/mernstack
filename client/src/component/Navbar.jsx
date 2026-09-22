import React, { useState } from 'react';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#catalog', label: 'Catalog' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f7f3eb]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#home" className="flex items-center gap-2 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1c1917] text-sm font-semibold text-[#f7f3eb]">
            FB
          </span>
          <span className="font-display text-xl font-semibold text-[#1c1917]">Folio Books</span>
        </a>

        <ul className="hidden list-none items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium tracking-wide text-stone-700 no-underline hover:text-[#8b4513]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#catalog"
          className="hidden rounded-full bg-[#1c1917] px-4 py-2 text-sm font-medium text-white no-underline hover:bg-stone-800 md:inline-block"
        >
          Manage books
        </a>

        <button
          type="button"
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone-200 px-5 py-4 md:hidden">
          <ul className="flex list-none flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-stone-800 no-underline"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
