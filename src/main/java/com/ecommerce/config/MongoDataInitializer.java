package com.ecommerce.config;

import com.ecommerce.model.*;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Indexes;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.CreateCollectionOptions;
import com.mongodb.client.model.ValidationOptions;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
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
        
        // Create collections with schema validation
        createCollectionsWithValidation(database);
        
        // Create indexes
        createIndexes(database);
        
        // Insert sample data
        insertSampleData(database);
    }

    private void createCollectionsWithValidation(MongoDatabase database) {
        // Users collection validation
        Document userSchema = new Document("$jsonSchema", new Document()
            .append("bsonType", "object")
            .append("required", Arrays.asList("username", "email", "password", "roles"))
            .append("properties", new Document()
                .append("username", new Document("bsonType", "string"))
                .append("email", new Document("bsonType", "string"))
                .append("password", new Document("bsonType", "string"))
                .append("roles", new Document("bsonType", "array"))
                .append("active", new Document("bsonType", "bool"))
            ));
        CreateCollectionOptions userOptions = new CreateCollectionOptions()
            .validationOptions(new ValidationOptions().validator(userSchema));

        // Products collection validation
        Document productSchema = new Document("$jsonSchema", new Document()
            .append("bsonType", "object")
            .append("required", Arrays.asList("name", "price", "stockQuantity", "categories"))
            .append("properties", new Document()
                .append("name", new Document("bsonType", "string"))
                .append("price", new Document("bsonType", "double"))
                .append("stockQuantity", new Document("bsonType", "int"))
                .append("categories", new Document("bsonType", "array"))
                .append("active", new Document("bsonType", "bool"))
            ));
        CreateCollectionOptions productOptions = new CreateCollectionOptions()
            .validationOptions(new ValidationOptions().validator(productSchema));

        // Orders collection validation
        Document orderSchema = new Document("$jsonSchema", new Document()
            .append("bsonType", "object")
            .append("required", Arrays.asList("userId", "products", "quantities", "total", "status"))
            .append("properties", new Document()
                .append("userId", new Document("bsonType", "string"))
                .append("products", new Document("bsonType", "array"))
                .append("quantities", new Document("bsonType", "array"))
                .append("total", new Document("bsonType", "double"))
                .append("status", new Document("bsonType", "string"))
            ));
        CreateCollectionOptions orderOptions = new CreateCollectionOptions()
            .validationOptions(new ValidationOptions().validator(orderSchema));

        try {
            database.createCollection("users", userOptions);
            database.createCollection("products", productOptions);
            database.createCollection("orders", orderOptions);
            database.createCollection("categories");
            database.createCollection("cart");
            database.createCollection("wishlist");
            database.createCollection("reviews");
            database.createCollection("transactions");
            System.out.println("Collections created successfully with validation");
        } catch (Exception e) {
            System.out.println("Collections already exist or error creating: " + e.getMessage());
        }
    }

    private void createIndexes(MongoDatabase database) {
        // Users collection indexes
        database.getCollection("users")
                .createIndex(Indexes.ascending("username"), new IndexOptions().unique(true));
        database.getCollection("users")
                .createIndex(Indexes.ascending("email"), new IndexOptions().unique(true));

        // Products collection indexes
        database.getCollection("products")
                .createIndex(Indexes.ascending("name"));
        database.getCollection("products")
                .createIndex(Indexes.ascending("categories"));
        database.getCollection("products")
                .createIndex(Indexes.ascending("slug"), new IndexOptions().unique(true));

        // Orders collection indexes
        database.getCollection("orders")
                .createIndex(Indexes.ascending("userId"));
        database.getCollection("orders")
                .createIndex(Indexes.ascending("status"));

        // Cart collection indexes
        database.getCollection("cart")
                .createIndex(Indexes.ascending("userId"));

        // Wishlist collection indexes
        database.getCollection("wishlist")
                .createIndex(Indexes.ascending("userId"));

        // Reviews collection indexes
        database.getCollection("reviews")
                .createIndex(Indexes.ascending("productId"));
        database.getCollection("reviews")
                .createIndex(Indexes.ascending("userId"));

        System.out.println("Indexes created successfully");
    }

    private void insertSampleData(MongoDatabase database) {
        insertSampleUsers(database.getCollection("users"));
        insertSampleProducts(database.getCollection("products"));
        insertSampleCategories(database.getCollection("categories"));
    }

    private void insertSampleUsers(MongoCollection<Document> users) {
        // Only insert if collection is empty
        if (users.countDocuments() == 0) {
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
    }

    private void insertSampleProducts(MongoCollection<Document> products) {
        // Only insert if collection is empty
        if (products.countDocuments() == 0) {
            // Electronics
            Document smartphone = new Document()
                    .append("name", "iPhone 13 Pro")
                    .append("slug", "iphone-13-pro")
                    .append("description", "Latest Apple smartphone with advanced features")
                    .append("price", 999.99)
                    .append("stockQuantity", 50)
                    .append("categories", Arrays.asList("electronics", "mobiles"))
                    .append("imageUrls", Arrays.asList("https://example.com/iphone13.jpg"))
                    .append("active", true)
                    .append("createdAt", new Date())
                    .append("updatedAt", new Date());
            products.insertOne(smartphone);

            Document laptop = new Document()
                    .append("name", "MacBook Pro 2023")
                    .append("slug", "macbook-pro-2023")
                    .append("description", "Powerful laptop for professionals")
                    .append("price", 1299.99)
                    .append("stockQuantity", 30)
                    .append("categories", Arrays.asList("electronics", "computers"))
                    .append("imageUrls", Arrays.asList("https://example.com/macbook.jpg"))
                    .append("active", true)
                    .append("createdAt", new Date())
                    .append("updatedAt", new Date());
            products.insertOne(laptop);

            // Fashion
            Document shirt = new Document()
                    .append("name", "Men's Casual Shirt")
                    .append("slug", "mens-casual-shirt")
                    .append("description", "Comfortable cotton shirt")
                    .append("price", 49.99)
                    .append("stockQuantity", 100)
                    .append("categories", Arrays.asList("fashion", "men"))
                    .append("imageUrls", Arrays.asList("https://example.com/shirt.jpg"))
                    .append("active", true)
                    .append("createdAt", new Date())
                    .append("updatedAt", new Date());
            products.insertOne(shirt);

            Document dress = new Document()
                    .append("name", "Women's Summer Dress")
                    .append("slug", "womens-summer-dress")
                    .append("description", "Elegant summer dress")
                    .append("price", 79.99)
                    .append("stockQuantity", 75)
                    .append("categories", Arrays.asList("fashion", "women"))
                    .append("imageUrls", Arrays.asList("https://example.com/dress.jpg"))
                    .append("active", true)
                    .append("createdAt", new Date())
                    .append("updatedAt", new Date());
            products.insertOne(dress);

            System.out.println("Sample products created successfully");
        }
    }

    private void insertSampleCategories(MongoCollection<Document> categories) {
        // Only insert if collection is empty
        if (categories.countDocuments() == 0) {
            // Main categories
            Document electronics = new Document()
                    .append("name", "Electronics")
                    .append("slug", "electronics")
                    .append("description", "Electronic devices and accessories")
                    .append("active", true)
                    .append("createdAt", new Date());
            categories.insertOne(electronics);

            Document fashion = new Document()
                    .append("name", "Fashion")
                    .append("slug", "fashion")
                    .append("description", "Clothing and accessories")
                    .append("active", true)
                    .append("createdAt", new Date());
            categories.insertOne(fashion);

            Document mobiles = new Document()
                    .append("name", "Mobiles")
                    .append("slug", "mobiles")
                    .append("description", "Smartphones and accessories")
                    .append("parentCategory", "electronics")
                    .append("active", true)
                    .append("createdAt", new Date());
            categories.insertOne(mobiles);

            Document computers = new Document()
                    .append("name", "Computers")
                    .append("slug", "computers")
                    .append("description", "Laptops and desktops")
                    .append("parentCategory", "electronics")
                    .append("active", true)
                    .append("createdAt", new Date());
            categories.insertOne(computers);

            System.out.println("Sample categories created successfully");
        }
    }
} 