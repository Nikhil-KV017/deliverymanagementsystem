package com.example.demo.controller;

import com.example.demo.entity.MenuItem;
import com.example.demo.entity.Restaurant;
import com.example.demo.repo.MenuItemRepository;
import com.example.demo.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RestaurantController {

    @Autowired
    private RestaurantRepository repo;

    @Autowired
    private MenuItemRepository menuRepo;

    @PostConstruct
    public void initData() {
        if (repo.count() < 25) {
            repo.deleteAll();
            repo.saveAll(Arrays.asList(
                // MUMBAI (r1-r5)
                new Restaurant("r1", "Bombay Bites", Arrays.asList("Indian", "Street Food"), 4.5, "Mumbai", "Andheri West", "25-35", 30, "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400", true),
                new Restaurant("r2", "Pizza Paradise", Arrays.asList("Pizza", "Italian"), 4.3, "Mumbai", "Bandra", "30-40", 40, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", true),
                new Restaurant("r3", "Dragon Wok", Arrays.asList("Chinese", "Asian"), 4.1, "Mumbai", "Juhu", "20-30", 25, "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400", false),
                new Restaurant("r4", "Burger Barn", Arrays.asList("Burgers", "American"), 4.6, "Mumbai", "Powai", "15-25", 20, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", true),
                new Restaurant("r5", "Sushi Samurai", Arrays.asList("Japanese", "Sushi"), 4.7, "Mumbai", "Colaba", "35-45", 50, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400", false),
                
                // DELHI (r6-r10)
                new Restaurant("r6", "Delhi Darbar", Arrays.asList("Indian", "Mughlai"), 4.4, "Delhi", "Connaught Place", "25-35", 35, "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400", true),
                new Restaurant("r7", "Taco Fiesta", Arrays.asList("Mexican"), 4.2, "Delhi", "Hauz Khas", "20-30", 30, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", false),
                new Restaurant("r8", "The Great Kabab Factory", Arrays.asList("North Indian", "Kebab"), 4.8, "Delhi", "Saket", "30-40", 50, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", true),
                new Restaurant("r9", "Paranthe Wali Gali", Arrays.asList("Street Food", "North Indian"), 4.5, "Delhi", "Chandni Chowk", "15-25", 20, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400", false),
                new Restaurant("r10", "Chor Bizarre", Arrays.asList("Kashmiri", "Indian"), 4.3, "Delhi", "Daryaganj", "40-50", 40, "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", false),
                
                // BANGALORE (r11-r15)
                new Restaurant("r11", "The Rameshwaram Cafe", Arrays.asList("South Indian", "Quick Bites"), 4.9, "Bangalore", "Indiranagar", "15-25", 20, "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400", true),
                new Restaurant("r12", "Etruria Italian", Arrays.asList("Italian", "European"), 4.6, "Bangalore", "Koramangala", "35-45", 45, "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400", false),
                new Restaurant("r13", "Koshy's", Arrays.asList("Continental", "Cafe"), 4.4, "Bangalore", "MG Road", "20-30", 30, "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400", false),
                new Restaurant("r14", "Toit Brewpub", Arrays.asList("Pizza", "American"), 4.7, "Bangalore", "Indiranagar", "30-40", 40, "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400", true),
                new Restaurant("r15", "MTR - Mavalli Tiffin Rooms", Arrays.asList("South Indian", "Legendary"), 4.8, "Bangalore", "Lalbagh", "20-30", 30, "https://images.unsplash.com/photo-1626777553754-0744be66e4a6?w=400", true),
                
                // HYDERABAD (r16-r20)
                new Restaurant("r16", "Paradise Biryani", Arrays.asList("Biryani", "Hyderabadi"), 4.6, "Hyderabad", "Secunderabad", "30-40", 35, "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400", true),
                new Restaurant("r17", "Shah Ghouse", Arrays.asList("Biryani", "Mughlai"), 4.5, "Hyderabad", "Gachibowli", "25-35", 30, "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400", true),
                new Restaurant("r18", "Chutneys", Arrays.asList("South Indian", "Vegetarian"), 4.7, "Hyderabad", "Banjara Hills", "15-25", 25, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400", true),
                new Restaurant("r19", "Minerva Coffee Shop", Arrays.asList("South Indian", "Cafe"), 4.4, "Hyderabad", "Himayatnagar", "20-30", 25, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", false),
                new Restaurant("r20", "Tatva", Arrays.asList("Fusion", "Vegetarian"), 4.8, "Hyderabad", "Jubilee Hills", "40-50", 50, "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=400", true),
                
                // PUNE (r21-r25)
                new Restaurant("r21", "Vaishali", Arrays.asList("South Indian", "Student Favorite"), 4.7, "Pune", "FC Road", "15-25", 20, "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400", true),
                new Restaurant("r22", "Marz-O-Rin", Arrays.asList("Cafe", "Sandwiches"), 4.5, "Pune", "MG Road", "10-20", 15, "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400", true),
                new Restaurant("r23", "German Bakery", Arrays.asList("Bakery", "German"), 4.4, "Pune", "Koregaon Park", "20-30", 30, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", true),
                new Restaurant("r24", "Blue Nile", Arrays.asList("Iranian", "Biryani"), 4.3, "Pune", "Camp", "30-40", 40, "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400", false),
                new Restaurant("r25", "Shabree", Arrays.asList("Maharashtrian", "Thali"), 4.6, "Pune", "FC Road", "25-35", 30, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", true)
            ));
        }
        
        if (menuRepo.count() < 100) {
            menuRepo.deleteAll();
            menuRepo.saveAll(Arrays.asList(
                // MUMBAI (r1-r5) - 4 items each (2 veg, 2 non-veg)
                new MenuItem("m1", "Chicken Biryani", "Fragrant basmati rice with tender chicken", 280.0, "Biryani", true, 25, "🍚", "r1", false, true),
                new MenuItem("m2", "Veg Kohlapuri", "Spicy mixed vegetable curry", 220.0, "Curry", true, 20, "🥘", "r1", true, false),
                new MenuItem("m3", "Butter Chicken", "Rich tomato gravy with tandoori chicken", 320.0, "Curry", true, 15, "🍅", "r1", false, true),
                new MenuItem("m4", "Dal Tadka", "Yellow lentils tempered with aromatic spices", 180.0, "Curry", true, 50, "🥣", "r1", true, false),
                
                new MenuItem("m5", "Margherita Pizza", "Classic tomato and mozzarella", 350.0, "Pizza", true, 18, "🍕", "r2", true, true),
                new MenuItem("m6", "Pepperoni Feast", "Spicy pepperoni and extra cheese", 450.0, "Pizza", true, 12, "🍕", "r2", false, true),
                new MenuItem("m7", "Veggie Supreme", "Loaded with fresh vegetables", 420.0, "Pizza", true, 15, "🍕", "r2", true, false),
                new MenuItem("m8", "Chicken Tikka Pizza", "Tandoori chicken chunks and onions", 480.0, "Pizza", true, 10, "🍕", "r2", false, false),
                
                new MenuItem("m9", "Veg Hakka Noodles", "Stir-fried soy noodles", 220.0, "Noodles", true, 20, "🍜", "r3", true, true),
                new MenuItem("m10", "Chicken Manchurian", "Crispy chicken in tangy sauce", 260.0, "Chinese", true, 15, "🍗", "r3", false, true),
                new MenuItem("m11", "Paneer Chilli", "Cottage cheese in spicy soy sauce", 240.0, "Chinese", true, 18, "🧀", "r3", true, false),
                new MenuItem("m12", "Schezwan Chicken", "Spicy garlic chicken stir-fry", 290.0, "Chinese", true, 12, "🍗", "r3", false, false),
                
                new MenuItem("m13", "Garden Veggie Burger", "Grilled vegetable patty with cheese", 190.0, "Burgers", true, 30, "🍔", "r4", true, true),
                new MenuItem("m14", "Classic Smash Burger", "Double smashed patty with cheese", 250.0, "Burgers", true, 30, "🍔", "r4", false, true),
                new MenuItem("m15", "Peri Peri Fries", "Spicy seasoned crinkly fries", 120.0, "Sides", true, 50, "🍟", "r4", true, false),
                new MenuItem("m16", "Chicken Nuggets (6pcs)", "Golden fried crispy bites", 180.0, "Starters", true, 40, "🍗", "r4", false, false),
                
                new MenuItem("m17", "Veg California Roll", "Cucumber and avocado maki", 350.0, "Rolls", true, 15, "🍣", "r5", true, true),
                new MenuItem("m18", "Salmon Nigiri", "Fresh salmon over rice", 420.0, "Nigiri", true, 10, "🍣", "r5", false, true),
                new MenuItem("m19", "Tempura Veg Sushi", "Crispy tempura vegetables", 380.0, "Nigiri", true, 12, "🍣", "r5", true, false),
                new MenuItem("m20", "Prawn Tempura Roll", "Crispy prawn with spicy mayo", 550.0, "Rolls", true, 8, "🍣", "r5", false, false),
                
                // DELHI (r6-r10)
                new MenuItem("m21", "Dal Makhani", "Creamy black lentils - Delhi style", 250.0, "Main Course", true, 30, "🍲", "r6", true, true),
                new MenuItem("m22", "Butter Chicken Deluxe", "Delhi's legendary rich curry", 380.0, "Main Course", true, 25, "🍗", "r6", false, true),
                new MenuItem("m23", "Paneer Tikka Platter", "Grilled cottage cheese cubes", 290.0, "Starters", true, 20, "🧀", "r6", true, false),
                new MenuItem("m24", "Mutton Roganjosh", "Slow cooked spicy lamb", 450.0, "Non-Veg", true, 15, "🍗", "r6", false, false),
                
                new MenuItem("m25", "Veg Tacos (3pcs)", "Soft shells with beans and corn", 220.0, "Tacos", true, 25, "🌮", "r7", true, true),
                new MenuItem("m26", "Chicken Burrito", "Large tortilla with grilled chicken", 280.0, "Mexican", true, 20, "🌯", "r7", false, true),
                new MenuItem("m27", "Cheese Quesadilla", "Melted cheese in flour tortillas", 240.0, "Sides", true, 20, "🫓", "r7", true, false),
                new MenuItem("m28", "Beef Nachos", "Crispy chips with minced meat and cheese", 320.0, "Mexican", true, 15, "🌮", "r7", false, false),
                
                new MenuItem("m29", "Paneer Tikka Masala", "Grilled paneer in spicy gravy", 350.0, "Main Course", true, 20, "🧀", "r8", true, true),
                new MenuItem("m30", "Mutton Seekh Kabab", "Minced mutton skewers", 420.0, "Starters", true, 15, "🍢", "r8", false, true),
                new MenuItem("m31", "Veg Kabab Platter", "Assorted vegetarian kababs", 380.0, "Starters", true, 12, "🍘", "r8", true, false),
                new MenuItem("m32", "Chicken Malai Tikka", "Creamy grilled chicken chunks", 390.0, "Starters", true, 18, "🍢", "r8", false, false),
                
                new MenuItem("m33", "Aloo Pyaaz Paratha", "Crispy tandoori paratha", 110.0, "Main", true, 50, "🥞", "r9", true, true),
                new MenuItem("m34", "Chicken Keema Paratha", "Spicy minced chicken stuffing", 160.0, "Main", true, 30, "🥞", "r9", false, true),
                new MenuItem("m35", "Paneer Paratha", "Fresh paneer stuffed flatbread", 140.0, "Main", true, 40, "🥞", "r9", true, false),
                new MenuItem("m36", "Egg Paratha", "Classic egg stuffed paratha", 130.0, "Main", true, 45, "🥞", "r9", false, false),
                
                new MenuItem("m37", "Kashmiri Dum Aloo", "Baby potatoes in yogurt gravy", 320.0, "Main", true, 15, "🥔", "r10", true, true),
                new MenuItem("m38", "Mutton Rogan Josh", "Authentic Kashmiri lamb curry", 480.0, "Main", true, 12, "🍗", "r10", false, true),
                new MenuItem("m39", "Veg Pulao Kashmiri", "Saffron rice with dry fruits", 280.0, "Rice", true, 20, "🍚", "r10", true, false),
                new MenuItem("m40", "Chicken Yakhni", "Mild chicken curry in yogurt base", 410.0, "Main", true, 10, "🍗", "r10", false, false),
                
                // BANGALORE (r11-r15)
                new MenuItem("m41", "Ghee Podi Idli", "Soft idlis with gunpowder and ghee", 120.0, "Breakfast", true, 80, "⚪", "r11", true, true),
                new MenuItem("m42", "Chicken Keema Dosa", "Crispy dosa with chicken stuffing", 220.0, "South Indian", true, 40, "🥞", "r11", false, true),
                new MenuItem("m43", "Benne Masala Dosa", "Butter laden masala dosa", 140.0, "Breakfast", true, 70, "🥞", "r11", true, false),
                new MenuItem("m44", "Mutton Brain Fry", "Spicy Bangalore style specialty", 350.0, "Legendary", true, 15, "🧠", "r11", false, false),
                
                new MenuItem("m45", "Pasta Alfredo", "Creamy white sauce with veggies", 320.0, "Pasta", true, 25, "🍝", "r12", true, true),
                new MenuItem("m46", "Grilled Chicken Steak", "Mushroom sauce and mash", 550.0, "Continental", true, 15, "🥩", "r12", false, true),
                new MenuItem("m47", "Veg Lasagna", "Layered pasta with cheese and sauce", 380.0, "Pasta", true, 20, "🥘", "r12", true, false),
                new MenuItem("m48", "Pork Chops", "Honey glazed with roasted veggies", 620.0, "Continental", true, 10, "🥩", "r12", false, false),
                
                new MenuItem("m49", "Veg Club Sandwich", "Triple decker veggie delight", 180.0, "Snacks", true, 40, "🥪", "r13", true, true),
                new MenuItem("m50", "Fish and Chips", "Classic batter fried fish", 380.0, "Main", true, 20, "🐟", "r13", false, true),
                new MenuItem("m51", "Cold Coffee with Ice Cream", "Signature brew", 150.0, "Drinks", true, 60, "🧋", "r13", true, false),
                new MenuItem("m52", "Chicken Roast Sandwich", "Juicy roasted chicken slices", 220.0, "Snacks", true, 30, "🥪", "r13", false, false),
                
                new MenuItem("m53", "Cheesy Potato Wedges", "Crispy wedges with jalapeno dip", 220.0, "Sides", true, 40, "🥔", "r14", true, true),
                new MenuItem("m54", "BBQ Chicken Pizza", "Smoky chicken and red onions", 480.0, "Pizza", true, 15, "🍕", "r14", false, true),
                new MenuItem("m55", "Four Cheese Pizza", "Mozzarella, Cheddar, Parmesan", 450.0, "Pizza", true, 30, "🍕", "r14", true, false),
                new MenuItem("m56", "Pepperoni Special", "Double pepperoni pizza", 520.0, "Pizza", true, 10, "🍕", "r14", false, false),
                
                new MenuItem("m57", "Rava Idli", "Steamed semolina cakes", 90.0, "Breakfast", true, 100, "⚪", "r15", true, true),
                new MenuItem("m58", "MTR Special Thali (Non-Veg)", "Full meal with chicken and egg", 380.0, "Meals", true, 30, "🍱", "r15", false, true),
                new MenuItem("m59", "Bisi Bele Bath", "Spicy lentil rice bowl", 120.0, "Main", true, 60, "🍚", "r15", true, false),
                new MenuItem("m60", "Chicken Curry", "Homestyle South Indian curry", 250.0, "Main", true, 40, "🍗", "r15", false, false),
                
                // HYDERABAD (r16-r20)
                new MenuItem("m61", "Veg Dum Biryani", "Hyderabad's famous veg rice", 280.0, "Biryani", true, 50, "🍚", "r16", true, true),
                new MenuItem("m62", "Chicken Dum Biryani", "Authentic Paradise biryani", 350.0, "Biryani", true, 100, "🍚", "r16", false, true),
                new MenuItem("m63", "Double Ka Meetha", "Bread pudding dessert", 120.0, "Desserts", true, 40, "🍞", "r16", true, false),
                new MenuItem("m64", "Mutton Haleem", "Grounded mutton stew", 450.0, "Special", true, 30, "🍲", "r16", false, false),
                
                new MenuItem("m65", "Paneer 65 Biryani", "Spicy paneer chunk biryani", 320.0, "Biryani", true, 40, "🍚", "r17", true, true),
                new MenuItem("m66", "Special Mutton Biryani", "Shah Ghouse signature", 480.0, "Biryani", true, 60, "🍚", "r17", false, true),
                new MenuItem("m67", "Veg Manchurian", "Indo-Chinese veg balls", 210.0, "Chinese", true, 30, "🥟", "r17", true, false),
                new MenuItem("m68", "Chicken 65", "Spicy fried chicken chunks", 280.0, "Starters", true, 40, "🍗", "r17", false, false),
                
                new MenuItem("m69", "MLA Pesarattu", "Moong dal crepe", 180.0, "Breakfast", true, 50, "🥞", "r18", true, true),
                new MenuItem("m70", "Chicken Masala Dosa", "Meat stuffed spicy dosa", 240.0, "Breakfast", true, 30, "🥞", "r18", false, true),
                new MenuItem("m71", "Guntur Idli", "Chilli powder coated idlis", 130.0, "Breakfast", true, 60, "⚪", "r18", true, false),
                new MenuItem("m72", "Prawns Fry", "Spicy coastal Andhra specialty", 380.0, "Non-Veg", true, 20, "🍤", "r18", false, false),
                
                new MenuItem("m73", "Veg Fried Rice", "Wok tossed garden rice", 190.0, "Rice", true, 40, "🍚", "r19", true, true),
                new MenuItem("m74", "Chicken Manchurian Gravy", "Spicy chicken dumplings", 280.0, "Main", true, 30, "🍗", "r19", false, true),
                new MenuItem("m75", "Honey Chilli Potato", "Crispy sweet and spicy", 180.0, "Starters", true, 40, "🍟", "r19", true, false),
                new MenuItem("m76", "Dragon Chicken", "Spicy stir fried chicken", 310.0, "Starters", true, 25, "🍗", "r19", false, false),
                
                new MenuItem("m77", "Quinoa Salad", "Healthy organic grain bowl", 380.0, "Salads", true, 20, "🥗", "r20", true, true),
                new MenuItem("m78", "Grilled Salmon Platter", "Fresh fish with lemon butter", 650.0, "Main", true, 10, "🍣", "r20", false, true),
                new MenuItem("m79", "Wild Mushroom Risotto", "Italian style creamy rice", 450.0, "Main", true, 15, "🍚", "r20", true, false),
                new MenuItem("m80", "Lamb Chops (Fusion)", "Grilled with reduction sauce", 720.0, "Main", true, 8, "🥩", "r20", false, false),
                
                // PUNE (r21-r25)
                new MenuItem("m81", "Cheese Masala Dosa", "Pune's favorite street dosa", 130.0, "Breakfast", true, 100, "🥞", "r21", true, true),
                new MenuItem("m82", "Chicken Cheese Dosa", "Meat and cheese fusion dosa", 220.0, "Breakfast", true, 40, "🥞", "r21", false, true),
                new MenuItem("m83", "Sambar Vada", "Lentil fritters in spicy soup", 90.0, "Breakfast", true, 80, "⚪", "r21", true, false),
                new MenuItem("m84", "Egg Fried Dosa", "Crispy dosa with fried eggs", 160.0, "Breakfast", true, 30, "🥞", "r21", false, false),
                
                new MenuItem("m85", "Veg Cheese Sandwich", "Signature grill sandwich", 140.0, "Snacks", true, 120, "🥪", "r22", true, true),
                new MenuItem("m86", "Chicken Mayo Sandwich", "Classic cold chicken signature", 180.0, "Snacks", true, 80, "🥪", "r22", false, true),
                new MenuItem("m87", "Bun Maska", "Butter loaded soft bun", 60.0, "Breakfast", true, 200, "🥯", "r22", true, false),
                new MenuItem("m88", "Chicken Burger Sandwich", "Patty with coleslaw", 190.0, "Snacks", true, 40, "🥪", "r22", false, false),
                
                new MenuItem("m89", "Eggless Apple Pie", "Fresh baked crumble", 250.0, "Desserts", true, 25, "🥧", "r23", true, true),
                new MenuItem("m90", "Chicken Quiche", "Savoury chicken pastry", 220.0, "Bakery", true, 20, "🥧", "r23", false, true),
                new MenuItem("m91", "Chocolate Brownie", "Rich and fudgy", 120.0, "Desserts", true, 40, "🍫", "r23", true, false),
                new MenuItem("m92", "Cheese & Meat Croissant", "Buttery pastry with ham", 180.0, "Bakery", true, 15, "🥐", "r23", false, false),
                
                new MenuItem("m93", "Veg Pulao (Paneer)", "Persian style paneer rice", 240.0, "Rice", true, 35, "🍚", "r24", true, true),
                new MenuItem("m94", "Mutton Chelo Kabab", "Classic Iranian non-veg", 550.0, "Legendary", true, 20, "🍢", "r24", false, true),
                new MenuItem("m95", "Zereshk Pulao (Veg)", "Rice with sour barberries", 280.0, "Rice", true, 25, "🍚", "r24", true, false),
                new MenuItem("m96", "Chicken Jujeh Kabab", "Saffron marinated chicken", 420.0, "Starters", true, 15, "🍢", "r24", false, false),
                
                new MenuItem("m97", "Puran Poli", "Maharashtrian sweet bread", 80.0, "Desserts", true, 50, "🥞", "r25", true, true),
                new MenuItem("m98", "Kolhapuri Chicken Thali", "Spicy authentic non-veg meal", 420.0, "Meals", true, 30, "🍱", "r25", false, true),
                new MenuItem("m99", "Maharashtrian Thali (Veg)", "Authentic local flavors", 350.0, "Meals", true, 40, "🍱", "r25", true, false),
                new MenuItem("m100", "Mutton Sukka", "Dry spicy mutton fry", 450.0, "Main", true, 20, "🍗", "r25", false, false)
            ));
        }
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable String id) {
        return repo.findById(id).orElse(null);
    }

    @GetMapping("/{id}/menu")
    public List<MenuItem> getMenu(@PathVariable String id) {
        return menuRepo.findByRestaurantId(id);
    }

    // ─── Restaurant CRUD ───

    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        if (restaurant.getId() == null || restaurant.getId().isEmpty()) {
            restaurant.setId("r" + (repo.count() + 1));
        }
        return repo.save(restaurant);
    }

    @PutMapping("/{id}")
    public Restaurant updateRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        Restaurant existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Restaurant not found"));
        if (restaurant.getName() != null) existing.setName(restaurant.getName());
        if (restaurant.getCuisine() != null) existing.setCuisine(restaurant.getCuisine());
        if (restaurant.getRating() > 0) existing.setRating(restaurant.getRating());
        if (restaurant.getCity() != null) existing.setCity(restaurant.getCity());
        if (restaurant.getAddress() != null) existing.setAddress(restaurant.getAddress());
        if (restaurant.getDeliveryTime() != null) existing.setDeliveryTime(restaurant.getDeliveryTime());
        if (restaurant.getDeliveryFee() >= 0) existing.setDeliveryFee(restaurant.getDeliveryFee());
        if (restaurant.getImage() != null) existing.setImage(restaurant.getImage());
        existing.setFeatured(restaurant.isFeatured());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        repo.deleteById(id);
        // Also delete menu items
        List<MenuItem> items = menuRepo.findByRestaurantId(id);
        menuRepo.deleteAll(items);
    }

    // ─── Menu Item CRUD ───

    @PostMapping("/{id}/menu")
    public MenuItem createMenuItem(@PathVariable String id, @RequestBody MenuItem item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId("m" + (menuRepo.count() + 1));
        }
        item.setRestaurantId(id);
        return menuRepo.save(item);
    }

    @PutMapping("/{id}/menu/{itemId}")
    public MenuItem updateMenuItem(@PathVariable String id, @PathVariable String itemId, @RequestBody MenuItem item) {
        MenuItem existing = menuRepo.findById(itemId).orElseThrow(() -> new RuntimeException("Menu item not found"));
        if (item.getName() != null) existing.setName(item.getName());
        if (item.getDescription() != null) existing.setDescription(item.getDescription());
        if (item.getPrice() > 0) existing.setPrice(item.getPrice());
        if (item.getCategory() != null) existing.setCategory(item.getCategory());
        if (item.getImage() != null) existing.setImage(item.getImage());
        existing.setInStock(item.isInStock());
        existing.setStockCount(item.getStockCount());
        return menuRepo.save(existing);
    }

    @PutMapping("/{id}/menu/{itemId}/stock")
    public MenuItem updateStock(@PathVariable String id, @PathVariable String itemId, @RequestBody java.util.Map<String, Integer> payload) {
        MenuItem existing = menuRepo.findById(itemId).orElseThrow(() -> new RuntimeException("Menu item not found"));
        int stock = payload.get("stockCount");
        existing.setStockCount(stock);
        existing.setInStock(stock > 0);
        return menuRepo.save(existing);
    }

    @DeleteMapping("/{id}/menu/{itemId}")
    public void deleteMenuItem(@PathVariable String id, @PathVariable String itemId) {
        menuRepo.deleteById(itemId);
    }
}
