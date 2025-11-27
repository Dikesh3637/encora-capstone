package com.techademy.orderservice.dto;

import java.time.Instant;
import java.util.List;

public class OrderDto {
    private String orderId;
    private String userId;
    private Instant timestamp;
    private List<OrderItemDto> items;

    public OrderDto(String orderId, String userId, Instant timestamp, List<OrderItemDto> items) {
        this.orderId = orderId;
        this.userId = userId;
        this.timestamp = timestamp;
        this.items = items;
    }

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Instant getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Instant timestamp) {
		this.timestamp = timestamp;
	}

	public List<OrderItemDto> getItems() {
		return items;
	}

	public void setItems(List<OrderItemDto> items) {
		this.items = items;
	}
}
