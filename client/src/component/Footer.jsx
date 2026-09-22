import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-stone-200 bg-[#1c1917] text-stone-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl text-[#f7f3eb]">Folio Books</p>
          <p className="mt-1 max-w-md text-sm text-stone-400">
            A MERN stack catalog for adding, updating, and organizing a personal book collection.
          </p>
        </div>
        <div className="text-sm">
          <p>MongoDB · Express · React · Node.js</p>
          <p className="mt-1 text-stone-500">Local API at /mysite</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
