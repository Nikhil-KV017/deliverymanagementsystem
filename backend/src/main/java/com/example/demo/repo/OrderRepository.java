package com.example.demo.repo;

import com.example.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // The error was caused by a method named 'saveOrder'
    // Standard JpaRepository already includes 'save()' which should be used instead.
    // If you need a custom name, you can't just declare it here without @Query
    // or follows the naming convention (which saveOrder doesn't).
}
