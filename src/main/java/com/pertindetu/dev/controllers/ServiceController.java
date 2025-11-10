package com.pertindetu.dev.controllers;

import java.math.BigDecimal;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pertindetu.dev.models.Service;
import com.pertindetu.dev.models.ServiceMedia;
import com.pertindetu.dev.models.dtos.ServiceRequestDTO;
import com.pertindetu.dev.models.dtos.ServiceResponseDTO;
import com.pertindetu.dev.models.enums.MediaType;
import com.pertindetu.dev.services.ImageUploadService;
import com.pertindetu.dev.services.ServiceMediaService;
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

  @Autowired
  private ServiceMediaService serviceMediaService;

  @Autowired
  private ImageUploadService imageUploadService;

  @Operation(summary = "List services with filters (public endpoint)")
  @ApiResponse(responseCode = "200", description = "Filtered services retrieved successfully")
  @GetMapping("/public")
  public ResponseEntity<Page<ServiceResponseDTO>> findByFilters(
      @RequestParam(required = false) Long categoryId,
      @RequestParam(required = false) Long providerId,
      @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(required = false) String search,
      @PageableDefault(page = 0, size = 12, sort = "createdAt,desc") Pageable pageable) {

    Page<Service> servicePage = serviceService.findByFilters(
        categoryId, providerId, minPrice, maxPrice, search, pageable);

    Page<ServiceResponseDTO> dtoPage = servicePage.map(ServiceResponseDTO::new);

    return ResponseEntity.ok(dtoPage);
  }

  @Operation(summary = "List all services")
  @ApiResponse(responseCode = "200", description = "List of services successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServiceResponseDTO.class)))
  @GetMapping
  public ResponseEntity<Page<ServiceResponseDTO>> findAll(
      @PageableDefault(page = 0, size = 10, sort = "title") Pageable pageable) {

    Page<Service> servicePage = serviceService.findAll(pageable);

    Page<ServiceResponseDTO> dtoPage = servicePage.map(ServiceResponseDTO::new);

    return ResponseEntity.ok(dtoPage);
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

  @Operation(summary = "Upload image for a service")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Image uploaded successfully"),
      @ApiResponse(responseCode = "404", description = "Service not found"),
      @ApiResponse(responseCode = "400", description = "Invalid file")
  })
  @PostMapping("/{id}/media")
  public ResponseEntity<ServiceMedia> uploadMedia(
      @PathVariable Long id,
      @RequestParam("image") MultipartFile image,
      @RequestParam(value = "description", required = false) String description) {
    
    // Verificar se o serviço existe
    serviceService.findById(id);
    
    // Fazer upload da imagem
    String mediaUrl = imageUploadService.uploadImage(image);
    
    // Criar ServiceMedia
    ServiceMedia media = serviceMediaService.save(
        id,
        mediaUrl,
        MediaType.PHOTO,
        description,
        null // order será calculado automaticamente
    );
    
    return ResponseEntity.ok(media);
  }

  @Operation(summary = "Get all media for a service")
  @ApiResponse(responseCode = "200", description = "Media list retrieved successfully")
  @GetMapping("/{id}/media")
  public ResponseEntity<java.util.List<ServiceMedia>> getServiceMedia(@PathVariable Long id) {
    java.util.List<ServiceMedia> mediaList = serviceMediaService.findByServiceId(id);
    return ResponseEntity.ok(mediaList);
  }
}