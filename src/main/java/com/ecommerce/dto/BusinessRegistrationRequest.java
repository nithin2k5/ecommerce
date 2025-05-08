package com.ecommerce.dto;

public class BusinessRegistrationRequest extends UserRegistrationRequest {
    private String businessName;
    private String businessDescription;
    private String taxId;
    
    // Business address (could be different from personal address)
    private String businessStreet;
    private String businessCity;
    private String businessState;
    private String businessZipCode;
    private String businessCountry;
    
    // Secret code for business registration 
    private String registrationCode;
    
    // Getters and Setters
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    
    public String getBusinessDescription() { return businessDescription; }
    public void setBusinessDescription(String businessDescription) { this.businessDescription = businessDescription; }
    
    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }
    
    public String getBusinessStreet() { return businessStreet; }
    public void setBusinessStreet(String businessStreet) { this.businessStreet = businessStreet; }
    
    public String getBusinessCity() { return businessCity; }
    public void setBusinessCity(String businessCity) { this.businessCity = businessCity; }
    
    public String getBusinessState() { return businessState; }
    public void setBusinessState(String businessState) { this.businessState = businessState; }
    
    public String getBusinessZipCode() { return businessZipCode; }
    public void setBusinessZipCode(String businessZipCode) { this.businessZipCode = businessZipCode; }
    
    public String getBusinessCountry() { return businessCountry; }
    public void setBusinessCountry(String businessCountry) { this.businessCountry = businessCountry; }
    
    public String getRegistrationCode() { return registrationCode; }
    public void setRegistrationCode(String registrationCode) { this.registrationCode = registrationCode; }
} 