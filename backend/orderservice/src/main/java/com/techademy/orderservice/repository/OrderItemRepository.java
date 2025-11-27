package com.techademy.orderservice.repository;

import com.techademy.orderservice.entity.OrderItem;
import com.techademy.orderservice.entity.OrderItemPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPK> {
	
}
