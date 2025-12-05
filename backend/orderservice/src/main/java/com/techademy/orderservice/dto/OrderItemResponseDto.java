package com.techademy.orderservice.dto;

import java.math.BigDecimal;

public class OrderItemResponseDto {
    private Long productId;
    private String productName;
    private String size;
    private Integer quantity;
    private BigDecimal price;

    public OrderItemResponseDto(Long productId, String productName, String size, Integer quantity, BigDecimal price) {
        this.productId = productId;
        this.productName = productName;
        this.size = size;
        this.quantity = quantity;
        this.price = price;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getSize() {
        return size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
