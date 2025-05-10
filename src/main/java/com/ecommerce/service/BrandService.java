package com.ecommerce.service;

import com.ecommerce.dto.BrandDTO;
import java.util.List;

public interface BrandService {
    BrandDTO getBrand(Long id);
    List<BrandDTO> getAllBrands();
    List<BrandDTO> getBrandsByBusiness(Long businessId);
    BrandDTO createBrand(BrandDTO brandDTO, Long businessId);
    BrandDTO updateBrand(Long id, BrandDTO brandDTO);
    void deleteBrand(Long id);
    BrandDTO getOrCreateBrand(String brandName, Long businessId);
} 