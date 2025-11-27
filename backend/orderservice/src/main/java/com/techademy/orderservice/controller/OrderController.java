package com.techademy.orderservice.controller;

import com.techademy.orderservice.dto.*;
import com.techademy.orderservice.service.OrderService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService svc) {
        this.service = svc;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<OrderDto> placeOrder(@PathVariable String userId,
                                               @Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createOrder(userId, req));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(service.getOrder(orderId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getUserOrders(@PathVariable String userId) {
        return ResponseEntity.ok(service.getOrdersByUser(userId));
    }
}
