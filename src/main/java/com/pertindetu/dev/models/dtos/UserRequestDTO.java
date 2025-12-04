package com.pertindetu.dev.models.dtos;

import com.pertindetu.dev.models.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequestDTO(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "Invalid email format") String email,
        @NotBlank(message = "Password is required") String password,
        String cellphoneNumber,
        @NotNull(message = "Role is required") UserRole role
) {}