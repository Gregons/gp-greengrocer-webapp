package com.cg_project.ecommerce_backend.dto;

public record OrderItemResponse(Long id, String name, double price, int quantity) {}
