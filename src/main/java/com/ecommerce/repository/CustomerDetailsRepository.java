package com.ecommerce.repository;

import com.ecommerce.model.CustomerDetails;
import com.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerDetailsRepository extends JpaRepository<CustomerDetails, Long> {
    Optional<CustomerDetails> findByUser(User user);
    Optional<CustomerDetails> findByUserId(Long userId);
} 