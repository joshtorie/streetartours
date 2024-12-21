import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Info, Palette } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Palette className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Street Art Tours</h1>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/info" className="text-gray-600 hover:text-blue-600">
              <Info className="w-6 h-6" />
            </Link>
            <a 
              href="https://www.wagmistuff.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <ShoppingBag className="w-6 h-6" />
            </a>
            <Link to="/admin" className="text-gray-600 hover:text-blue-600">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}