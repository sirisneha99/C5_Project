import React, { useReducer } from 'react';
import { ShoppingCart, Leaf, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

import roseImage from './images/rose.jpeg';
import jasmineImage from './images/jasmine.jpeg';
import marigoldImage from './images/marigold.jpeg';
import sunflowerImage from './images/sunflower.jpeg';
import tulsiImage from './images/tulsi.jpeg';
import cactusImage from './images/succulent-cacti.jpeg';

// Redux-like reducer for cart management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'INCREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    
    case 'DECREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    default:
      return state;
  }
};

const initialCartState = {
  items: []
};

// Plant data organized by categories
const plantData = {
  'Flowering Plants': [
    {
      id: 1,
      name: 'Rose',
      price: 25.99,
      image: roseImage ,
      category: 'Flowering Plants'
    },
    {
      id: 2,
      name: 'Jasmine',
      price: 22.99,
      image: jasmineImage,
      category: 'Flowering Plants'
    }
  ],
  'Succulents & Cacti': [
    {
      id: 3,
      name: 'Succulent Cacti',
      price: 15.99,
      image: cactusImage,
      category: 'Succulents & Cacti'
    },
    {
      id: 4,
      name: 'Marigold',
      price: 12.99,
      image: marigoldImage,
      category: 'Succulents & Cacti'
    }
  ],
  'Garden Plants': [
    {
      id: 5,
      name: 'Sunflower',
      price: 18.99,
      image: sunflowerImage,
      category: 'Garden Plants'
    },
    {
      id: 6,
      name: 'Tulsi (Holy Basil)',
      price: 16.99,
      image: tulsiImage,
      category: 'Garden Plants'
    }
  ]
};

// Header Component
const Header = ({ cartCount, currentPage, onNavigate }) => (
  <header className="bg-green-600 text-white p-4 shadow-lg">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Leaf className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Paradise Nursery</h1>
      </div>
      
      <nav className="flex items-center gap-6">
        {currentPage !== 'landing' && (
          <button
            onClick={() => onNavigate(currentPage === 'products' ? 'landing' : 'products')}
            className="flex items-center gap-2 hover:text-green-200 transition-colors"
          >
            {currentPage === 'products' ? 'Home' : 'Continue Shopping'}
          </button>
        )}
        
        {currentPage !== 'cart' && (
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-2 hover:text-green-200 transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </button>
        )}
      </nav>
    </div>
  </header>
);

// Landing Page Component
const LandingPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
       style={{
         backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop)'
       }}>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-6xl font-bold mb-6 text-green-100">Paradise Nursery</h1>
        <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
          Welcome to Paradise Nursery, where nature meets nurture. We specialize in bringing the beauty 
          of the natural world into your home with our carefully curated collection of premium houseplants. 
          From air-purifying succulents to statement tropical plants, we have everything you need to create 
          your own green paradise. Each plant is hand-selected for quality and comes with expert care guidance 
          to help you succeed in your plant parent journey.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
);

// Product Card Component
const ProductCard = ({ plant, onAddToCart, isInCart }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img
      src={plant.image}
      alt={plant.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{plant.name}</h3>
      <p className="text-green-600 font-bold text-xl mb-4">${plant.price}</p>
      <button
        onClick={() => onAddToCart(plant)}
        disabled={isInCart}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
          isInCart
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md'
        }`}
      >
        {isInCart ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  </div>
);

// Product Listing Page Component
const ProductListingPage = ({ cart, dispatch }) => {
  const handleAddToCart = (plant) => {
    dispatch({ type: 'ADD_TO_CART', payload: plant });
  };

  const isInCart = (plantId) => {
    return cart.items.some(item => item.id === plantId);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Plant Collection</h2>
      
      {Object.entries(plantData).map(([category, plants]) => (
        <div key={category} className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-green-700 border-b-2 border-green-200 pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map(plant => (
              <ProductCard
                key={plant.id}
                plant={plant}
                onAddToCart={handleAddToCart}
                isInCart={isInCart(plant.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, dispatch }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
    <img
      src={item.image}
      alt={item.name}
      className="w-20 h-20 object-cover rounded-lg"
    />
    <div className="flex-1">
      <h3 className="text-lg font-semibold">{item.name}</h3>
      <p className="text-green-600 font-bold">${item.price}</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={() => dispatch({ type: 'DECREASE_QUANTITY', payload: item.id })}
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-semibold">{item.quantity}</span>
      <button
        onClick={() => dispatch({ type: 'INCREASE_QUANTITY', payload: item.id })}
        className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
        className="ml-4 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Shopping Cart Page Component
const ShoppingCartPage = ({ cart, dispatch, onNavigate }) => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some beautiful plants to get started!</p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Shopping Cart</h2>
        <div className="text-center">
          <p className="text-xl mb-2">
            <span className="font-semibold">Total Plants:</span> {totalItems}
          </p>
          <p className="text-2xl font-bold text-green-600">
            Total Cost: ${totalCost.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {cart.items.map(item => (
          <CartItem key={item.id} item={item} dispatch={dispatch} />
        ))}
      </div>

      <div className="flex gap-4 justify-between">
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
        <button
          onClick={() => alert('Coming Soon!')}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

// Main App Component
const ParadiseNurseryApp = () => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [currentPage, setCurrentPage] = React.useState('landing');

  const totalCartItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigation} />;
      case 'products':
        return <ProductListingPage cart={cart} dispatch={dispatch} />;
      case 'cart':
        return <ShoppingCartPage cart={cart} dispatch={dispatch} onNavigate={handleNavigation} />;
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'landing' && (
        <Header 
          cartCount={totalCartItems} 
          currentPage={currentPage} 
          onNavigate={handleNavigation} 
        />
      )}
      {renderCurrentPage()}
    </div>
  );
};

export default ParadiseNurseryApp;