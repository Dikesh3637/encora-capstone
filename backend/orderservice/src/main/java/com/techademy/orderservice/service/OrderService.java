package com.techademy.orderservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.techademy.orderservice.dto.OrderItemRequestDto;
import com.techademy.orderservice.dto.OrderItemResponseDto;
import com.techademy.orderservice.dto.OrderRequestDto;
import com.techademy.orderservice.dto.OrderResponseDto;
import com.techademy.orderservice.entity.Order;
import com.techademy.orderservice.entity.OrderItem;
import com.techademy.orderservice.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public void placeOrder(OrderRequestDto orderRequest) {
        Order order = new Order();

        // 1. Map DTOs to OrderItem Entities
        List<OrderItem> orderItems = orderRequest.getItems().stream()
                .map(dto -> mapToEntity(dto, order))
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);

        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(totalAmount);

        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getUserOrders(String userId) {
        List<Order> orders = orderRepository.findAllByUserIdOrderByOrderDateDesc(userId);

        return orders.stream().map(order -> {
            // Map Items
            List<OrderItemResponseDto> items = order.getOrderItems().stream()
                    .map(item -> new OrderItemResponseDto(
                            item.getProductId(),
                            item.getProductName(),
                            item.getSize(),
                            item.getQuantity(),
                            item.getPrice()))
                    .collect(Collectors.toList());

            // Map Order
            return new OrderResponseDto(
                    order.getId(),
                    order.getStatus(),
                    order.getOrderDate(),
                    order.getTotalAmount(),
                    items);
        }).collect(Collectors.toList());
    }

    private OrderItem mapToEntity(OrderItemRequestDto dto, Order order) {
        OrderItem item = new OrderItem();
        item.setProductId(dto.getProductId());
        item.setProductVariantId(dto.getProductVariantId());
        item.setProductName(dto.getProductName());
        item.setPrice(dto.getPrice());
        item.setQuantity(dto.getQuantity());
        item.setOrder(order);
        item.setSize(dto.getSize().name());

        return item;
    }
}
