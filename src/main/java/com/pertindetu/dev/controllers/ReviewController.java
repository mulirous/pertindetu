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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.Review;
import com.pertindetu.dev.models.dtos.ReviewRequestDTO;
import com.pertindetu.dev.models.dtos.ReviewResponseDTO;
import com.pertindetu.dev.services.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/reviews")
@Tag(name = "Reviews", description = "Endpoints for managing service reviews")
public class ReviewController {

  @Autowired
  private ReviewService reviewService;

  @Operation(summary = "List all reviews (paginated)")
  @GetMapping
  public ResponseEntity<Page<ReviewResponseDTO>> findAll(
      @PageableDefault(page = 0, size = 10, sort = "createdAt,desc") Pageable pageable) {
    Page<Review> reviews = reviewService.findAll(pageable);
    Page<ReviewResponseDTO> dtoPage = reviews.map(ReviewResponseDTO::new);
    return ResponseEntity.ok(dtoPage);
  }

  @Operation(summary = "Get reviews by service ID")
  @GetMapping("/service/{serviceId}")
  public ResponseEntity<Page<ReviewResponseDTO>> findByServiceId(
      @PathVariable Long serviceId,
      @PageableDefault(page = 0, size = 10, sort = "createdAt,desc") Pageable pageable) {
    Page<Review> reviews = reviewService.findByServiceId(serviceId, pageable);
    Page<ReviewResponseDTO> dtoPage = reviews.map(ReviewResponseDTO::new);
    return ResponseEntity.ok(dtoPage);
  }

  @Operation(summary = "Get reviews by user ID")
  @GetMapping("/user/{userId}")
  public ResponseEntity<Page<ReviewResponseDTO>> findByUserId(
      @PathVariable Long userId,
      @PageableDefault(page = 0, size = 10, sort = "createdAt,desc") Pageable pageable) {
    Page<Review> reviews = reviewService.findByUserId(userId, pageable);
    Page<ReviewResponseDTO> dtoPage = reviews.map(ReviewResponseDTO::new);
    return ResponseEntity.ok(dtoPage);
  }

  @Operation(summary = "Get reviews by provider ID")
  @GetMapping("/provider/{providerId}")
  public ResponseEntity<Page<ReviewResponseDTO>> findByProviderId(
      @PathVariable Long providerId,
      @PageableDefault(page = 0, size = 10, sort = "createdAt,desc") Pageable pageable) {
    Page<Review> reviews = reviewService.findByProviderId(providerId, pageable);
    Page<ReviewResponseDTO> dtoPage = reviews.map(ReviewResponseDTO::new);
    return ResponseEntity.ok(dtoPage);
  }

  @Operation(summary = "Get a review by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Review found"),
      @ApiResponse(responseCode = "404", description = "Review not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ReviewResponseDTO> findById(@PathVariable Long id) {
    Review review = reviewService.findById(id);
    return ResponseEntity.ok(new ReviewResponseDTO(review));
  }

  @Operation(summary = "Get average rating of a service")
  @GetMapping("/service/{serviceId}/average")
  public ResponseEntity<Double> getAverageRatingByServiceId(@PathVariable Long serviceId) {
    Double average = reviewService.getAverageRatingByServiceId(serviceId);
    return ResponseEntity.ok(average);
  }

  @Operation(summary = "Get average rating of a provider")
  @GetMapping("/provider/{providerId}/average")
  public ResponseEntity<Double> getAverageRatingByProviderId(@PathVariable Long providerId) {
    Double average = reviewService.getAverageRatingByProviderId(providerId);
    return ResponseEntity.ok(average);
  }

  @Operation(summary = "Get total count of reviews for a service")
  @GetMapping("/service/{serviceId}/count")
  public ResponseEntity<Long> countByServiceId(@PathVariable Long serviceId) {
    long count = reviewService.countByServiceId(serviceId);
    return ResponseEntity.ok(count);
  }

  @Operation(summary = "Create a new review")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Review created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid data or order not completed")
  })
  @PostMapping
  public ResponseEntity<ReviewResponseDTO> create(@Valid @RequestBody ReviewRequestDTO dto) {
    Review created = reviewService.save(dto);
    return ResponseEntity.ok(new ReviewResponseDTO(created));
  }

  @Operation(summary = "Update an existing review")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Review updated successfully"),
      @ApiResponse(responseCode = "404", description = "Review not found"),
      @ApiResponse(responseCode = "400", description = "Not authorized to update this review")
  })
  @PutMapping("/{id}")
  public ResponseEntity<ReviewResponseDTO> update(
      @PathVariable Long id,
      @Valid @RequestBody ReviewRequestDTO dto) {
    Review updated = reviewService.update(id, dto);
    return ResponseEntity.ok(new ReviewResponseDTO(updated));
  }

  @Operation(summary = "Delete a review")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Review not found"),
      @ApiResponse(responseCode = "400", description = "Not authorized to delete this review")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @PathVariable Long id,
      @RequestParam Long userId) {
    reviewService.delete(id, userId);
    return ResponseEntity.noContent().build();
  }
}
