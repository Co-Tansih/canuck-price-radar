
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Homepage from '../components/Homepage';
import SearchResults from '../components/SearchResults';
import ProductDetail from '../components/ProductDetail';
import StoreLocator from '../components/StoreLocator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/stores" element={<StoreLocator />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
