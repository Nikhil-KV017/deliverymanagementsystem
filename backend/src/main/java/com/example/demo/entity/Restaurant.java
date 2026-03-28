package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ElementCollection;
import java.util.List;

@Entity
public class Restaurant {
    @Id
    private String id;
    private String name;
    
    @ElementCollection
    private List<String> cuisine;
    
    private Double rating;
    private String city;
    private String address;
    private String deliveryTime;
    private Integer deliveryFee;
    private String image;
    private boolean featured;

    // Default constructor
    public Restaurant() {}

    // All-args constructor
    public Restaurant(String id, String name, List<String> cuisine, Double rating, String city, String address, String deliveryTime, Integer deliveryFee, String image, boolean featured) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.rating = rating;
        this.city = city;
        this.address = address;
        this.deliveryTime = deliveryTime;
        this.deliveryFee = deliveryFee;
        this.image = image;
        this.featured = featured;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getCuisine() { return cuisine; }
    public void setCuisine(List<String> cuisine) { this.cuisine = cuisine; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getDeliveryTime() { return deliveryTime; }
    public void setDeliveryTime(String deliveryTime) { this.deliveryTime = deliveryTime; }
    public Integer getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(Integer deliveryFee) { this.deliveryFee = deliveryFee; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
