package com.techademy.orderservice.service;

import com.techademy.orderservice.dto.*;
import com.techademy.orderservice.entity.Order;
import com.techademy.orderservice.entity.OrderItem;
import com.techademy.orderservice.exception.NotFoundException;
import com.techademy.orderservice.repository.OrderRepository;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    private OrderRepository repo;
    private OrderService service;

    @BeforeEach
    void setup() {
        repo = Mockito.mock(OrderRepository.class);
        service = new OrderService(repo);
    }
    @Test
    void testCreateOrder() {
        CreateOrderRequest req = new CreateOrderRequest();
        req.setItems(Map.of("P001", 2, "P002", 1));

        Order savedOrder = new Order();
        savedOrder.setOrderId("OID123");
        savedOrder.setUserId("U001");
        savedOrder.getItems().add(new OrderItem(savedOrder, "P001", 2));
        savedOrder.getItems().add(new OrderItem(savedOrder, "P002", 1));

        when(repo.save(any(Order.class))).thenReturn(savedOrder);

        OrderDto dto = service.createOrder("U001", req);

        assertEquals("U001", dto.getUserId());
        assertEquals(2, dto.getItems().size());
        verify(repo, times(1)).save(any(Order.class));
    }
    @Test
    void testGetOrderSuccess() {
        Order order = new Order();
        order.setOrderId("OID100");
        order.setUserId("U007");
        order.getItems().add(new OrderItem(order, "PID10", 3));

        when(repo.findById("OID100")).thenReturn(Optional.of(order));

        OrderDto dto = service.getOrder("OID100");

        assertEquals("OID100", dto.getOrderId());
        assertEquals("U007", dto.getUserId());
    }
    @Test
    void testGetOrderNotFound() {
        when(repo.findById("XYZ")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.getOrder("XYZ"));
    }
    @Test
    void testGetOrdersByUser() {
        Order order1 = new Order();
        order1.setOrderId("OID1");
        order1.setUserId("U100");

        Order order2 = new Order();
        order2.setOrderId("OID2");
        order2.setUserId("U100");

        when(repo.findByUserId("U100")).thenReturn(List.of(order1, order2));

        List<OrderDto> result = service.getOrdersByUser("U100");

        assertEquals(2, result.size());
        verify(repo, times(1)).findByUserId("U100");
    }
    @Test
    void testDtoMapping() {
        Order order = new Order();
        order.setOrderId("OID200");
        order.setUserId("U500");
        order.getItems().add(new OrderItem(order, "PID01", 5));

        when(repo.findById("OID200")).thenReturn(Optional.of(order));

        OrderDto dto = service.getOrder("OID200");

        assertEquals("OID200", dto.getOrderId());
        assertEquals("U500", dto.getUserId());
        assertEquals(1, dto.getItems().size());
        assertEquals("PID01", dto.getItems().get(0).getProductId());
    }
}
