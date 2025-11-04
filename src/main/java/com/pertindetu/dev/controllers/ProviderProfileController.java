package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.models.dtos.ProviderProfileRequestDTO;
import com.pertindetu.dev.models.dtos.ProviderProfileResponseDTO;
import com.pertindetu.dev.services.ProviderProfileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@Tag(name = "Providers", description = "Endpoints for managing provider profiles")
@RequestMapping("/providers")
public class ProviderProfileController {

  @Autowired
  private ProviderProfileService providerProfileService;

  @Operation(summary = "List all provider profiles")
  @GetMapping
  public ResponseEntity<ApiResponseDTO<Page<ProviderProfileResponseDTO>>> findAll(
      @PageableDefault(page = 0, size = 10, sort = "user.name") Pageable pageable) {

    Page<ProviderProfile> page = providerProfileService.findAll(pageable);

    Page<ProviderProfileResponseDTO> mappedPage = page.map(ProviderProfileResponseDTO::new);

    return ResponseEntity.ok(new ApiResponseDTO<>(true, mappedPage, null));
  }

  @Operation(summary = "Get a provider profile by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Profile found"),
      @ApiResponse(responseCode = "404", description = "Profile not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ProviderProfileResponseDTO> findById(@PathVariable Long id) {
    ProviderProfile profile = providerProfileService.findById(id);
    return ResponseEntity.ok(new ProviderProfileResponseDTO(profile));
  }

  @Operation(summary = "Create a new provider profile")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Profile created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid profile data")
  })
  @PostMapping
  public ResponseEntity<ProviderProfileResponseDTO> create(@Valid @RequestBody ProviderProfileRequestDTO dto) {
    ProviderProfile created = providerProfileService.save(dto);
    return ResponseEntity.ok(new ProviderProfileResponseDTO(created));
  }

  @Operation(summary = "Update an existing provider profile")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
      @ApiResponse(responseCode = "404", description = "Profile not found"),
      @ApiResponse(responseCode = "400", description = "Invalid profile data")
  })
  @PutMapping("/{id}")
  public ResponseEntity<ProviderProfileResponseDTO> update(@PathVariable Long id,
      @Valid @RequestBody ProviderProfileRequestDTO dto) {
    ProviderProfile updated = providerProfileService.update(id, dto);
    return ResponseEntity.ok(new ProviderProfileResponseDTO(updated));
  }

  @Operation(summary = "Delete a provider profile by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "Profile deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Profile not found")
  })

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    providerProfileService.delete(id);
    return ResponseEntity.noContent().build();
  }
}