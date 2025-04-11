package com.ecommerce.config;

import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        createSampleUsers();
        
        // Create sample products
        createSampleProducts();
        
        // Create sample orders
        createSampleOrders();
    }

    private void createSampleUsers() {
        // Business Admin accounts
        if (!userRepository.existsByUsername("businessadmin")) {
            User businessAdmin = new User();
            businessAdmin.setUsername("businessadmin");
            businessAdmin.setPassword(passwordEncoder.encode("admin123"));
            businessAdmin.setEmail("businessadmin@example.com");
            businessAdmin.setFullName("Business Admin");
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.BUSINESS_ADMIN);
            businessAdmin.setRoles(roles);
            
            userRepository.save(businessAdmin);
            System.out.println("Business Admin account created");
        }

        // Additional business admins
        createUserIfNotExists("businessadmin2", "admin123", "businessadmin2@example.com", 
                "John Business", Set.of(Role.BUSINESS_ADMIN));
        
        // Admin accounts
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setFullName("Admin User");
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ADMIN);
            admin.setRoles(roles);
            
            userRepository.save(admin);
            System.out.println("Admin account created");
        }
        
        // Additional admins
        createUserIfNotExists("fashionadmin", "admin123", "fashion@example.com", 
                "Fashion Admin", Set.of(Role.ADMIN));
        createUserIfNotExists("electronicsadmin", "admin123", "electronics@example.com", 
                "Electronics Admin", Set.of(Role.ADMIN));

        // Regular user accounts
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@example.com");
            user.setFullName("Regular User");
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.USER);
            user.setRoles(roles);
            
            userRepository.save(user);
            System.out.println("User account created");
        }
        
        // Additional users
        createUserIfNotExists("john", "password", "john@example.com", 
                "John Doe", Set.of(Role.USER));
        createUserIfNotExists("jane", "password", "jane@example.com", 
                "Jane Smith", Set.of(Role.USER));
        createUserIfNotExists("robert", "password", "robert@example.com", 
                "Robert Johnson", Set.of(Role.USER));
        createUserIfNotExists("susan", "password", "susan@example.com", 
                "Susan Williams", Set.of(Role.USER));
    }
    
    private void createUserIfNotExists(String username, String password, String email, String fullName, Set<Role> roles) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.setFullName(fullName);
            user.setRoles(roles);
            
            userRepository.save(user);
            System.out.println("User account created: " + username);
        }
    }
    
    private void createSampleProducts() {
        // Only create sample products if the collection is empty
        if (productRepository.count() == 0) {
            // Electronics products
            createProduct("Smartphone X", "Latest smartphone with advanced features", 
                    new BigDecimal("799.99"), 50, List.of("electronics", "mobiles"),
                    List.of("https://example.com/phone.jpg"), "electronicsadmin");
            
            createProduct("Laptop Pro", "High-performance laptop for professionals", 
                    new BigDecimal("1299.99"), 25, List.of("electronics", "computers"),
                    List.of("https://example.com/laptop.jpg"), "electronicsadmin");
            
            createProduct("Wireless Headphones", "Noise-cancelling wireless headphones", 
                    new BigDecimal("199.99"), 100, List.of("electronics", "accessories"),
                    List.of("https://example.com/headphones.jpg"), "electronicsadmin");
            
            createProduct("Smart TV 55\"", "4K Ultra HD Smart TV with voice control", 
                    new BigDecimal("699.99"), 20, List.of("electronics", "appliances"),
                    List.of("https://example.com/tv.jpg"), "electronicsadmin");
            
            createProduct("Digital Camera", "Professional DSLR camera with accessories", 
                    new BigDecimal("899.99"), 15, List.of("electronics", "cameras"),
                    List.of("https://example.com/camera.jpg"), "electronicsadmin");
            
            // Fashion products
            createProduct("Men's Casual Shirt", "Comfortable cotton shirt for men", 
                    new BigDecimal("49.99"), 100, List.of("fashion", "mens-fashion"),
                    List.of("https://example.com/mens-shirt.jpg"), "fashionadmin");
            
            createProduct("Women's Summer Dress", "Elegant summer dress for women", 
                    new BigDecimal("79.99"), 75, List.of("fashion", "womens-fashion"),
                    List.of("https://example.com/womens-dress.jpg"), "fashionadmin");
            
            createProduct("Running Shoes", "Lightweight running shoes for athletes", 
                    new BigDecimal("89.99"), 60, List.of("fashion", "footwear"),
                    List.of("https://example.com/shoes.jpg"), "fashionadmin");
            
            createProduct("Leather Wallet", "Genuine leather wallet with multiple card slots", 
                    new BigDecimal("39.99"), 150, List.of("fashion", "accessories"),
                    List.of("https://example.com/wallet.jpg"), "fashionadmin");
            
            createProduct("Sunglasses", "UV protection sunglasses with stylish frame", 
                    new BigDecimal("59.99"), 80, List.of("fashion", "accessories"),
                    List.of("https://example.com/sunglasses.jpg"), "fashionadmin");
            
            // Home appliances
            createProduct("Coffee Maker", "Programmable coffee maker with thermal carafe", 
                    new BigDecimal("129.99"), 30, List.of("appliances", "kitchen"),
                    List.of("https://example.com/coffee-maker.jpg"), "admin");
            
            createProduct("Microwave Oven", "Countertop microwave oven with multiple settings", 
                    new BigDecimal("149.99"), 25, List.of("appliances", "kitchen"),
                    List.of("https://example.com/microwave.jpg"), "admin");
            
            // Provisions
            createProduct("Organic Coffee Beans", "Premium organic coffee beans, 1kg", 
                    new BigDecimal("24.99"), 100, List.of("provisions", "groceries"),
                    List.of("https://example.com/coffee.jpg"), "admin");
            
            createProduct("Assorted Chocolate Box", "Luxury chocolate assortment, 500g", 
                    new BigDecimal("29.99"), 50, List.of("provisions", "confectionery"),
                    List.of("https://example.com/chocolate.jpg"), "admin");
            
            System.out.println("Sample products created");
        }
    }
    
    private void createProduct(String name, String description, BigDecimal price, int stockQuantity, 
                              List<String> categories, List<String> imageUrls, String addedByUsername) {
        Optional<User> userOpt = userRepository.findByUsername(addedByUsername);
        if (userOpt.isPresent()) {
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStockQuantity(stockQuantity);
            product.setCategories(categories);
            product.setImageUrls(imageUrls);
            product.setAddedByUserId(userOpt.get().getId());
            product.setCreatedAt(new Date());
            product.setUpdatedAt(new Date());
            product.setActive(true);
            
            productRepository.save(product);
        }
    }
    
    private void createSampleOrders() {
        // Only create sample orders if the collection is empty
        if (orderRepository.count() == 0) {
            // Get users and products
            Optional<User> john = userRepository.findByUsername("john");
            Optional<User> jane = userRepository.findByUsername("jane");
            Optional<User> robert = userRepository.findByUsername("robert");
            
            List<Product> allProducts = productRepository.findAll();
            
            if (!allProducts.isEmpty() && john.isPresent() && jane.isPresent() && robert.isPresent()) {
                // Create orders for John
                createOrderForUser(john.get(), 
                        Arrays.asList(allProducts.get(0), allProducts.get(5)),
                        Arrays.asList(1, 2),
                        "123 Main St, Anytown, USA",
                        Order.OrderStatus.DELIVERED);
                
                createOrderForUser(john.get(), 
                        Arrays.asList(allProducts.get(2), allProducts.get(8)),
                        Arrays.asList(1, 1),
                        "123 Main St, Anytown, USA",
                        Order.OrderStatus.PROCESSING);
                
                // Create orders for Jane
                createOrderForUser(jane.get(), 
                        Arrays.asList(allProducts.get(1), allProducts.get(6), allProducts.get(12)),
                        Arrays.asList(1, 1, 2),
                        "456 Oak St, Somewhere, USA",
                        Order.OrderStatus.SHIPPED);
                
                // Create order for Robert
                createOrderForUser(robert.get(), 
                        Arrays.asList(allProducts.get(4), allProducts.get(9)),
                        Arrays.asList(1, 3),
                        "789 Pine St, Nowhere, USA",
                        Order.OrderStatus.PENDING);
                
                System.out.println("Sample orders created");
            }
        }
    }
    
    private void createOrderForUser(User user, List<Product> products, List<Integer> quantities,
                                   String shippingAddress, Order.OrderStatus status) {
        Order order = new Order();
        order.setUserId(user.getId());
        
        List<Order.OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            int quantity = quantities.get(i);
            
            Order.OrderItem item = new Order.OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setQuantity(quantity);
            item.setPrice(product.getPrice());
            
            orderItems.add(item);
            
            // Calculate total amount
            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(quantity));
            totalAmount = totalAmount.add(itemTotal);
        }
        
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(shippingAddress);
        order.setStatus(status);
        order.setOrderDate(new Date());
        order.setUpdatedAt(new Date());
        
        // Sample payment info
        Order.PaymentInfo paymentInfo = new Order.PaymentInfo();
        paymentInfo.setPaymentMethod("Credit Card");
        paymentInfo.setTransactionId(UUID.randomUUID().toString());
        paymentInfo.setPaid(true);
        
        order.setPaymentInfo(paymentInfo);
        
        orderRepository.save(order);
    }
} 