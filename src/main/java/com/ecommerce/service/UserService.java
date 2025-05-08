package com.ecommerce.service;

import com.ecommerce.dto.BusinessRegistrationRequest;
import com.ecommerce.dto.RegistrationResponse;
import com.ecommerce.dto.UserDTO;
import com.ecommerce.dto.UserRegistrationRequest;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${business.registration.code}")
    private String businessRegistrationCode;
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public RegistrationResponse registerUser(UserRegistrationRequest request) {
        // Validate input
        if (existsByUsername(request.getUsername())) {
            return new RegistrationResponse(false, "Username already taken");
        }
        
        if (existsByEmail(request.getEmail())) {
            return new RegistrationResponse(false, "Email already in use");
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new RegistrationResponse(false, "Passwords do not match");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        
        // Set address if provided
        if (request.getStreet() != null && !request.getStreet().isEmpty()) {
            User.Address address = new User.Address();
            address.setStreet(request.getStreet());
            address.setCity(request.getCity());
            address.setState(request.getState());
            address.setZipCode(request.getZipCode());
            address.setCountry(request.getCountry());
            user.setAddress(address);
        }
        
        // Set user role
        user.setRoles(Collections.singleton(Role.USER));
        
        // Additional fields
        user.setActive(true);
        user.setCreatedAt(new Date());
        
        // Save user
        User savedUser = userRepository.save(user);
        
        return new RegistrationResponse(true, "User registered successfully", savedUser.getId());
    }
    
    public RegistrationResponse registerBusinessUser(BusinessRegistrationRequest request) {
        // Validate business registration code
        if (!businessRegistrationCode.equals(request.getRegistrationCode())) {
            return new RegistrationResponse(false, "Invalid business registration code");
        }
        
        // First validate as a regular user
        RegistrationResponse basicValidation = registerUser(request);
        if (!basicValidation.isSuccess()) {
            return basicValidation;
        }
        
        // Get the saved user and update with business info
        User user = userRepository.findById(basicValidation.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found after registration"));
        
        // Add business information
        user.setBusinessName(request.getBusinessName());
        user.setBusinessDescription(request.getBusinessDescription());
        user.setTaxId(request.getTaxId());
        
        // Set business address
        User.Address businessAddress = new User.Address();
        businessAddress.setStreet(request.getBusinessStreet());
        businessAddress.setCity(request.getBusinessCity());
        businessAddress.setState(request.getBusinessState());
        businessAddress.setZipCode(request.getBusinessZipCode());
        businessAddress.setCountry(request.getBusinessCountry());
        user.setBusinessAddress(businessAddress);
        
        // Set business flags
        user.setVerifiedBusiness(false);  // Will be verified by admin
        
        // Update roles (keep USER role, add ADMIN role)
        Set<Role> roles = user.getRoles();
        roles.add(Role.ADMIN);           // Business users get ADMIN role
        user.setRoles(roles);
        
        // Business accounts need approval
        user.setActive(false);
        
        // Update the user
        userRepository.save(user);
        
        return new RegistrationResponse(true, 
            "Business account registered successfully. Your account will be activated after review.", 
            user.getId());
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    // Create a user with default USER role
    public User registerUser(User user) {
        // Check if username or email already exists
        if (usernameExists(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        
        if (emailExists(user.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default role
        user.setRoles(Collections.singleton(Role.USER));
        
        // Save user
        return userRepository.save(user);
    }
    
    // Create a user with specified roles
    public User createUser(User user, Set<Role> roles) {
        // Check if username or email already exists
        if (usernameExists(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        
        if (emailExists(user.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set roles
        user.setRoles(roles);
        
        // Save user
        return userRepository.save(user);
    }
    
    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Get users by role
    public List<UserDTO> getUsersByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(role))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    // Get user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // Check if username exists
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }
    
    // Check if email exists
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Update user
    public UserDTO updateUser(String id, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            
            // Update fields
            existingUser.setFullName(userDTO.getFullName());
            existingUser.setEmail(userDTO.getEmail());
            
            // Only update password if it's not null/empty
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }
            
            User updatedUser = userRepository.save(existingUser);
            return convertToDTO(updatedUser);
        }
        
        return null;
    }
    
    // Delete user
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Convert User to UserDTO
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setRoles(user.getRoles());
        dto.setActive(user.isActive());
        dto.setBusinessName(user.getBusinessName());
        dto.setBusinessDescription(user.getBusinessDescription());
        dto.setTaxId(user.getTaxId());
        dto.setAddress(user.getAddress());
        dto.setBusinessAddress(user.getBusinessAddress());
        dto.setVerifiedBusiness(user.isVerifiedBusiness());
        return dto;
    }

    // Convert UserDTO to User
    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setRoles(dto.getRoles());
        user.setActive(dto.isActive());
        user.setBusinessName(dto.getBusinessName());
        user.setBusinessDescription(dto.getBusinessDescription());
        user.setTaxId(dto.getTaxId());
        user.setAddress(dto.getAddress());
        user.setBusinessAddress(dto.getBusinessAddress());
        user.setVerifiedBusiness(dto.isVerifiedBusiness());
        return user;
    }

    // Create user with roles (returns UserDTO)
    public UserDTO createUser(UserDTO userDTO, Set<Role> roles) {
        User user = convertToEntity(userDTO);
        
        // Check if username or email already exists
        if (usernameExists(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        
        if (emailExists(user.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        
        // Set roles
        user.setRoles(roles);
        
        // Set creation date
        user.setCreatedAt(new Date());
        
        // Save user
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
} 