package com.techademy.productcatalog.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = { @Index(columnList = "name"), @Index(columnList = "category"),
		@Index(columnList = "gender") })
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(length = 4000)
	private String description;

	@Column(nullable = false)
	private BigDecimal price;

	private String category;

	private String gender;

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProductSize> sizes = new ArrayList<>();

	private Double rating;

	@Column(name = "image_url")
	private String imageUrl;

	private Instant createdAt;
	private Instant updatedAt;

	@PrePersist
	public void prePersist() {
		createdAt = Instant.now();
		updatedAt = createdAt;
	}

	@PreUpdate
	public void preUpdate() {
		updatedAt = Instant.now();
	}

	// Getters
	public Long getId() {
		return id;
	}

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

	public List<ProductSize> getSizes() {
		return sizes;
	}

	public Double getRating() {
		return rating;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	// Setters
	public void setId(Long id) {
		this.id = id;
	}

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

	public void setSizes(List<ProductSize> sizes) {
		this.sizes = sizes;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}
}
