package com.cg_project.ecommerce_backend.dto;

import java.util.List;

public record OrderResponse(String orderId, String date, List<OrderItemResponse> items, double total) {}
