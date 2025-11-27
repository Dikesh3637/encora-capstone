package com.techademy.orderservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @EmbeddedId
    private OrderItemPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("orderId")
    private Order order;

    @Column(nullable = false)
    private Integer quantity;

    public OrderItem() {}

    public OrderItem(Order order, String productId, Integer quantity) {
        this.order = order;
        this.id = new OrderItemPK(order.getOrderId(), productId);
        this.quantity = quantity;
    }

    public OrderItemPK getId() {
		return id;
	}

	public void setId(OrderItemPK id) {
		this.id = id;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Integer getQuantity() {
        return quantity;
    }
}
