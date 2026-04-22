package com.cg_project.ecommerce_backend.dto;

public record OrderItemRequest(Long id, String name, double price, int quantity) {}
