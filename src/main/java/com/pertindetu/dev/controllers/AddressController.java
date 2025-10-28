package com.pertindetu.dev.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.Address;
import com.pertindetu.dev.models.dtos.AddressRequestDTO;
import com.pertindetu.dev.models.dtos.AddressResponseDTO;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.services.AddressService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("address")
@CrossOrigin(origins = "*")
@Tag(name = "Addresses", description = "Endpoints for managing user addresses")
public class AddressController {

  @Autowired
  private AddressService addressService;

  @Operation(summary = "List all addresses")
  @ApiResponse(responseCode = "200", description = "List of addresses successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<AddressResponseDTO>>> getAll() {
    List<AddressResponseDTO> addresses = addressService.findAll()
        .stream()
        .map(AddressResponseDTO::new)
        .collect(Collectors.toList());

    return ResponseEntity.ok(new ApiResponseDTO<>(true, addresses, null));
  }

  @Operation(summary = "Get an address by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Address found"),
      @ApiResponse(responseCode = "404", description = "Address not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<AddressResponseDTO>> getById(@PathVariable Long id) {
    Address address = addressService.findById(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new AddressResponseDTO(address), null));
  }

  @Operation(summary = "Create a new address")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Address created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "400", description = "Invalid address data provided (validation error)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  })
  @PostMapping
  public ResponseEntity<ApiResponseDTO<AddressResponseDTO>> create(
      @Valid @RequestBody AddressRequestDTO request) {

    Address created = addressService.save(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new ApiResponseDTO<>(true, new AddressResponseDTO(created), null));
  }

  @Operation(summary = "Update an existing address")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Address updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "404", description = "Address not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "400", description = "Invalid address data provided", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  })
  @PutMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<AddressResponseDTO>> update(
      @PathVariable Long id, @Valid @RequestBody AddressRequestDTO request) {

    Address updated = addressService.update(id, request);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new AddressResponseDTO(updated), null));
  }

  @Operation(summary = "Delete an address by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Address deleted successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class))),
      @ApiResponse(responseCode = "404", description = "Address not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<String>> delete(@PathVariable Long id) {
    addressService.deleteById(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, "Address deleted successfully.", null));
  }
}
