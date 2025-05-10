package com.ecommerce.repository;

import com.ecommerce.model.AdminDetails;
import com.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminDetailsRepository extends JpaRepository<AdminDetails, Long> {
    Optional<AdminDetails> findByUser(User user);
    
    Optional<AdminDetails> findByUserUsername(String username);
    
    List<AdminDetails> findByDepartment(String department);
    
    List<AdminDetails> findByIsSuperAdmin(boolean isSuperAdmin);
} 