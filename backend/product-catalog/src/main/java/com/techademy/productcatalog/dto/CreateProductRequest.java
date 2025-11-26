package com.techademy.productcatalog.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Map;

public class CreateProductRequest {

	@NotBlank
	private String name;

	private String description;

	@NotNull
	@DecimalMin("0.0")
	private BigDecimal price;

	private String category;

	private String gender;

	@NotEmpty(message = "At least one size with stock is required")
	private Map<String, Integer> sizeStock;

	private String imageUrl;

	public CreateProductRequest() {
	}

	// Getters
	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public String getCategory() {
		return category;
	}

	public String getGender() {
		return gender;
	}

	public Map<String, Integer> getSizeStock() {
		return sizeStock;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	// Setters
	public void setName(String name) {
		this.name = name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public void setSizeStock(Map<String, Integer> sizeStock) {
		this.sizeStock = sizeStock;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
}
