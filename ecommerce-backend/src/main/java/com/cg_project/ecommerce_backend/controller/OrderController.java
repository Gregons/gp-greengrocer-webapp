package com.cg_project.ecommerce_backend.controller;

import com.cg_project.ecommerce_backend.dto.OrderResponse;
import com.cg_project.ecommerce_backend.dto.PlaceOrderRequest;
import com.cg_project.ecommerce_backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(customerService.getOrders(authorization));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestHeader("Authorization") String authorization,
            @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerService.placeOrder(authorization, request));
    }
}
