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

import com.pertindetu.dev.models.Payment;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.models.dtos.PaymentRequestDTO;
import com.pertindetu.dev.models.dtos.PaymentResponseDTO;
import com.pertindetu.dev.services.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
@Tag(name = "Payments", description = "Endpoints for managing payments and transactions")
public class PaymentController {

  @Autowired
  private PaymentService paymentService;

  @Operation(summary = "List all payments")
  @ApiResponse(responseCode = "200", description = "List of payments successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  @GetMapping
  public ResponseEntity<ApiResponseDTO<Page<PaymentResponseDTO>>> findAll(
      @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

    Page<PaymentResponseDTO> page = paymentService.findAll(pageable).map(PaymentResponseDTO::new);

    return ResponseEntity.ok(new ApiResponseDTO<>(true, page, null));
  }

  @Operation(summary = "Get a payment by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Payment found"),
      @ApiResponse(responseCode = "404", description = "Payment not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<PaymentResponseDTO>> findById(@PathVariable Long id) {
    PaymentResponseDTO response = new PaymentResponseDTO(paymentService.findById(id));
    return ResponseEntity.ok(new ApiResponseDTO<>(true, response, null));
  }

  @Operation(summary = "Create a new payment")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "Payment created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid payment data")
  })
  @PostMapping
  public ResponseEntity<ApiResponseDTO<PaymentResponseDTO>> create(@Valid @RequestBody PaymentRequestDTO dto) {
    Payment saved = paymentService.save(dto);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new PaymentResponseDTO(saved), null));
  }

  @Operation(summary = "Update an existing payment")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Payment updated successfully"),
      @ApiResponse(responseCode = "404", description = "Payment not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<PaymentResponseDTO>> update(@PathVariable Long id,
      @Valid @RequestBody PaymentRequestDTO dto) {
    Payment updated = paymentService.update(id, dto);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new PaymentResponseDTO(updated), null));
  }

  @Operation(summary = "Delete a payment by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Payment deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Payment not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<Void>> delete(@PathVariable Long id) {
    paymentService.deleteById(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, null, null));
  }
}