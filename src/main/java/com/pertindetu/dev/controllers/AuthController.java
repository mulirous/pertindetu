package com.pertindetu.dev.controllers;

import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.models.dtos.CategoryResponseDTO;
import com.pertindetu.dev.models.dtos.auth.LoginRequestDTO;
import com.pertindetu.dev.models.dtos.auth.LoginResponseDTO;
import com.pertindetu.dev.models.dtos.auth.RegisterRequestDTO;
import com.pertindetu.dev.models.dtos.auth.RegisterResponseDTO;
import com.pertindetu.dev.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
@Tag(name = "Authentication", description = "Endpoints for managing user authentication")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Login")
    @ApiResponse(responseCode = "200",
            description = "Login authentication successfully retrieved",
            content = @Content(mediaType = "application/json",
            schema = @Schema(implementation = ApiResponseDTO.class)))
    @PostMapping("/login")  // Changed to POST and explicit path
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        LoginResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Register")
    @ApiResponse(responseCode = "201",
            description = "Register  successfully retrieved",
            content = @Content(mediaType = "application/json",
            schema = @Schema(implementation = ApiResponseDTO.class)))
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO dto) {
        RegisterResponseDTO response = authService.register(dto);
        return ResponseEntity.ok(response);
    }


}
