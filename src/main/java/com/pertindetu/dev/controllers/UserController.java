package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.models.dtos.UserRequestDTO;
import com.pertindetu.dev.models.dtos.UserResponseDTO;
import com.pertindetu.dev.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("users")
@Tag(name = "Users", description = "Endpoints for managing user accounts")
public class UserController {

  @Autowired
  private UserService userService;

  @Operation(summary = "List all users")
  @ApiResponse(responseCode = "200", description = "List of users successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  @GetMapping
  public ResponseEntity<ApiResponseDTO<Page<UserResponseDTO>>> getAll(
      @PageableDefault(page = 0, size = 10, sort = "name") Pageable pageable) {

    Page<UserResponseDTO> users = userService.findAll(pageable)
        .map(UserResponseDTO::new);

    return ResponseEntity.ok(new ApiResponseDTO<>(true, users, null));
  }

  @Operation(summary = "Get a user by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "User found"),
      @ApiResponse(responseCode = "404", description = "User not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> getById(@PathVariable Long id) {
    User user = userService.findById(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new UserResponseDTO(user), null));
  }

  @Operation(summary = "Create a new user")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "User created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "400", description = "Invalid user data provided (validation error)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  })
  @PostMapping
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> create(@Valid @RequestBody UserRequestDTO dto) {
    User created = userService.save(dto);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new ApiResponseDTO<>(true, new UserResponseDTO(created), null));
  }

  @Operation(summary = "Update an existing user")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "User updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "400", description = "Invalid user data provided", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  })
  @PutMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> update(@PathVariable Long id,
      @Valid @RequestBody UserRequestDTO dto) {
    User updated = userService.update(id, dto);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new UserResponseDTO(updated), null));
  }

  @Operation(summary = "Delete a user by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "User deleted successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> delete(@PathVariable Long id) {
    User deleted = userService.deleteById(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new UserResponseDTO(deleted), null));
  }

  @Operation(summary = "Transform a CLIENT user into a PROVIDER")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "User role updated to PROVIDER successfully"),
      @ApiResponse(responseCode = "404", description = "User not found"),
      @ApiResponse(responseCode = "400", description = "User cannot change role (e.g., already admin)")
  })
  @PatchMapping("/{id}/become-provider")
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> becomeProvider(@PathVariable Long id) {
    User updated = userService.becomeProvider(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new UserResponseDTO(updated), null));
  }
}
