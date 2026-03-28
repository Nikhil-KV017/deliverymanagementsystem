import { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

/* ─── Mock Data ─── */
const initialUsers = [
  { id: 1, name: "Creator", email: "foodbuddy@gmail.com", password: "9676977595", role: "admin", city: "Mumbai" },
  { id: 7, name: "System Admin", email: "admin@foodbuddy.com", password: "password", role: "admin", city: "Mumbai" },
  { id: 2, name: "John Customer", email: "customer@foodbuddy.com", password: "password", role: "customer", city: "Mumbai", address: "42 Marine Drive, Mumbai" },
  { id: 3, name: "Agent Smith", email: "agent@foodbuddy.com", password: "password", role: "agent", city: "Mumbai", onDuty: true, activeDeliveries: 0 },
  { id: 4, name: "Priya Patel", email: "priya@foodbuddy.com", password: "password", role: "customer", city: "Delhi", address: "Block C, Connaught Place" },
  { id: 5, name: "Vikram Rider", email: "vikram@foodbuddy.com", password: "password", role: "agent", city: "Mumbai", onDuty: true, activeDeliveries: 0 },
  { id: 6, name: "Sanjay Rider", email: "sanjay@foodbuddy.com", password: "password", role: "agent", city: "Delhi", onDuty: true, activeDeliveries: 0 },
];

const initialRestaurants = [
  // MUMBAI (r1-r5)
  { id: 'r1', name: "Bombay Bites", cuisine: ["Indian", "Street Food"], rating: 4.5, city: "Mumbai", address: "Andheri West", deliveryTime: "25-35", deliveryFee: 30, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400", featured: true },
  { id: 'r2', name: "Pizza Paradise", cuisine: ["Pizza", "Italian"], rating: 4.3, city: "Mumbai", address: "Bandra", deliveryTime: "30-40", deliveryFee: 40, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", featured: true },
  { id: 'r3', name: "Dragon Wok", cuisine: ["Chinese", "Asian"], rating: 4.1, city: "Mumbai", address: "Juhu", deliveryTime: "20-30", deliveryFee: 25, image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400", featured: false },
  { id: 'r4', name: "Burger Barn", cuisine: ["Burgers", "American"], rating: 4.6, city: "Mumbai", address: "Powai", deliveryTime: "15-25", deliveryFee: 20, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", featured: true },
  { id: 'r5', name: "Sushi Samurai", cuisine: ["Japanese", "Sushi"], rating: 4.7, city: "Mumbai", address: "Colaba", deliveryTime: "35-45", deliveryFee: 50, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400", featured: false },
  // DELHI (r6-r10)
  { id: 'r6', name: "Delhi Darbar", cuisine: ["Indian", "Mughlai"], rating: 4.4, city: "Delhi", address: "Connaught Place", deliveryTime: "25-35", deliveryFee: 35, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400", featured: true },
  { id: 'r7', name: "Taco Fiesta", cuisine: ["Mexican"], rating: 4.2, city: "Delhi", address: "Hauz Khas", deliveryTime: "20-30", deliveryFee: 30, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", featured: false },
  { id: 'r8', name: "The Great Kabab Factory", cuisine: ["North Indian", "Kebab"], rating: 4.8, city: "Delhi", address: "Saket", deliveryTime: "30-40", deliveryFee: 50, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", featured: true },
  { id: 'r9', name: "Paranthe Wali Gali", cuisine: ["Street Food", "North Indian"], rating: 4.5, city: "Delhi", address: "Chandni Chowk", deliveryTime: "15-25", deliveryFee: 20, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400", featured: false },
  { id: 'r10', name: "Chor Bizarre", cuisine: ["Kashmiri", "Indian"], rating: 4.3, city: "Delhi", address: "Daryaganj", deliveryTime: "40-50", deliveryFee: 40, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", featured: false },
  // BANGALORE (r11-r15)
  { id: 'r11', name: "The Rameshwaram Cafe", cuisine: ["South Indian", "Quick Bites"], rating: 4.9, city: "Bangalore", address: "Indiranagar", deliveryTime: "15-25", deliveryFee: 20, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400", featured: true },
  { id: 'r12', name: "Etruria Italian", cuisine: ["Italian", "European"], rating: 4.6, city: "Bangalore", address: "Koramangala", deliveryTime: "35-45", deliveryFee: 45, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400", featured: false },
  { id: 'r13', name: "Koshy's", cuisine: ["Continental", "Cafe"], rating: 4.4, city: "Bangalore", address: "MG Road", deliveryTime: "20-30", deliveryFee: 30, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400", featured: false },
  { id: 'r14', name: "Toit Brewpub", cuisine: ["Pizza", "American"], rating: 4.7, city: "Bangalore", address: "Indiranagar", deliveryTime: "30-40", deliveryFee: 40, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400", featured: true },
  { id: 'r15', name: "MTR", cuisine: ["South Indian", "Legendary"], rating: 4.8, city: "Bangalore", address: "Lalbagh", deliveryTime: "20-30", deliveryFee: 30, image: "https://images.unsplash.com/photo-1626777553754-0744be66e4a6?w=400", featured: true },
  // HYDERABAD (r16-r20)
  { id: 'r16', name: "Paradise Biryani", cuisine: ["Biryani", "Hyderabadi"], rating: 4.6, city: "Hyderabad", address: "Secunderabad", deliveryTime: "30-40", deliveryFee: 35, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400", featured: true },
  { id: 'r17', name: "Shah Ghouse", cuisine: ["Biryani", "Mughlai"], rating: 4.5, city: "Hyderabad", address: "Gachibowli", deliveryTime: "25-35", deliveryFee: 30, image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400", featured: true },
  { id: 'r18', name: "Chutneys", cuisine: ["South Indian", "Vegetarian"], rating: 4.7, city: "Hyderabad", address: "Banjara Hills", deliveryTime: "15-25", deliveryFee: 25, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400", featured: true },
  { id: 'r19', name: "Minerva Coffee Shop", cuisine: ["South Indian", "Cafe"], rating: 4.4, city: "Hyderabad", address: "Himayatnagar", deliveryTime: "20-30", deliveryFee: 25, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", featured: false },
  { id: 'r20', name: "Tatva", cuisine: ["Fusion", "Vegetarian"], rating: 4.8, city: "Hyderabad", address: "Jubilee Hills", deliveryTime: "40-50", deliveryFee: 50, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=400", featured: true },
  // PUNE (r21-r25)
  { id: 'r21', name: "Vaishali", cuisine: ["South Indian", "Student Favorite"], rating: 4.7, city: "Pune", address: "FC Road", deliveryTime: "15-25", deliveryFee: 20, image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400", featured: true },
  { id: 'r22', name: "Marz-O-Rin", cuisine: ["Cafe", "Sandwiches"], rating: 4.5, city: "Pune", address: "MG Road", deliveryTime: "10-20", deliveryFee: 15, image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400", featured: true },
  { id: 'r23', name: "German Bakery", cuisine: ["Bakery", "German"], rating: 4.4, city: "Pune", address: "Koregaon Park", deliveryTime: "20-30", deliveryFee: 30, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", featured: true },
  { id: 'r24', name: "Blue Nile", cuisine: ["Iranian", "Biryani"], rating: 4.3, city: "Pune", address: "Camp", deliveryTime: "30-40", deliveryFee: 40, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400", featured: false },
  { id: 'r25', name: "Shabree", cuisine: ["Maharashtrian", "Thali"], rating: 4.6, city: "Pune", address: "FC Road", deliveryTime: "25-35", deliveryFee: 30, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", featured: true }
];

const initialMenuItems = [
  // MUMBAI (r1-r5) - 8 items each
  { id: 'm1', restaurantId: 'r1', name: "Chicken Biryani", description: "Fragrant basmati rice with tender chicken", price: 280, category: "Biryani", inStock: true, stockCount: 25, image: "🍚", veg: false, bestseller: true },
  { id: 'm2', restaurantId: 'r1', name: "Veg Kohlapuri", description: "Spicy mixed vegetable curry", price: 220, category: "Curry", inStock: true, stockCount: 20, image: "🥘", veg: true, bestseller: false },
  { id: 'm3', restaurantId: 'r1', name: "Butter Chicken", description: "Rich tomato gravy with tandoori chicken", price: 320, category: "Curry", inStock: true, stockCount: 15, image: "🍅", veg: false, bestseller: true },
  { id: 'm4', restaurantId: 'r1', name: "Dal Tadka", description: "Yellow lentils tempered with aromatic spices", price: 180, category: "Curry", inStock: true, stockCount: 50, image: "🥣", veg: true, bestseller: false },
  { id: 'm4a', restaurantId: 'r1', name: "Paneer Tikka", description: "Grilled marinated paneer", price: 210, category: "Starters", inStock: true, stockCount: 30, image: "🧀", veg: true, bestseller: true },
  { id: 'm4b', restaurantId: 'r1', name: "Chicken Seekh", description: "Minced chicken skewers", price: 240, category: "Starters", inStock: true, stockCount: 15, image: "🍢", veg: false, bestseller: false },
  { id: 'm4c', restaurantId: 'r1', name: "Garlic Naan", description: "Clay oven bread with garlic", price: 60, category: "Breads", inStock: true, stockCount: 100, image: "🫓", veg: true, bestseller: false },
  { id: 'm4d', restaurantId: 'r1', name: "Tandoori Roti", description: "Whole wheat bread", price: 25, category: "Breads", inStock: true, stockCount: 100, image: "🫓", veg: true, bestseller: false },

  { id: 'm5', restaurantId: 'r2', name: "Margherita Pizza", description: "Classic tomato and mozzarella", price: 350, category: "Pizza", inStock: true, stockCount: 18, image: "🍕", veg: true, bestseller: true },
  { id: 'm6', restaurantId: 'r2', name: "Pepperoni Feast", description: "Spicy pepperoni and extra cheese", price: 450, category: "Pizza", inStock: true, stockCount: 12, image: "🍕", veg: false, bestseller: true },
  { id: 'm7', restaurantId: 'r2', name: "Veggie Supreme", description: "Loaded with fresh vegetables", price: 420, category: "Pizza", inStock: true, stockCount: 15, image: "🍕", veg: true, bestseller: false },
  { id: 'm8', restaurantId: 'r2', name: "Chicken Tikka Pizza", description: "Tandoori chicken chunks and onions", price: 480, category: "Pizza", inStock: true, stockCount: 10, image: "🍕", veg: false, bestseller: false },
  { id: 'm8a', restaurantId: 'r2', name: "Garlic Breadsticks", description: "Served with cheesy dip", price: 150, category: "Sides", inStock: true, stockCount: 40, image: "🥖", veg: true, bestseller: true },
  { id: 'm8b', restaurantId: 'r2', name: "Stuffed Crust Add-on", description: "Extra cheese in the crust", price: 90, category: "Add-ons", inStock: true, stockCount: 50, image: "🧀", veg: true, bestseller: false },
  { id: 'm8c', restaurantId: 'r2', name: "Spicy Chicken Wings", description: "6 pcs wings with buffalo sauce", price: 250, category: "Sides", inStock: true, stockCount: 20, image: "🍗", veg: false, bestseller: true },
  { id: 'm8d', restaurantId: 'r2', name: "Coke (500ml)", description: "Chilled beverage", price: 60, category: "Drinks", inStock: true, stockCount: 50, image: "🥤", veg: true, bestseller: false },

  // DELHI (r6-r10) - 8 items each
  { id: 'm21', restaurantId: 'r6', name: "Dal Makhani", description: "Creamy black lentils - Delhi style", price: 250, category: "Main Course", inStock: true, stockCount: 30, image: "🍲", veg: true, bestseller: true },
  { id: 'm22', restaurantId: 'r6', name: "Butter Chicken Deluxe", description: "Delhi's legendary rich curry", price: 380, category: "Main Course", inStock: true, stockCount: 25, image: "🍗", veg: false, bestseller: true },
  { id: 'm23', restaurantId: 'r6', name: "Paneer Tikka Platter", description: "Grilled cottage cheese cubes", price: 290, category: "Starters", inStock: true, stockCount: 20, image: "🧀", veg: true, bestseller: false },
  { id: 'm24', restaurantId: 'r6', name: "Mutton Roganjosh", description: "Slow cooked spicy lamb", price: 450, category: "Non-Veg", inStock: true, stockCount: 15, image: "🍗", veg: false, bestseller: false },
  { id: 'm24a', restaurantId: 'r6', name: "Tandoori Soya Chaap", description: "Spicy mock meat appetizer", price: 220, category: "Starters", inStock: true, stockCount: 40, image: "🍢", veg: true, bestseller: true },
  { id: 'm24b', restaurantId: 'r6', name: "Chicken Malai Tikka", description: "Mild and creamy chicken", price: 320, category: "Starters", inStock: true, stockCount: 25, image: "🍗", veg: false, bestseller: false },
  { id: 'm24c', restaurantId: 'r6', name: "Lachha Paratha", description: "Layered wheat bread", price: 50, category: "Breads", inStock: true, stockCount: 60, image: "🫓", veg: true, bestseller: false },
  { id: 'm24d', restaurantId: 'r6', name: "Gulab Jamun (2pcs)", description: "Hot milk dumplings", price: 80, category: "Desserts", inStock: true, stockCount: 30, image: "🍮", veg: true, bestseller: true },

  { id: 'm29', restaurantId: 'r8', name: "Paneer Tikka Masala", description: "Grilled paneer in spicy gravy", price: 350, category: "Main Course", inStock: true, stockCount: 20, image: "🧀", veg: true, bestseller: true },
  { id: 'm30', restaurantId: 'r8', name: "Mutton Seekh Kabab", description: "Minced mutton skewers", price: 420, category: "Starters", inStock: true, stockCount: 15, image: "🍢", veg: false, bestseller: true },
  { id: 'm31', restaurantId: 'r8', name: "Veg Kabab Platter", description: "Assorted vegetarian kababs", price: 380, category: "Starters", inStock: true, stockCount: 12, image: "🍘", veg: true, bestseller: false },
  { id: 'm32', restaurantId: 'r8', name: "Chicken Malai Kabab", description: "Creamy grilled chicken chunks", price: 390, category: "Starters", inStock: true, stockCount: 18, image: "🍢", veg: false, bestseller: false },
  { id: 'm32a', restaurantId: 'r8', name: "Galouti Kabab", description: "Melt in mouth mutton kabab", price: 450, category: "Legendary", inStock: true, stockCount: 10, image: "🍘", veg: false, bestseller: true },
  { id: 'm32b', restaurantId: 'r8', name: "Dahi Ke Sholey", description: "Hung curd bread rolls", price: 260, category: "Starters", inStock: true, stockCount: 20, image: "🍘", veg: true, bestseller: false },
  { id: 'm32c', restaurantId: 'r8', name: "Rumali Roti", description: "Thin like handkerchief", price: 40, category: "Breads", inStock: true, stockCount: 60, image: "🫓", veg: true, bestseller: false },
  { id: 'm32d', restaurantId: 'r8', name: "Phirni", description: "Rice pudding in clay pot", price: 120, category: "Desserts", inStock: true, stockCount: 20, image: "🍚", veg: true, bestseller: true },

  // HYDERABAD (r16-r20) - 8 items each
  { id: 'm61', restaurantId: 'r16', name: "Veg Dum Biryani", description: "Hyderabad's famous veg rice", price: 280, category: "Biryani", inStock: true, stockCount: 50, image: "🍚", veg: true, bestseller: true },
  { id: 'm62', restaurantId: 'r16', name: "Chicken Dum Biryani", description: "Authentic Paradise biryani", price: 350, category: "Biryani", inStock: true, stockCount: 100, image: "🍚", veg: false, bestseller: true },
  { id: 'm63', restaurantId: 'r16', name: "Mutton Dum Biryani", description: "Rich mutton flavored rice", price: 480, category: "Biryani", inStock: true, stockCount: 40, image: "🍚", veg: false, bestseller: true },
  { id: 'm64', restaurantId: 'r16', name: "Mirchi Ka Salan", description: "Traditional chilli curry", price: 150, category: "Sides", inStock: true, stockCount: 30, image: "🌶️", veg: true, bestseller: false },
  { id: 'm64a', restaurantId: 'r16', name: "Chicken 65", description: "Spicy tempered fried chicken", price: 280, category: "Starters", inStock: true, stockCount: 50, image: "🍗", veg: false, bestseller: true },
  { id: 'm64b', restaurantId: 'r16', name: "Paneer 65", description: "Spicy fried paneer chunks", price: 240, category: "Starters", inStock: true, stockCount: 40, image: "🧀", veg: true, bestseller: false },
  { id: 'm64c', restaurantId: 'r16', name: "Double Ka Meetha", description: "Bread pudding dessert", price: 120, category: "Desserts", inStock: true, stockCount: 30, image: "🍞", veg: true, bestseller: true },
  { id: 'm64d', restaurantId: 'r16', name: "Khubani Ka Meetha", description: "Apricot dessert with ice cream", price: 180, category: "Desserts", inStock: true, stockCount: 20, image: "🍑", veg: true, bestseller: true },

  // PUNE (r21-r25) - 8 items each
  { id: 'm81', restaurantId: 'r21', name: "Cheese Masala Dosa", description: "Pune's favorite street dosa", price: 130, category: "Breakfast", inStock: true, stockCount: 100, image: "🥞", veg: true, bestseller: true },
  { id: 'm82', restaurantId: 'r21', name: "Chicken Cheese Dosa", description: "Meat and cheese fusion dosa", price: 220, category: "Breakfast", inStock: true, stockCount: 40, image: "🥞", veg: false, bestseller: true },
  { id: 'm83', restaurantId: 'r21', name: "Filter Coffee", description: "Strong South Indian brew", price: 60, category: "Drinks", inStock: true, stockCount: 200, image: "☕", veg: true, bestseller: true },
  { id: 'm84', restaurantId: 'r21', name: "Onion Uttapam", description: "Savory pancake with onions", price: 110, category: "Breakfast", inStock: true, stockCount: 80, image: "🥞", veg: true, bestseller: false },
  { id: 'm84a', restaurantId: 'r21', name: "Medu Vada (2pcs)", description: "Crispy lentil donuts", price: 90, category: "Snacks", inStock: true, stockCount: 120, image: "🍩", veg: true, bestseller: true },
  { id: 'm84b', restaurantId: 'r21', name: "Idli Sambar", description: "Soft steamed rice cakes", price: 70, category: "Breakfast", inStock: true, stockCount: 150, image: "⚪", veg: true, bestseller: false },
  { id: 'm84c', restaurantId: 'r21', name: "Upma", description: "Savory semolina porridge", price: 60, category: "Breakfast", inStock: true, stockCount: 50, image: "🥣", veg: true, bestseller: false },
  { id: 'm84d', restaurantId: 'r21', name: "Sweet Lassi", description: "Thick yogurt drink", price: 80, category: "Drinks", inStock: true, stockCount: 40, image: "🥛", veg: true, bestseller: false },

  // DELHI (r7, r9, r10) - 8 items each
  { id: 'm25', restaurantId: 'r7', name: "Veg Tacos (3pcs)", description: "Soft shells with beans and corn", price: 220, category: "Tacos", inStock: true, stockCount: 25, image: "🌮", veg: true, bestseller: true },
  { id: 'm26', restaurantId: 'r7', name: "Chicken Burrito", description: "Large tortilla with grilled chicken", price: 280, category: "Mexican", inStock: true, stockCount: 20, image: "🌯", veg: false, bestseller: true },
  { id: 'm27', restaurantId: 'r7', name: "Cheese Quesadilla", description: "Melted cheese in flour tortillas", price: 240, category: "Sides", inStock: true, stockCount: 20, image: "🫓", veg: true, bestseller: false },
  { id: 'm28', restaurantId: 'r7', name: "Beef Nachos", description: "Crispy chips with minced meat and cheese", price: 320, category: "Mexican", inStock: true, stockCount: 15, image: "🌮", veg: false, bestseller: false },
  { id: 'm28a', restaurantId: 'r7', name: "Guacamole & Chips", description: "Fresh avocado dip", price: 180, category: "Sides", inStock: true, stockCount: 30, image: "🥑", veg: true, bestseller: true },
  { id: 'm28b', restaurantId: 'r7', name: "Churro Bites", description: "Cinnamon sugar sticks", price: 120, category: "Desserts", inStock: true, stockCount: 40, image: "🥨", veg: true, bestseller: false },
  { id: 'm28c', restaurantId: 'r7', name: "Enchiladas", description: "Chicken stuffed and oven baked", price: 350, category: "Mexican", inStock: true, stockCount: 15, image: "🌯", veg: false, bestseller: true },
  { id: 'm28d', restaurantId: 'r7', name: "Margarita Mix", description: "Non-alcoholic lime base", price: 90, category: "Drinks", inStock: true, stockCount: 50, image: "🥤", veg: true, bestseller: false },

  { id: 'm33', restaurantId: 'r9', name: "Aloo Pyaaz Paratha", description: "Crispy tandoori paratha", price: 110, category: "Main", inStock: true, stockCount: 50, image: "🥞", veg: true, bestseller: true },
  { id: 'm34', restaurantId: 'r9', name: "Chicken Keema Paratha", description: "Spicy minced chicken stuffing", price: 160, category: "Main", inStock: true, stockCount: 30, image: "🥞", veg: false, bestseller: true },
  { id: 'm35', restaurantId: 'r9', name: "Paneer Paratha", description: "Fresh paneer stuffed flatbread", price: 140, category: "Main", inStock: true, stockCount: 40, image: "🥞", veg: true, bestseller: false },
  { id: 'm36', restaurantId: 'r9', name: "Egg Paratha", description: "Classic egg stuffed paratha", price: 130, category: "Main", inStock: true, stockCount: 45, image: "🥞", veg: false, bestseller: false },
  { id: 'm36a', restaurantId: 'r9', name: "Lassi Bowl", description: "Thick sweet yogurt with nuts", price: 100, category: "Drinks", inStock: true, stockCount: 40, image: "🥛", veg: true, bestseller: true },
  { id: 'm36b', restaurantId: 'r9', name: "Gobi Paratha", description: "Spiced cauliflower stuffing", price: 120, category: "Main", inStock: true, stockCount: 50, image: "🥞", veg: true, bestseller: false },
  { id: 'm36c', restaurantId: 'r9', name: "Mango Pickle", description: "Spicy side accompaniment", price: 20, category: "Sides", inStock: true, stockCount: 100, image: "🥣", veg: true, bestseller: false },
  { id: 'm36d', restaurantId: 'r9', name: "Rabri Cup", description: "Traditional thickened milk", price: 80, category: "Desserts", inStock: true, stockCount: 30, image: "🍮", veg: true, bestseller: true },

  { id: 'm37', restaurantId: 'r10', name: "Kashmiri Dum Aloo", description: "Baby potatoes in yogurt gravy", price: 320, category: "Main", inStock: true, stockCount: 15, image: "🥔", veg: true, bestseller: true },
  { id: 'm38', restaurantId: 'r10', name: "Mutton Rogan Josh", description: "Authentic Kashmiri lamb curry", price: 480, category: "Main", inStock: true, stockCount: 12, image: "🍗", veg: false, bestseller: true },
  { id: 'm39', restaurantId: 'r10', name: "Veg Pulao Kashmiri", description: "Saffron rice with dry fruits", price: 280, category: "Rice", inStock: true, stockCount: 20, image: "🍚", veg: true, bestseller: false },
  { id: 'm40', restaurantId: 'r10', name: "Chicken Yakhni", description: "Mild chicken curry in yogurt base", price: 410, category: "Main", inStock: true, stockCount: 10, image: "🍗", veg: false, bestseller: false },
  { id: 'm40a', restaurantId: 'r10', name: "Gustaba", description: "Minced meat balls in white gravy", price: 550, category: "Legendary", inStock: true, stockCount: 8, image: "🍗", veg: false, bestseller: true },
  { id: 'm40b', restaurantId: 'r10', name: "Kahwa Tea", description: "Authentic Kashmiri spice tea", price: 120, category: "Drinks", inStock: true, stockCount: 50, image: "☕", veg: true, bestseller: true },
  { id: 'm40c', restaurantId: 'r10', name: "Tabak Maaz", description: "Rib chops fried in ghee", price: 520, category: "Starters", inStock: true, stockCount: 10, image: "🥩", veg: false, bestseller: false },
  { id: 'm40d', restaurantId: 'r10', name: "Sheermal", description: "Saffron flavored flatbread", price: 90, category: "Breads", inStock: true, stockCount: 30, image: "🫓", veg: true, bestseller: false },

  // BANGALORE (r11-r15) - 8 items each
  { id: 'm41', restaurantId: 'r11', name: "Ghee Podi Idli", description: "Soft idlis with gunpowder and ghee", price: 120, category: "Breakfast", inStock: true, stockCount: 80, image: "⚪", veg: true, bestseller: true },
  { id: 'm42', restaurantId: 'r11', name: "Chicken Keema Dosa", description: "Crispy dosa with chicken stuffing", price: 220, category: "South Indian", inStock: true, stockCount: 40, image: "🥞", veg: false, bestseller: true },
  { id: 'm43', restaurantId: 'r11', name: "Benne Masala Dosa", description: "Butter laden masala dosa", price: 140, category: "Breakfast", inStock: true, stockCount: 70, image: "🥞", veg: true, bestseller: false },
  { id: 'm44', restaurantId: 'r11', name: "Mutton Brain Fry", description: "Spicy Bangalore style specialty", price: 350, category: "Legendary", inStock: true, stockCount: 15, image: "🥩", veg: false, bestseller: false },
  { id: 'm44a', restaurantId: 'r11', name: "Filter Coffee", description: "Iconic South Indian coffee", price: 50, category: "Drinks", inStock: true, stockCount: 200, image: "☕", veg: true, bestseller: true },
  { id: 'm44b', restaurantId: 'r11', name: "Rava Khara Bhath", description: "Savory semolina with spices", price: 80, category: "Breakfast", inStock: true, stockCount: 60, image: "🥣", veg: true, bestseller: false },
  { id: 'm44c', restaurantId: 'r11', name: "Chicken Donne Biryani", description: "Authentic green masala biryani", price: 290, category: "Biryani", inStock: true, stockCount: 40, image: "🍚", veg: false, bestseller: true },
  { id: 'm44d', restaurantId: 'r11', name: "Badam Milk", description: "Sweet almond flavored milk", price: 90, category: "Drinks", inStock: true, stockCount: 50, image: "🥛", veg: true, bestseller: false },

  { id: 'm45', restaurantId: 'r12', name: "Pasta Alfredo", description: "Creamy white sauce with veggies", price: 320, category: "Pasta", inStock: true, stockCount: 25, image: "🍝", veg: true, bestseller: true },
  { id: 'm46', restaurantId: 'r12', name: "Grilled Chicken Steak", description: "Mushroom sauce and mash", price: 550, category: "Continental", inStock: true, stockCount: 15, image: "🥩", veg: false, bestseller: true },
  { id: 'm47', restaurantId: 'r12', name: "Veg Lasagna", description: "Layered pasta with cheese and sauce", price: 380, category: "Pasta", inStock: true, stockCount: 20, image: "🥘", veg: true, bestseller: false },
  { id: 'm48', restaurantId: 'r12', name: "Pork Chops", description: "Honey glazed with roasted veggies", price: 620, category: "Continental", inStock: true, stockCount: 10, image: "🥩", veg: false, bestseller: false },
  { id: 'm48a', restaurantId: 'r12', name: "Bruschetta Platter", description: "Toasted bread with toppings", price: 280, category: "Starters", inStock: true, stockCount: 30, image: "🍞", veg: true, bestseller: true },
  { id: 'm48b', restaurantId: 'r12', name: "Tiramisu", description: "Classic Italian coffee cake", price: 250, category: "Desserts", inStock: true, stockCount: 20, image: "🍰", veg: true, bestseller: true },
  { id: 'm48c', restaurantId: 'r12', name: "Calamari Rings", description: "Crispy fried squid", price: 420, category: "Starters", inStock: true, stockCount: 15, image: "🦑", veg: false, bestseller: false },
  { id: 'm48d', restaurantId: 'r12', name: "Garlic Prawns", description: "In white wine sauce", price: 580, category: "Seafood", inStock: true, stockCount: 12, image: "🍤", veg: false, bestseller: true },

  { id: 'm49', restaurantId: 'r13', name: "Veg Club Sandwich", description: "Triple decker veggie delight", price: 180, category: "Snacks", inStock: true, stockCount: 40, image: "🥪", veg: true, bestseller: true },
  { id: 'm50', restaurantId: 'r13', name: "Fish and Chips", description: "Classic batter fried fish", price: 380, category: "Main", inStock: true, stockCount: 20, image: "🐟", veg: false, bestseller: true },
  { id: 'm51', restaurantId: 'r13', name: "Cold Coffee with Ice Cream", description: "Signature brew", price: 150, category: "Drinks", inStock: true, stockCount: 60, image: "🧋", veg: true, bestseller: false },
  { id: 'm52', restaurantId: 'r13', name: "Chicken Roast Sandwich", description: "Juicy roasted chicken slices", price: 220, category: "Snacks", inStock: true, stockCount: 30, image: "🥪", veg: false, bestseller: false },
  { id: 'm52a', restaurantId: 'r13', name: "English Breakfast Platter", description: "Eggs, toast, beans, sausage", price: 450, category: "Breakfast", inStock: true, stockCount: 15, image: "🍳", veg: false, bestseller: true },
  { id: 'm52b', restaurantId: 'r13', name: "Baked Beans on Toast", description: "Classic comfort food", price: 160, category: "Breakfast", inStock: true, stockCount: 40, image: "🍞", veg: true, bestseller: false },
  { id: 'm52c', restaurantId: 'r13', name: "Caramel Custard", description: "Silky smooth dessert", price: 140, category: "Desserts", inStock: true, stockCount: 25, image: "🍮", veg: true, bestseller: true },
  { id: 'm52d', restaurantId: 'r13', name: "Lemon Iced Tea", description: "Refreshing citrus drink", price: 100, category: "Drinks", inStock: true, stockCount: 50, image: "🥤", veg: true, bestseller: false },

  { id: 'm53', restaurantId: 'r14', name: "Cheesy Potato Wedges", description: "Crispy wedges with jalapeno dip", price: 220, category: "Sides", inStock: true, stockCount: 40, image: "🥔", veg: true, bestseller: true },
  { id: 'm54', restaurantId: 'r14', name: "BBQ Chicken Pizza", description: "Smoky chicken and red onions", price: 480, category: "Pizza", inStock: true, stockCount: 15, image: "🍕", veg: false, bestseller: true },
  { id: 'm55', restaurantId: 'r14', name: "Four Cheese Pizza", description: "Mozzarella, Cheddar, Parmesan", price: 450, category: "Pizza", inStock: true, stockCount: 30, image: "🍕", veg: true, bestseller: false },
  { id: 'm56', restaurantId: 'r14', name: "Pepperoni Special", description: "Double pepperoni pizza", price: 520, category: "Pizza", inStock: true, stockCount: 10, image: "🍕", veg: false, bestseller: false },
  { id: 'm56a', restaurantId: 'r14', name: "Veg Pesto Pasta", description: "Fusilli in fresh basil pesto", price: 340, category: "Pasta", inStock: true, stockCount: 20, image: "🍝", veg: true, bestseller: true },
  { id: 'm56b', restaurantId: 'r14', name: "Chicken Alfredo", description: "Creamy white sauce pasta", price: 420, category: "Pasta", inStock: true, stockCount: 18, image: "🍝", veg: false, bestseller: true },
  { id: 'm56c', restaurantId: 'r14', name: "Loaded Veggie Nachos", description: "Topped with salsa and sour cream", price: 290, category: "Sides", inStock: true, stockCount: 25, image: "🌮", veg: true, bestseller: false },
  { id: 'm56d', restaurantId: 'r14', name: "Craft Root Beer", description: "Non-alcoholic specialty brew", price: 120, category: "Drinks", inStock: true, stockCount: 50, image: "🥤", veg: true, bestseller: true },

  { id: 'm57', restaurantId: 'r15', name: "Rava Idli", description: "Steamed semolina cakes", price: 90, category: "Breakfast", inStock: true, stockCount: 100, image: "⚪", veg: true, bestseller: true },
  { id: 'm58', restaurantId: 'r15', name: "MTR Special Thali (Veg)", description: "Full traditional meal", price: 350, category: "Meals", inStock: true, stockCount: 40, image: "🍱", veg: true, bestseller: true },
  { id: 'm59', restaurantId: 'r15', name: "Bisi Bele Bath", description: "Spicy lentil rice bowl", price: 120, category: "Main", inStock: true, stockCount: 60, image: "🍚", veg: true, bestseller: false },
  { id: 'm60', restaurantId: 'r15', name: "Vada Sambar", description: "Crunchy lentil donuts", price: 80, category: "Breakfast", inStock: true, stockCount: 120, image: "🍩", veg: true, bestseller: false },
  { id: 'm60a', restaurantId: 'r15', name: "Badam Halwa", description: "Rich almond sweet", price: 150, category: "Desserts", inStock: true, stockCount: 30, image: "🍮", veg: true, bestseller: true },
  { id: 'm60b', restaurantId: 'r15', name: "Masala Dosa", description: "Classic spiced potato crepe", price: 130, category: "Breakfast", inStock: true, stockCount: 150, image: "🥞", veg: true, bestseller: true },
  { id: 'm60c', restaurantId: 'r15', name: "Chicken Kebab (South)", description: "Spicy fried chicken chunks", price: 220, category: "Non-Veg", inStock: true, stockCount: 40, image: "🍗", veg: false, bestseller: false },
  { id: 'm60d', restaurantId: 'r15', name: "Mutton Sukka", description: "Dry spicy mutton fry", price: 450, category: "Non-Veg", inStock: true, stockCount: 20, image: "🍗", veg: false, bestseller: true },

  // MUMBAI (r3, r4, r5) - 8 items each
  { id: 'm9', restaurantId: 'r3', name: "Veg Hakka Noodles", description: "Stir-fried soy noodles", price: 220, category: "Noodles", inStock: true, stockCount: 20, image: "🍜", veg: true, bestseller: true },
  { id: 'm10', restaurantId: 'r3', name: "Chicken Manchurian", description: "Crispy chicken in tangy sauce", price: 260, category: "Chinese", inStock: true, stockCount: 15, image: "🍗", veg: false, bestseller: true },
  { id: 'm11', restaurantId: 'r3', name: "Paneer Chilli", description: "Cottage cheese in spicy soy sauce", price: 240, category: "Chinese", inStock: true, stockCount: 18, image: "🧀", veg: true, bestseller: false },
  { id: 'm12', restaurantId: 'r3', name: "Schezwan Chicken", description: "Spicy garlic chicken stir-fry", price: 290, category: "Chinese", inStock: true, stockCount: 12, image: "🍗", veg: false, bestseller: false },
  { id: 'm12a', restaurantId: 'r3', name: "Veg Fried Rice", description: "Classic Chinese rice bowl", price: 180, category: "Rice", inStock: true, stockCount: 40, image: "🍚", veg: true, bestseller: true },
  { id: 'm12b', restaurantId: 'r3', name: "Spring Rolls (4pcs)", description: "Crispy vegetable rolls", price: 150, category: "Starters", inStock: true, stockCount: 50, image: "🥟", veg: true, bestseller: false },
  { id: 'm12c', restaurantId: 'r3', name: "Chicken Hot & Sour Soup", description: "Tangy and spicy broth", price: 140, category: "Soups", inStock: true, stockCount: 30, image: "🥣", veg: false, bestseller: true },
  { id: 'm12d', restaurantId: 'r3', name: "Honey Chilli Potato", description: "Crispy sweet and spicy fries", price: 210, category: "Starters", inStock: true, stockCount: 25, image: "🍟", veg: true, bestseller: false },

  { id: 'm13', restaurantId: 'r4', name: "Garden Veggie Burger", description: "Grilled vegetable patty with cheese", price: 190, category: "Burgers", inStock: true, stockCount: 30, image: "🍔", veg: true, bestseller: true },
  { id: 'm14', restaurantId: 'r4', name: "Classic Smash Burger", description: "Double smashed patty with cheese", price: 250, category: "Burgers", inStock: true, stockCount: 30, image: "🍔", veg: false, bestseller: true },
  { id: 'm15', restaurantId: 'r4', name: "Peri Peri Fries", description: "Spicy seasoned crinkly fries", price: 120, category: "Sides", inStock: true, stockCount: 50, image: "🍟", veg: true, bestseller: false },
  { id: 'm16', restaurantId: 'r4', name: "Chicken Nuggets (6pcs)", description: "Golden fried crispy bites", price: 180, category: "Starters", inStock: true, stockCount: 40, image: "🍗", veg: false, bestseller: false },
  { id: 'm16a', restaurantId: 'r4', name: "BBQ Paneer Burger", description: "Grilled paneer with BBQ sauce", price: 210, category: "Burgers", inStock: true, stockCount: 25, image: "🍔", veg: true, bestseller: true },
  { id: 'm16b', restaurantId: 'r4', name: "Bacon & Egg Burger", description: "The ultimate breakfast burger", price: 280, category: "Burgers", inStock: true, stockCount: 15, image: "🍔", veg: false, bestseller: false },
  { id: 'm16c', restaurantId: 'r4', name: "Onion Rings", description: "Crispy batter fried rings", price: 140, category: "Sides", inStock: true, stockCount: 30, image: "🥯", veg: true, bestseller: false },
  { id: 'm16d', restaurantId: 'r4', name: "Chocolate Shake", description: "Rich and creamy dessert drink", price: 160, category: "Drinks", inStock: true, stockCount: 20, image: "🥤", veg: true, bestseller: true },

  { id: 'm17', restaurantId: 'r5', name: "Veg California Roll", description: "Cucumber and avocado maki", price: 350, category: "Rolls", inStock: true, stockCount: 15, image: "🍣", veg: true, bestseller: true },
  { id: 'm18', restaurantId: 'r5', name: "Salmon Nigiri", description: "Fresh salmon over rice", price: 420, category: "Nigiri", inStock: true, stockCount: 10, image: "🍣", veg: false, bestseller: true },
  { id: 'm19', restaurantId: 'r5', name: "Tempura Veg Sushi", description: "Crispy tempura vegetables", price: 380, category: "Nigiri", inStock: true, stockCount: 12, image: "🍣", veg: true, bestseller: false },
  { id: 'm20', restaurantId: 'r5', name: "Prawn Tempura Roll", description: "Crispy prawn with spicy mayo", price: 550, category: "Rolls", inStock: true, stockCount: 8, image: "🍣", veg: false, bestseller: false },
  { id: 'm20a', restaurantId: 'r5', name: "Edamame Beans", description: "Steamed soya beans with sea salt", price: 250, category: "Starters", inStock: true, stockCount: 30, image: "🫛", veg: true, bestseller: true },
  { id: 'm20b', restaurantId: 'r5', name: "Miso Soup", description: "Traditional Japanese soybean broth", price: 180, category: "Soups", inStock: true, stockCount: 40, image: "🥣", veg: true, bestseller: false },
  { id: 'm20c', restaurantId: 'r5', name: "Chicken Teriyaki Bowl", description: "Grilled chicken with sweet soy", price: 480, category: "Bowls", inStock: true, stockCount: 15, image: "🍚", veg: false, bestseller: true },
  { id: 'm20d', restaurantId: 'r5', name: "Matcha Ice Cream", description: "Green tea flavored dessert", price: 190, category: "Desserts", inStock: true, stockCount: 20, image: "🍨", veg: true, bestseller: false },

  // HYDERABAD (r17, r18, r19, r20) - 8 items each
  { id: 'm65', restaurantId: 'r17', name: "Paneer 65 Biryani", description: "Spicy paneer chunk biryani", price: 320, category: "Biryani", inStock: true, stockCount: 40, image: "🍚", veg: true, bestseller: true },
  { id: 'm66', restaurantId: 'r17', name: "Special Mutton Biryani", description: "Shah Ghouse signature", price: 480, category: "Biryani", inStock: true, stockCount: 60, image: "🍚", veg: false, bestseller: true },
  { id: 'm67', restaurantId: 'r17', name: "Veg Manchurian", description: "Indo-Chinese veg balls", price: 210, category: "Chinese", inStock: true, stockCount: 30, image: "🥟", veg: true, bestseller: false },
  { id: 'm68', restaurantId: 'r17', name: "Chicken 65", description: "Spicy fried chicken chunks", price: 280, category: "Starters", inStock: true, stockCount: 40, image: "🍗", veg: false, bestseller: false },
  { id: 'm68a', restaurantId: 'r17', name: "Tandoori Chicken (Full)", description: "Traditional clay oven chicken", price: 540, category: "Starters", inStock: true, stockCount: 20, image: "🍗", veg: false, bestseller: true },
  { id: 'm68b', restaurantId: 'r17', name: "Rumali Roti (2pcs)", description: "Soft thin flatbread", price: 80, category: "Breads", inStock: true, stockCount: 100, image: "🫓", veg: true, bestseller: false },
  { id: 'm68c', restaurantId: 'r17', name: "Mutton Keema", description: "Minced mutton with peas", price: 420, category: "Main", inStock: true, stockCount: 15, image: "🥘", veg: false, bestseller: true },
  { id: 'm68d', restaurantId: 'r17', name: "Falooda", description: "Rose flavored cold dessert", price: 150, category: "Desserts", inStock: true, stockCount: 30, image: "🍨", veg: true, bestseller: true },

  { id: 'm69', restaurantId: 'r18', name: "MLA Pesarattu", description: "Moong dal crepe", price: 180, category: "Breakfast", inStock: true, stockCount: 50, image: "🥞", veg: true, bestseller: true },
  { id: 'm70', restaurantId: 'r18', name: "Chicken Masala Dosa", description: "Meat stuffed spicy dosa", price: 240, category: "Breakfast", inStock: true, stockCount: 30, image: "🥞", veg: false, bestseller: true },
  { id: 'm71', restaurantId: 'r18', name: "Guntur Idli", description: "Chilli powder coated idlis", price: 130, category: "Breakfast", inStock: true, stockCount: 60, image: "⚪", veg: true, bestseller: false },
  { id: 'm72', restaurantId: 'r18', name: "Prawns Fry", description: "Spicy coastal Andhra specialty", price: 380, category: "Non-Veg", inStock: true, stockCount: 20, image: "🍤", veg: false, bestseller: false },
  { id: 'm72a', restaurantId: 'r18', name: "Cheese Ravva Dosa", description: "Crispy semolina dosa with cheese", price: 160, category: "Breakfast", inStock: true, stockCount: 40, image: "🥞", veg: true, bestseller: true },
  { id: 'm72b', restaurantId: 'r18', name: "Gongura Chicken", description: "Spicy sorrel leaf chicken curry", price: 350, category: "Non-Veg", inStock: true, stockCount: 25, image: "🥘", veg: false, bestseller: true },
  { id: 'm72c', restaurantId: 'r18', name: "Poori Bhaji", description: "Fluffy fried bread with potato", price: 120, category: "Breakfast", inStock: true, stockCount: 50, image: "🥯", veg: true, bestseller: false },
  { id: 'm72d', restaurantId: 'r18', name: "Neer Dosa with Gravy", description: "Water thin dosa with spicy veg", price: 210, category: "Main", inStock: true, stockCount: 30, image: "🥞", veg: true, bestseller: false },

  { id: 'm73', restaurantId: 'r19', name: "Veg Fried Rice", description: "Wok tossed garden rice", price: 190, category: "Rice", inStock: true, stockCount: 40, image: "🍚", veg: true, bestseller: true },
  { id: 'm74', restaurantId: 'r19', name: "Chicken Manchurian Gravy", description: "Spicy chicken dumplings", price: 280, category: "Main", inStock: true, stockCount: 30, image: "🍗", veg: false, bestseller: true },
  { id: 'm75', restaurantId: 'r19', name: "Honey Chilli Potato", description: "Crispy sweet and spicy", price: 180, category: "Starters", inStock: true, stockCount: 40, image: "🍟", veg: true, bestseller: false },
  { id: 'm76', restaurantId: 'r19', name: "Dragon Chicken", description: "Spicy stir fried chicken", price: 310, category: "Starters", inStock: true, stockCount: 25, image: "🍗", veg: false, bestseller: false },
  { id: 'm76a', restaurantId: 'r19', name: "Paneer Satay", description: "Grilled paneer with peanut sauce", price: 240, category: "Starters", inStock: true, stockCount: 20, image: "🍢", veg: true, bestseller: true },
  { id: 'm76b', restaurantId: 'r19', name: "Veg Spring Rolls", description: "Crispy vegetable maki", price: 160, category: "Starters", inStock: true, stockCount: 50, image: "🥟", veg: true, bestseller: false },
  { id: 'm76c', restaurantId: 'r19', name: "American Chopsuey", description: "Crispy noodles with sweet sauce", price: 290, category: "Main", inStock: true, stockCount: 15, image: "🍜", veg: false, bestseller: true },
  { id: 'm76d', restaurantId: 'r19', name: "Sizzling Brownie", description: "Hot brownie with vanilla ice cream", price: 220, category: "Desserts", inStock: true, stockCount: 20, image: "🍰", veg: true, bestseller: true },

  { id: 'm77', restaurantId: 'r20', name: "Quinoa Salad", description: "Healthy organic grain bowl", price: 380, category: "Salads", inStock: true, stockCount: 20, image: "🥗", veg: true, bestseller: true },
  { id: 'm78', restaurantId: 'r20', name: "Grilled Salmon Platter", description: "Fresh fish with lemon butter", price: 650, category: "Main", inStock: true, stockCount: 10, image: "🍣", veg: false, bestseller: true },
  { id: 'm79', restaurantId: 'r20', name: "Wild Mushroom Risotto", description: "Italian style creamy rice", price: 450, category: "Main", inStock: true, stockCount: 15, image: "🍚", veg: true, bestseller: false },
  { id: 'm80', restaurantId: 'r20', name: "Lamb Chops (Fusion)", description: "Grilled with reduction sauce", price: 720, category: "Main", inStock: true, stockCount: 8, image: "🥩", veg: false, bestseller: false },
  { id: 'm80a', restaurantId: 'r20', name: "Avocado Toast", description: "Classic healthy breakfast bowl", price: 320, category: "Breakfast", inStock: true, stockCount: 25, image: "🥑", veg: true, bestseller: true },
  { id: 'm80b', restaurantId: 'r20', name: "Truffle Fries", description: "Crispy fries with truffle oil", price: 250, category: "Sides", inStock: true, stockCount: 40, image: "🍟", veg: true, bestseller: false },
  { id: 'm80c', restaurantId: 'r20', name: "Seared Scallops", description: "With pea puree", price: 850, category: "Seafood", inStock: true, stockCount: 5, image: "🐚", veg: false, bestseller: true },
  { id: 'm80d', restaurantId: 'r20', name: "Creme Brulee", description: "Torched vanilla custard", price: 280, category: "Desserts", inStock: true, stockCount: 15, image: "🍮", veg: true, bestseller: true },

  // PUNE (r22, r23, r24, r25) - 8 items each
  { id: 'm85', restaurantId: 'r22', name: "Veg Cheese Sandwich", description: "Signature grill sandwich", price: 140, category: "Snacks", inStock: true, stockCount: 120, image: "🥪", veg: true, bestseller: true },
  { id: 'm86', restaurantId: 'r22', name: "Chicken Mayo Sandwich", description: "Classic cold chicken signature", price: 180, category: "Snacks", inStock: true, stockCount: 80, image: "🥪", veg: false, bestseller: true },
  { id: 'm87', restaurantId: 'r22', name: "Bun Maska", description: "Butter loaded soft bun", price: 60, category: "Breakfast", inStock: true, stockCount: 200, image: "🥯", veg: true, bestseller: false },
  { id: 'm88', restaurantId: 'r22', name: "Chicken Burger Sandwich", description: "Patty with coleslaw", price: 190, category: "Snacks", inStock: true, stockCount: 40, image: "🥪", veg: false, bestseller: false },
  { id: 'm88a', restaurantId: 'r22', name: "Cold Coffee", description: "Marz-O-Rin special", price: 90, category: "Drinks", inStock: true, stockCount: 100, image: "🧋", veg: true, bestseller: true },
  { id: 'm88b', restaurantId: 'r22', name: "Veg Cutlet (2pcs)", description: "Crispy vegetable patties", price: 80, category: "Snacks", inStock: true, stockCount: 60, image: "🍘", veg: true, bestseller: false },
  { id: 'm88c', restaurantId: 'r22', name: "Mutton Cutlet (2pcs)", description: "Spiced minced meat patties", price: 150, category: "Snacks", inStock: true, stockCount: 30, image: "🍘", veg: false, bestseller: true },
  { id: 'm88d', restaurantId: 'r22', name: "Rose Syrup Drink", description: "Cool and refreshing", price: 50, category: "Drinks", inStock: true, stockCount: 80, image: "🥤", veg: true, bestseller: false },

  { id: 'm89', restaurantId: 'r23', name: "Eggless Apple Pie", description: "Fresh baked crumble", price: 250, category: "Desserts", inStock: true, stockCount: 25, image: "🥧", veg: true, bestseller: true },
  { id: 'm90', restaurantId: 'r23', name: "Chicken Quiche", description: "Savoury chicken pastry", price: 220, category: "Bakery", inStock: true, stockCount: 20, image: "🥧", veg: false, bestseller: true },
  { id: 'm91', restaurantId: 'r23', name: "Chocolate Brownie", description: "Rich and fudgy", price: 120, category: "Desserts", inStock: true, stockCount: 40, image: "🍫", veg: true, bestseller: false },
  { id: 'm92', restaurantId: 'r23', name: "Cheese & Meat Croissant", description: "Buttery pastry with ham", price: 180, category: "Bakery", inStock: true, stockCount: 15, image: "🥐", veg: false, bestseller: false },
  { id: 'm92a', restaurantId: 'r23', name: "Veg Garden Salad", description: "Fresh greens with vinaigrette", price: 190, category: "Salads", inStock: true, stockCount: 20, image: "🥗", veg: true, bestseller: true },
  { id: 'm92b', restaurantId: 'r23', name: "Hot Chocolate", description: "Thick and creamy", price: 150, category: "Drinks", inStock: true, stockCount: 40, image: "☕", veg: true, bestseller: false },
  { id: 'm92c', restaurantId: 'r23', name: "Chicken Caesar Salad", description: "Classic with croutons", price: 280, category: "Salads", inStock: true, stockCount: 15, image: "🥗", veg: false, bestseller: true },
  { id: 'm92d', restaurantId: 'r23', name: "Blueberry Muffin", description: "Soft baked with berries", price: 110, category: "Bakery", inStock: true, stockCount: 30, image: "🧁", veg: true, bestseller: false },

  { id: 'm93', restaurantId: 'r24', name: "Veg Pulao (Paneer)", description: "Persian style paneer rice", price: 240, category: "Rice", inStock: true, stockCount: 35, image: "🍚", veg: true, bestseller: true },
  { id: 'm94', restaurantId: 'r24', name: "Mutton Chelo Kabab", description: "Classic Iranian non-veg", price: 550, category: "Legendary", inStock: true, stockCount: 20, image: "🍢", veg: false, bestseller: true },
  { id: 'm95', restaurantId: 'r24', name: "Zereshk Pulao (Veg)", description: "Rice with sour barberries", price: 280, category: "Rice", inStock: true, stockCount: 25, image: "🍚", veg: true, bestseller: false },
  { id: 'm96', restaurantId: 'r24', name: "Chicken Jujeh Kabab", description: "Saffron marinated chicken", price: 420, category: "Starters", inStock: true, stockCount: 15, image: "🍢", veg: false, bestseller: false },
  { id: 'm96a', restaurantId: 'r24', name: "Special Irani Chai", description: "Strong and milky tea", price: 40, category: "Drinks", inStock: true, stockCount: 100, image: "☕", veg: true, bestseller: true },
  { id: 'm96b', restaurantId: 'r24', name: "Kharchni (Veg)", description: "Spiced vegetable appetizer", price: 210, category: "Starters", inStock: true, stockCount: 30, image: "🍘", veg: true, bestseller: false },
  { id: 'm96c', restaurantId: 'r24', name: "Persian Chicken Stew", description: "Rich walnuts and pomegranate", price: 480, category: "Main", inStock: true, stockCount: 12, image: "🥘", veg: false, bestseller: true },
  { id: 'm96d', restaurantId: 'r24', name: "Baklava (2pcs)", description: "Sweet layered pastry", price: 180, category: "Desserts", inStock: true, stockCount: 25, image: "🥧", veg: true, bestseller: true },

  { id: 'm97', restaurantId: 'r25', name: "Puran Poli", description: "Maharashtrian sweet bread", price: 80, category: "Desserts", inStock: true, stockCount: 50, image: "🥞", veg: true, bestseller: true },
  { id: 'm98', restaurantId: 'r25', name: "Kolhapuri Chicken Thali", description: "Spicy authentic non-veg meal", price: 420, category: "Meals", inStock: true, stockCount: 30, image: "🍱", veg: false, bestseller: true },
  { id: 'm99', restaurantId: 'r25', name: "Maharashtrian Thali (Veg)", description: "Authentic local flavors", price: 350, category: "Meals", inStock: true, stockCount: 40, image: "🍱", veg: true, bestseller: false },
  { id: 'm100', restaurantId: 'r25', name: "Mutton Sukka", description: "Dry spicy mutton fry", price: 450, category: "Main", inStock: true, stockCount: 20, image: "🍗", veg: false, bestseller: false },
  { id: 'm100a', restaurantId: 'r25', name: "Sol Kadhi", description: "Refreshing digestant drink", price: 60, category: "Drinks", inStock: true, stockCount: 50, image: "🥛", veg: true, bestseller: true },
  { id: 'm100b', restaurantId: 'r25', name: "Pitla Bhakri", description: "Gram flour curry with bread", price: 120, category: "Main", inStock: true, stockCount: 40, image: "🫓", veg: true, bestseller: false },
  { id: 'm100c', restaurantId: 'r25', name: "Chicken Masala", description: "Semi-dry spicy chicken", price: 320, category: "Main", inStock: true, stockCount: 25, image: "🥘", veg: false, bestseller: true },
  { id: 'm100d', restaurantId: 'r25', name: "Modak (2pcs)", description: "Steamed sweet dumplings", price: 90, category: "Desserts", inStock: true, stockCount: 30, image: "🥟", veg: true, bestseller: true }
];

const ORDER_STATUSES = ['Placed', 'Confirmed', 'Preparing', 'Picked Up', 'On the Way', 'Delivered'];

const initialOrders = [
];

const DATA_VERSION = '2.0';

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    if (localStorage.getItem('fd_data_version') !== DATA_VERSION) {
      localStorage.clear();
      localStorage.setItem('fd_data_version', DATA_VERSION);
    }
    const saved = localStorage.getItem('fd_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = [...parsed];
      initialUsers.forEach(iu => { if (!merged.find(u => u.email === iu.email)) merged.push(iu); });
      return merged;
    }
    return initialUsers;
  });
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('fd_restaurants');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = [...parsed];
      initialRestaurants.forEach(ir => { if (!merged.find(r => r.id === ir.id)) merged.push(ir); });
      return merged;
    }
    return initialRestaurants;
  });
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('fd_menuItems');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = [...parsed];
      initialMenuItems.forEach(im => { if (!merged.find(m => m.id === im.id)) merged.push(im); });
      return merged;
    }
    return initialMenuItems;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('fd_orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = [...parsed];
      initialOrders.forEach(io => { if (!merged.find(o => o.id === io.id)) merged.push(io); });
      return merged;
    }
    return initialOrders;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('fd_cart');
    return saved ? JSON.parse(saved) : { restaurantId: null, items: [] };
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('fd_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist everything
  useEffect(() => { localStorage.setItem('fd_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('fd_restaurants', JSON.stringify(restaurants)); }, [restaurants]);
  useEffect(() => { localStorage.setItem('fd_menuItems', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('fd_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('fd_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('fd_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Try API load
  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const resRestaurants = await apiService.getRestaurants();
        if (resRestaurants.success && Array.isArray(resRestaurants.data) && resRestaurants.data.length > 0) {
          setRestaurants(prev => {
            const merged = [...resRestaurants.data];
            prev.forEach(p => { if (!merged.find(r => r.id === p.id)) merged.push(p); });
            return merged;
          });
        }
        
        const resOrders = await apiService.getOrders();
        if (resOrders.success && Array.isArray(resOrders.data)) {
          setOrders(prev => {
            const merged = [...resOrders.data];
            prev.forEach(p => { if (!merged.find(o => o.id === p.id)) merged.push(p); });
            return merged;
          });
        }
        const resUsers = await apiService.getUsers();
        if (resUsers.success && Array.isArray(resUsers.data)) {
          setUsers(prev => {
            const merged = resUsers.data.map(u => ({
              ...u,
              onDuty: u.role === 'agent' ? (u.onDuty ?? true) : u.onDuty
            }));
            prev.forEach(p => { if (!merged.find(u => u.email === p.email)) merged.push(p); });
            return merged;
          });
        }
      } catch (err) { console.log("Error loading from API:", err); }
    };
    loadFromApi();
  }, []);

  // ─── Restaurant Helpers ───
  const getRestaurantsByCity = (city) => restaurants.filter(r => r.city?.toLowerCase() === city?.toLowerCase() || !r.city);
  const getRestaurantById = (id) => restaurants.find(r => String(r.id) === String(id));
  const getMenuForRestaurant = async (restaurantId) => {
    try {
      const res = await apiService.getMenuItems(restaurantId);
      if (res.success && res.data && res.data.length > 0) return res.data;
    } catch (e) { console.log(e); }
    // Fallback: coerce IDs to string for comparison
    return menuItems.filter(m => String(m.restaurantId) === String(restaurantId));
  };

  const addRestaurant = async (data) => {
    try {
      const res = await apiService.createRestaurant(data);
      if (res.success) {
        setRestaurants(prev => [...prev, res.data]);
        return res.data;
      }
    } catch (e) {
      console.log("addRestaurant api fail, using fallback:", e);
    }
    // Local fallback
    const newRes = { ...data, id: 'r' + Date.now() };
    setRestaurants(prev => [...prev, newRes]);
    return newRes;
  };

  const updateRestaurant = async (id, updates) => {
    const res = await apiService.updateRestaurant(id, updates);
    if (res.success) {
      setRestaurants(prev => prev.map(r => r.id === id ? res.data : r));
    } else {
      setRestaurants(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }
  };

  const deleteRestaurant = async (id) => {
    try { await apiService.deleteRestaurant(id); } catch(e) {}
    setRestaurants(prev => prev.filter(r => r.id !== id));
  };

  // ─── Menu & Inventory ───
  const addMenuItem = async (restaurantId, data) => {
    try {
      const res = await apiService.createMenuItem(restaurantId, data);
      if (res.success) {
        setMenuItems(prev => [...prev, res.data]);
        return res.data;
      }
    } catch(e) {}
    // Local fallback
    const newItem = { ...data, id: 'm' + Date.now(), restaurantId };
    setMenuItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateMenuItem = async (restaurantId, itemId, data) => {
    const res = await apiService.updateMenuItem(restaurantId, itemId, data);
    if (res.success) {
      setMenuItems(prev => prev.map(m => m.id === itemId ? res.data : m));
    } else {
      setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, ...data } : m));
    }
  };

  const deleteMenuItem = async (itemId) => {
    try { 
      // Need restaurantId for api call, but mock backend only needs itemId for deleteMenuItem in reality usually
      // however our api service needs (id, itemId)
      const item = menuItems.find(m => m.id === itemId);
      if (item) await apiService.deleteMenuItem(item.restaurantId, itemId); 
    } catch(e) {}
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
  };

  const updateStock = async (restaurantId, itemId, stock) => {
    try {
      const res = await apiService.updateStock(restaurantId, itemId, stock);
      if (res.success) {
        setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, stockCount: stock, inStock: stock > 0 } : m));
        return;
      }
    } catch (e) {
      console.log("updateStock error:", e);
    }
    
    // Local fallback
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, stockCount: stock, inStock: stock > 0 } : m));
  };

  // ─── Cart ───
  const addToCart = (restaurantId, menuItem, qty = 1) => {
    setCart(prev => {
      if (prev.restaurantId && prev.restaurantId !== restaurantId) {
        toast.info(`Cart cleared: You can only order from one restaurant at a time.`);
        return { restaurantId, items: [{ ...menuItem, quantity: qty }] };
      }
      const existing = prev.items.find(i => i.id === menuItem.id);
      if (existing) {
        return {
          restaurantId,
          items: prev.items.map(i => i.id === menuItem.id ? { ...i, quantity: i.quantity + qty } : i)
        };
      }
      toast.success(`Added ${menuItem.name} to basket!`);
      return { restaurantId, items: [...prev.items, { ...menuItem, quantity: qty }] };
    });
  };

  const removeFromCart = (menuItemId) => {
    setCart(prev => {
      const updated = prev.items.map(i => i.id === menuItemId ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      return { restaurantId: updated.length > 0 ? prev.restaurantId : null, items: updated };
    });
  };

  const clearCart = () => setCart({ restaurantId: null, items: [] });

  const getCartTotal = () => {
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const restaurant = restaurants.find(r => r.id === cart.restaurantId);
    const deliveryFee = restaurant?.deliveryFee || 0;
    return { subtotal, deliveryFee, total: subtotal + deliveryFee };
  };


  // ─── Orders ───
  const createOrder = async (orderData) => {
    try {
      const res = await apiService.createOrder(orderData);
      if (res.success) {
        setOrders(prev => [res.data, ...prev]);
        addNotification(orderData.customerId, `Your order from ${orderData.restaurantName} has been placed! 🎉`);
        return res.data.id;
      }
    } catch (e) { console.error("API failed:", e); }
    
    // Local fallback
    const idNum = Date.now() % 10000;
    const newOrder = {
      ...orderData,
      id: orderData.id || `ORD-${idNum}`,
      status: orderData.status || 'Placed',
      date: orderData.date || new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    addNotification(orderData.customerId, `Your order from ${orderData.restaurantName} has been placed! 🎉`);
    return newOrder.id;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await apiService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
        const order = orders.find(o => o.id === orderId);
        if (order) {
          addNotification(order.customerId, `Your order is now "${newStatus}" ${newStatus === 'Delivered' ? '🎉' : '📦'}`);
        }
        return;
      }
    } catch (e) {
      console.log("updateOrderStatus error:", e);
    }
    
    // Local fallback
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status: newStatus,
          statusTimestamps: { 
            ...(o.statusTimestamps || {}), 
            [newStatus]: new Date().toISOString() 
          }
        };
      }
      return o;
    }));
    
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      addNotification(targetOrder.customerId, `Your order is now "${newStatus}"!`);
    }
  };

  const assignAgent = async (orderId, agentId, agentName, agentPhone) => {
    try {
      const res = await apiService.assignAgent(orderId, agentId, agentName, agentPhone);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
        return res.data;
      }
    } catch (e) {
       console.log("assignAgent API fail:", e);
    }
    // Local fallback
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, agentId, agentName, agentPhone, status: 'Confirmed' } : o));
  };

  const deleteOrder = async (orderId) => {
    try {
      await apiService.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      return true;
    } catch (e) {
      console.error("deleteOrder failed:", e);
      // Optional: still delete local if backend fails but we want UI to update
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };


  // ─── Notifications ───
  const addNotification = (userId, message) => {
    const newNotif = { id: Date.now(), userId, message, read: false, date: new Date().toISOString() };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // ─── Users ───
  const addUser = (userData) => {
    const newUser = { id: Date.now(), ...userData };
    setUsers(prev => [...prev, newUser]);
  };
  const updateUser = async (userId, updates) => {
    // If updating onDuty, hit the API
    if (updates.hasOwnProperty('onDuty')) {
      try {
        await apiService.updateUserStatus(userId, updates.onDuty);
      } catch (e) { console.log("updateUserStatus error:", e); }
    }
    setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, ...updates } : u));
  };
  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => String(u.id) !== String(userId)));
  };

  return (
    <DataContext.Provider value={{
      users, restaurants, menuItems, orders, cart, notifications,
      ORDER_STATUSES,
      getRestaurantsByCity, getRestaurantById, getMenuForRestaurant,
      addRestaurant, updateRestaurant, deleteRestaurant,
      addMenuItem, updateMenuItem, deleteMenuItem, updateStock,
      addToCart, removeFromCart, clearCart, getCartTotal,
      createOrder, updateOrderStatus, assignAgent,
      addNotification, addUser, updateUser, deleteUser, deleteOrder,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export { ORDER_STATUSES };
export default DataContext;
