package com.techademy.orderservice.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderItemPK implements Serializable {
    private String orderId;
    private String productId;

    public OrderItemPK() {}
    public OrderItemPK(String orderId, String productId) {
        this.orderId = orderId;
        this.productId = productId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        OrderItemPK other = (OrderItemPK) o;
        return Objects.equals(orderId, other.orderId) &&
               Objects.equals(productId, other.productId);
    }

    public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public String getProductId() {
		return productId;
	}
	public void setProductId(String productId) {
		this.productId = productId;
	}
	@Override
    public int hashCode() {
        return Objects.hash(orderId, productId);
    }
}
