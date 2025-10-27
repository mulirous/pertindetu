package com.pertindetu.dev.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

import jakarta.validation.Valid;

@RestController
@RequestMapping("users")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping
    public ResponseEntity<ApiResponseDTO<List<UserResponseDTO>>> getAll() {
        List<UserResponseDTO> users = userService.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponseDTO<>(true, users, null));
    }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> getById(@PathVariable Long id) {
      User user = userService.findById(id);
      return ResponseEntity.ok(new ApiResponseDTO<>(true, new UserResponseDTO(user), null));
  }

  @PostMapping
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> create(@Valid @RequestBody UserRequestDTO dto) {
      User created = userService.save(dto);
      return ResponseEntity.status(HttpStatus.CREATED)
              .body(new ApiResponseDTO<>(true, new UserResponseDTO(created), null));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> update(@PathVariable Long id,
                                                                @Valid @RequestBody UserRequestDTO dto) {
      User updated = userService.update(id, dto);
      return ResponseEntity.ok(new ApiResponseDTO<>(true, new UserResponseDTO(updated), null));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<UserResponseDTO>> delete(@PathVariable Long id) {
        User deleted = userService.deleteById(id);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, new UserResponseDTO(deleted), null));
    }
}
