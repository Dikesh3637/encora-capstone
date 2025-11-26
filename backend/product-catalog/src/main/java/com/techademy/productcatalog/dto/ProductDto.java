package com.techademy.productcatalog.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ProductDto {

	private Long id;
	private String name;
	private String description;
	private BigDecimal price;
	private String category;
	private Map<String, Integer> sizeStock;
	private Double rating;
	private String imageUrl;
	private String gender;

	public ProductDto() {
	}

	public ProductDto(Long id, String name, String description, BigDecimal price, String category,
			Map<String, Integer> sizeStock, Double rating, String imageUrl, String gender) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.category = category;
		this.sizeStock = sizeStock;
		this.rating = rating;
		this.imageUrl = imageUrl;
		this.gender = gender;
	}

	// Getters & setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Map<String, Integer> getSizeStock() {
		return sizeStock;
	}

	public void setSizeStock(Map<String, Integer> sizeStock) {
		this.sizeStock = sizeStock;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}
}
