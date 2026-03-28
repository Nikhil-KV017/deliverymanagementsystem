package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class MenuItem {
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private boolean inStock;
    private Integer stockCount;
    private String image;
    private String restaurantId;
    private boolean veg;
    private boolean bestseller;

    // Default constructor
    public MenuItem() {}

    // All-args constructor
    public MenuItem(String id, String name, String description, Double price, String category, boolean inStock, Integer stockCount, String image, String restaurantId, boolean veg, boolean bestseller) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.inStock = inStock;
        this.stockCount = stockCount;
        this.image = image;
        this.restaurantId = restaurantId;
        this.veg = veg;
        this.bestseller = bestseller;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }
    public Integer getStockCount() { return stockCount; }
    public void setStockCount(Integer stockCount) { this.stockCount = stockCount; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }
    public boolean isVeg() { return veg; }
    public void setVeg(boolean veg) { this.veg = veg; }
    public boolean isBestseller() { return bestseller; }
    public void setBestseller(boolean bestseller) { this.bestseller = bestseller; }
}
