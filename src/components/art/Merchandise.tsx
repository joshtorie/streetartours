import React from 'react';
import { Merchandise as MerchandiseType } from '../../types';
import { ExternalLink } from 'lucide-react';

interface MerchandiseProps {
  items: MerchandiseType[];
}

export function Merchandise({ items }: MerchandiseProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-blue-600">${item.price}</p>
          </div>
        </a>
      ))}
    </div>
  );
}