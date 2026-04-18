package com.cg_project.ecommerce_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email(message = "A valid email address is required") @NotBlank String email,
        @NotBlank(message = "Password is required") String password) {}
