package com.techademy.orderservice.controller;

import com.techademy.orderservice.dto.OrderItemRequestDto;
import com.techademy.orderservice.dto.OrderResponseDto;
import com.techademy.orderservice.service.OrderService;
import com.techademy.orderservice.service.ProductCheckEventProducerService;

import java.util.List;

import org.example.events.ProductCheckEvent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class OrderController {

    private final OrderService orderService;

    private final ProductCheckEventProducerService productCheckEventProducerService;

    public OrderController(
            OrderService orderService,
            ProductCheckEventProducerService productCheckEventProducerService) {
        this.orderService = orderService;
        this.productCheckEventProducerService = productCheckEventProducerService;
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> placeOrder(
            @RequestBody OrderItemRequestDto orderRequest) {
        String userId = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        ProductCheckEvent productCheckEvent = new ProductCheckEvent();

        productCheckEvent.setProductId(orderRequest.getProductId().toString());
        productCheckEvent.setSize(orderRequest.getSize());
        productCheckEvent.setQuantity(orderRequest.getQuantity());
        productCheckEvent.setUserId(userId);
        productCheckEvent.setPrice(orderRequest.getPrice());
        productCheckEvent.setProductName(orderRequest.getProductName());
        productCheckEvent.setProductVariantId(
                orderRequest.getProductVariantId());

        productCheckEventProducerService.sendProductCheckEvent(
                productCheckEvent);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                "Order placed successfully");
    }

    @GetMapping("/")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<OrderResponseDto>> getMyOrders() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        List<OrderResponseDto> orders = orderService.getUserOrders(userId);

        return ResponseEntity.ok(orders);
    }
}
