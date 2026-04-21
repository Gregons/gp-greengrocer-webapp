package com.cg_project.ecommerce_backend.dto;

import java.util.List;

public record PlaceOrderRequest(List<OrderItemRequest> items, double total) {}
