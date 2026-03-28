package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.repo.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class OrderController {

    @Autowired
    private OrderRepository repo;

    @GetMapping
    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        // Fix: Use the standard save() method instead of saveOrder()
        if (order.getStatus() == null) {
            order.setStatus("Pending Payment");
        }
        return repo.save(order);
    }
    
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        Order order = repo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(payload.get("status"));
        return repo.save(order);
    }

    @PutMapping("/{id}/assign")
    public Order assignOrder(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        Order order = repo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        String agentId = payload.get("agentId");
        String agentName = payload.get("agentName");
        String agentPhone = payload.get("agentPhone");
        
        order.setAgentId(agentId);
        order.setAgentName(agentName);
        order.setAgentPhone(agentPhone);
        order.setStatus("Confirmed"); // Change status to Confirmed upon assignment
        return repo.save(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
