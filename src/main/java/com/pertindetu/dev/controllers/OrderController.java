package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.models.dtos.OrderRequestDTO;
import com.pertindetu.dev.models.dtos.OrderResponseDTO;
import com.pertindetu.dev.services.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Endpoints for managing orders")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @Operation(summary = "List all orders")
  @ApiResponse(responseCode = "200", description = "List of orders successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  @GetMapping
  public ResponseEntity<ApiResponseDTO<Page<OrderResponseDTO>>> findAll(
      @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

    Page<OrderResponseDTO> page = orderService.findAll(pageable).map(OrderResponseDTO::new);

    return ResponseEntity.ok(new ApiResponseDTO<>(true, page, null));
  }

  @Operation(summary = "Get an order by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Order found"),
      @ApiResponse(responseCode = "404", description = "Order not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<OrderResponseDTO>> findById(@PathVariable Long id) {
    OrderResponseDTO response = new OrderResponseDTO(orderService.findById(id));
    return ResponseEntity.ok(new ApiResponseDTO<>(true, response, null));
  }

  @Operation(summary = "Create a new order")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "Order created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid order data")
  })
  @PostMapping
  public ResponseEntity<ApiResponseDTO<OrderResponseDTO>> create(@Valid @RequestBody OrderRequestDTO dto) {
    Order saved = orderService.save(dto);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new OrderResponseDTO(saved), null));
  }

  @Operation(summary = "Update an existing order")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Order updated successfully"),
      @ApiResponse(responseCode = "404", description = "Order not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<OrderResponseDTO>> update(@PathVariable Long id,
      @Valid @RequestBody OrderRequestDTO dto) {
    Order updated = orderService.update(id, dto);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new OrderResponseDTO(updated), null));
  }

  @Operation(summary = "Delete an order by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Order deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Order not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<Void>> delete(@PathVariable Long id) {
    orderService.deleteById(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, null, null));
  }
}