package com.pertindetu.dev.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.Service;
import com.pertindetu.dev.models.dtos.ServiceRequestDTO;
import com.pertindetu.dev.models.dtos.ServiceResponseDTO;
import com.pertindetu.dev.services.ServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/services")
@Tag(name = "Services", description = "Endpoints for managing platform services")
public class ServiceController {

  @Autowired
  private ServiceService serviceService;

  @Operation(summary = "List all services")
  @ApiResponse(responseCode = "200", description = "List of services successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServiceResponseDTO.class)))
  @GetMapping
  public ResponseEntity<List<ServiceResponseDTO>> findAll() {
    List<ServiceResponseDTO> list = serviceService.findAll().stream()
        .map(ServiceResponseDTO::new).toList();
    return ResponseEntity.ok(list);
  }

  @Operation(summary = "Get a service by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Service found"),
      @ApiResponse(responseCode = "404", description = "Service not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ServiceResponseDTO> findById(@PathVariable Long id) {
    Service service = serviceService.findById(id);
    return ResponseEntity.ok(new ServiceResponseDTO(service));
  }

  @Operation(summary = "Create a new service")
  @ApiResponse(responseCode = "201", description = "Service created successfully")
  @PostMapping
  public ResponseEntity<ServiceResponseDTO> create(@RequestBody ServiceRequestDTO dto) {
    Service created = serviceService.save(dto);
    return ResponseEntity.ok(new ServiceResponseDTO(created));
  }

  @Operation(summary = "Update an existing service")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Service updated successfully"),
      @ApiResponse(responseCode = "404", description = "Service not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<ServiceResponseDTO> update(@PathVariable Long id, @RequestBody ServiceRequestDTO dto) {
    Service updated = serviceService.update(id, dto);
    return ResponseEntity.ok(new ServiceResponseDTO(updated));
  }

  @Operation(summary = "Delete a service by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "Service deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Service not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    serviceService.delete(id);
    return ResponseEntity.noContent().build();
  }
}