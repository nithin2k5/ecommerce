package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;
    
    // Create a new order
    public Order createOrder(Order order) {
        // Validate order items and update product stock
        List<Product> products = order.getProducts();
        List<Integer> quantities = order.getQuantities();
        
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            int quantity = quantities.get(i);
            
            // Check if enough stock is available
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
            
            // Update product stock
            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.save(product);
        }
        
        return orderRepository.save(order);
    }
    
    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    // Get order by ID
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }
    
    // Get orders by user ID
    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }
    
    // Get orders by username
    public List<Order> getOrdersByUserId(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            return orderRepository.findByUserId(userOpt.get().getId());
        }
        return List.of();
    }
    
    // Update order status
    public Order updateOrderStatus(String id, Order.OrderStatus status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            return orderRepository.save(order);
        }
        
        return null;
    }
    
    // Cancel order
    public Order cancelOrder(String id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            
            // Only allow cancellation if order is still pending or processing
            if (order.getStatus() == Order.OrderStatus.PENDING || 
                order.getStatus() == Order.OrderStatus.PROCESSING) {
                
                // Restore product stock
                List<Product> products = order.getProducts();
                List<Integer> quantities = order.getQuantities();
                
                for (int i = 0; i < products.size(); i++) {
                    Product product = products.get(i);
                    int quantity = quantities.get(i);
                    
                    product.setStockQuantity(product.getStockQuantity() + quantity);
                    productRepository.save(product);
                }
                
                order.setStatus(Order.OrderStatus.CANCELLED);
                return orderRepository.save(order);
            } else {
                throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
            }
        }
        
        return null;
    }
} 