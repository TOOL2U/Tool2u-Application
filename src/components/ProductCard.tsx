import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import Button from './Button';

interface ProductCardProps {
  id: number;
  name: string;
  categories: string[];
  description: string;
  imageUrl: string;
  price: number;
  onAddToCart: () => void;
  quantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  categories,
  description,
  imageUrl,
  price,
  onAddToCart,
  quantity
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart();
    setIsAdded(true);
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{name}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">฿{price}/day</span>
          <Button
            variant={isAdded ? "success" : "primary"}
            size="sm"
            onClick={handleAddToCart}
            disabled={quantity <= 0 || isAdded}
            className="flex items-center gap-1"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
