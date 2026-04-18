package com.cg_project.ecommerce_backend.dto;

/** Returned on both /register and /login. The token authenticates subsequent requests. */
public record LoginResponse(Long id, String name, String email, String token) {}
