package com.cg_project.ecommerce_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "A valid email address is required") @NotBlank String email,
        @Size(min = 6, message = "Password must be at least 6 characters") String password) {}
