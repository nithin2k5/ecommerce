package com.ecommerce.service.impl;

import com.ecommerce.dto.BrandDTO;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Brand;
import com.ecommerce.model.BusinessDetails;
import com.ecommerce.repository.BrandRepository;
import com.ecommerce.repository.BusinessDetailsRepository;
import com.ecommerce.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private BusinessDetailsRepository businessDetailsRepository;
    
    @Override
    public BrandDTO getBrand(Long id) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        return convertToDTO(brand);
    }
    
    @Override
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<BrandDTO> getBrandsByBusiness(Long businessId) {
        return brandRepository.findByBusinessId(businessId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public BrandDTO createBrand(BrandDTO brandDTO, Long businessId) {
        BusinessDetails business = businessDetailsRepository.findById(businessId)
            .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));
        
        Brand brand = new Brand();
        brand.setName(brandDTO.getName());
        brand.setDescription(brandDTO.getDescription());
        brand.setLogoUrl(brandDTO.getLogoUrl());
        brand.setBusiness(business);
        
        Brand savedBrand = brandRepository.save(brand);
        return convertToDTO(savedBrand);
    }
    
    @Override
    @Transactional
    public BrandDTO updateBrand(Long id, BrandDTO brandDTO) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        
        brand.setName(brandDTO.getName());
        brand.setDescription(brandDTO.getDescription());
        brand.setLogoUrl(brandDTO.getLogoUrl());
        
        Brand updatedBrand = brandRepository.save(brand);
        return convertToDTO(updatedBrand);
    }
    
    @Override
    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        
        brandRepository.delete(brand);
    }
    
    @Override
    @Transactional
    public BrandDTO getOrCreateBrand(String brandName, Long businessId) {
        if (brandName == null || brandName.isEmpty()) {
            return null;
        }
        
        BusinessDetails business = businessDetailsRepository.findById(businessId)
            .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));
        
        return brandRepository.findByNameAndBusinessId(brandName, businessId)
            .map(this::convertToDTO)
            .orElseGet(() -> {
                // Create new brand
                Brand brand = new Brand();
                brand.setName(brandName);
                brand.setBusiness(business);
                Brand savedBrand = brandRepository.save(brand);
                return convertToDTO(savedBrand);
            });
    }
    
    private BrandDTO convertToDTO(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setDescription(brand.getDescription());
        dto.setLogoUrl(brand.getLogoUrl());
        
        if (brand.getBusiness() != null) {
            dto.setBusinessId(brand.getBusiness().getId());
            dto.setBusinessName(brand.getBusiness().getBusinessName());
        }
        
        dto.setCreatedAt(brand.getCreatedAt());
        dto.setUpdatedAt(brand.getUpdatedAt());
        
        return dto;
    }
} 