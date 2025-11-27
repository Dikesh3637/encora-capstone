package com.techademy.orderservice.service;

import com.techademy.orderservice.dto.*;
import com.techademy.orderservice.entity.*;
import com.techademy.orderservice.exception.NotFoundException;
import com.techademy.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public OrderDto createOrder(String userId, CreateOrderRequest req) {
        Order order = new Order();
        order.setOrderId(UUID.randomUUID().toString());
        order.setUserId(userId);

        req.getItems().forEach((productId, qty) -> {
            order.getItems().add(new OrderItem(order, productId, qty));
        });

        repo.save(order);
        return toDto(order);
    }

    public OrderDto getOrder(String orderId) {
        return repo.findById(orderId)
                .map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
    }

    public List<OrderDto> getOrdersByUser(String userId) {
        return repo.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private OrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getItems().stream()
                .map(i -> new OrderItemDto(i.getId().getProductId(), i.getQuantity()))
                .collect(Collectors.toList());

        return new OrderDto(order.getOrderId(), order.getUserId(), order.getTimestamp(), items);
    }
}
