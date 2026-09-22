import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Footer from './component/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-[#f7f3eb]">
      <Navbar />
      <Home />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
