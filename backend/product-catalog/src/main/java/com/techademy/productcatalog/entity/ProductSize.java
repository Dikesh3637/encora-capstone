package com.techademy.productcatalog.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_sizes")
public class ProductSize {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 3)
	private Size size;

	@Column(nullable = false)
	private Integer stock = 0;

	public enum Size {
		S, M, L, XL, XXL
	}

	// Constructors
	public ProductSize() {
	}

	public ProductSize(Product product, Size size, Integer stock) {
		this.product = product;
		this.size = size;
		this.stock = stock;
	}

	// Getters
	public Long getId() {
		return id;
	}

	public Product getProduct() {
		return product;
	}

	public Size getSize() {
		return size;
	}

	public Integer getStock() {
		return stock;
	}

	// Setters
	public void setId(Long id) {
		this.id = id;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public void setSize(Size size) {
		this.size = size;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}
}