package com.pertindetu.dev.models.dtos.auth;

import com.pertindetu.dev.models.dtos.AddressRequestDTO;
import com.pertindetu.dev.models.dtos.UserRequestDTO;

public record RegisterRequestDTO(
    UserRequestDTO user,
    AddressRequestDTO address
) {
}
