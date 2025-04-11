package com.ecommerce.config;

import com.ecommerce.model.*;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Indexes;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;

@Component
public class MongoDataInitializer implements CommandLineRunner {

    @Autowired
    private MongoClient mongoClient;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        MongoDatabase database = mongoClient.getDatabase("ecommerce_db");
        
        // Create collections if they don't exist
        createCollections(database);
        
        // Create indexes
        createIndexes(database);
        
        // Insert sample data
        insertSampleData(database);
    }

    private void createCollections(MongoDatabase database) {
        try {
            database.createCollection("users");
            database.createCollection("products");
            database.createCollection("orders");
            database.createCollection("categories");
            System.out.println("Collections created successfully");
        } catch (Exception e) {
            System.out.println("Collections already exist");
        }
    }

    private void createIndexes(MongoDatabase database) {
        // Users collection indexes
        database.getCollection("users")
                .createIndex(Indexes.ascending("username"));
        database.getCollection("users")
                .createIndex(Indexes.ascending("email"));

        // Products collection indexes
        database.getCollection("products")
                .createIndex(Indexes.ascending("name"));
        database.getCollection("products")
                .createIndex(Indexes.ascending("categories"));

        // Orders collection indexes
        database.getCollection("orders")
                .createIndex(Indexes.ascending("userId"));
        database.getCollection("orders")
                .createIndex(Indexes.ascending("status"));
    }

    private void insertSampleData(MongoDatabase database) {
        insertSampleUsers(database.getCollection("users"));
        insertSampleProducts(database.getCollection("products"));
        insertSampleCategories(database.getCollection("categories"));
    }

    private void insertSampleUsers(MongoCollection<Document> users) {
        // Clear existing users
        users.drop();

        // Business Admin
        Document businessAdmin = new Document()
                .append("username", "businessadmin")
                .append("password", passwordEncoder.encode("admin123"))
                .append("email", "businessadmin@example.com")
                .append("fullName", "Business Administrator")
                .append("roles", Arrays.asList("BUSINESS_ADMIN"))
                .append("active", true)
                .append("createdAt", new Date());
        users.insertOne(businessAdmin);

        // Regular Admin
        Document admin = new Document()
                .append("username", "admin")
                .append("password", passwordEncoder.encode("admin123"))
                .append("email", "admin@example.com")
                .append("fullName", "Regular Administrator")
                .append("roles", Arrays.asList("ADMIN"))
                .append("active", true)
                .append("createdAt", new Date());
        users.insertOne(admin);

        // Regular User
        Document user = new Document()
                .append("username", "user")
                .append("password", passwordEncoder.encode("user123"))
                .append("email", "user@example.com")
                .append("fullName", "Regular User")
                .append("roles", Arrays.asList("USER"))
                .append("active", true)
                .append("createdAt", new Date());
        users.insertOne(user);

        System.out.println("Sample users created successfully");
    }

    private void insertSampleProducts(MongoCollection<Document> products) {
        // Clear existing products
        products.drop();

        // Electronics
        Document smartphone = new Document()
                .append("name", "iPhone 13 Pro")
                .append("description", "Latest Apple smartphone with advanced features")
                .append("price", 999.99)
                .append("stockQuantity", 50)
                .append("categories", Arrays.asList("electronics", "mobiles"))
                .append("imageUrl", "https://example.com/iphone13.jpg")
                .append("active", true)
                .append("createdAt", new Date());
        products.insertOne(smartphone);

        Document laptop = new Document()
                .append("name", "MacBook Pro 2023")
                .append("description", "Powerful laptop for professionals")
                .append("price", 1299.99)
                .append("stockQuantity", 30)
                .append("categories", Arrays.asList("electronics", "computers"))
                .append("imageUrl", "https://example.com/macbook.jpg")
                .append("active", true)
                .append("createdAt", new Date());
        products.insertOne(laptop);

        // Fashion
        Document shirt = new Document()
                .append("name", "Men's Casual Shirt")
                .append("description", "Comfortable cotton shirt")
                .append("price", 49.99)
                .append("stockQuantity", 100)
                .append("categories", Arrays.asList("fashion", "men"))
                .append("imageUrl", "https://example.com/shirt.jpg")
                .append("active", true)
                .append("createdAt", new Date());
        products.insertOne(shirt);

        Document dress = new Document()
                .append("name", "Women's Summer Dress")
                .append("description", "Elegant summer dress")
                .append("price", 79.99)
                .append("stockQuantity", 75)
                .append("categories", Arrays.asList("fashion", "women"))
                .append("imageUrl", "https://example.com/dress.jpg")
                .append("active", true)
                .append("createdAt", new Date());
        products.insertOne(dress);

        System.out.println("Sample products created successfully");
    }

    private void insertSampleCategories(MongoCollection<Document> categories) {
        // Clear existing categories
        categories.drop();

        // Main categories
        Document electronics = new Document()
                .append("name", "Electronics")
                .append("slug", "electronics")
                .append("description", "Electronic devices and accessories")
                .append("active", true);
        categories.insertOne(electronics);

        Document fashion = new Document()
                .append("name", "Fashion")
                .append("slug", "fashion")
                .append("description", "Clothing and accessories")
                .append("active", true);
        categories.insertOne(fashion);

        Document mobiles = new Document()
                .append("name", "Mobiles")
                .append("slug", "mobiles")
                .append("description", "Smartphones and accessories")
                .append("parentCategory", "electronics")
                .append("active", true);
        categories.insertOne(mobiles);

        Document computers = new Document()
                .append("name", "Computers")
                .append("slug", "computers")
                .append("description", "Laptops and desktops")
                .append("parentCategory", "electronics")
                .append("active", true);
        categories.insertOne(computers);

        System.out.println("Sample categories created successfully");
    }
} 