package com.ecommerce.repository;

import com.ecommerce.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findByBusinessId(Long businessId);
    Optional<Brand> findByNameAndBusinessId(String name, Long businessId);
    List<Brand> findByNameContainingIgnoreCase(String name);
} 