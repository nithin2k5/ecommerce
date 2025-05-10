package com.ecommerce.repository;

import com.ecommerce.model.BusinessDetails;
import com.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessDetailsRepository extends JpaRepository<BusinessDetails, Long> {
    Optional<BusinessDetails> findByUser(User user);
} 