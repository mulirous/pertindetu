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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.dtos.OrderRequestDTO;
import com.pertindetu.dev.models.dtos.OrderResponseDTO;
import com.pertindetu.dev.models.dtos.OrderUpdateStatusDTO;
import com.pertindetu.dev.models.enums.OrderStatus;
import com.pertindetu.dev.services.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Endpoints for managing orders between clients and providers")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @Operation(summary = "List all orders (admin only)")
  @ApiResponse(responseCode = "200", description = "List of orders successfully retrieved")
  @GetMapping
  public ResponseEntity<Page<OrderResponseDTO>> findAll(
      @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

    Page<OrderResponseDTO> page = orderService.findAll(pageable).map(OrderResponseDTO::new);
    return ResponseEntity.ok(page);
  }

  @Operation(summary = "Get order by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Order found"),
      @ApiResponse(responseCode = "404", description = "Order not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<OrderResponseDTO> findById(@PathVariable Long id) {
    Order order = orderService.findById(id);
    return ResponseEntity.ok(new OrderResponseDTO(order));
  }

  @Operation(summary = "Get orders by client ID (paginated)")
  @ApiResponse(responseCode = "200", description = "Client orders retrieved successfully")
  @GetMapping("/client/{clientId}")
  public ResponseEntity<Page<OrderResponseDTO>> findByClientId(
      @PathVariable Long clientId,
      @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

    Page<OrderResponseDTO> page = orderService.findByClientId(clientId, pageable)
        .map(OrderResponseDTO::new);
    return ResponseEntity.ok(page);
  }

  @Operation(summary = "Get orders by provider ID (paginated)")
  @ApiResponse(responseCode = "200", description = "Provider orders retrieved successfully")
  @GetMapping("/provider/{providerId}")
  public ResponseEntity<Page<OrderResponseDTO>> findByProviderId(
      @PathVariable Long providerId,
      @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

    Page<OrderResponseDTO> page = orderService.findByProviderId(providerId, pageable)
        .map(OrderResponseDTO::new);
    return ResponseEntity.ok(page);
  }

  @Operation(summary = "Get orders by status (paginated)")
  @ApiResponse(responseCode = "200", description = "Orders filtered by status")
  @GetMapping("/status/{status}")
  public ResponseEntity<Page<OrderResponseDTO>> findByStatus(
      @PathVariable OrderStatus status,
      @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

    Page<OrderResponseDTO> page = orderService.findByStatus(status, pageable)
        .map(OrderResponseDTO::new);
    return ResponseEntity.ok(page);
  }

  @Operation(summary = "Create a new order")
  @ApiResponse(responseCode = "201", description = "Order created successfully")
  @PostMapping
  public ResponseEntity<OrderResponseDTO> create(@Valid @RequestBody OrderRequestDTO dto) {
    Order created = orderService.save(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(new OrderResponseDTO(created));
  }

  @Operation(summary = "Update order status (provider only)")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Order status updated successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid status transition"),
      @ApiResponse(responseCode = "403", description = "Only the provider can update status"),
      @ApiResponse(responseCode = "404", description = "Order not found")
  })
  @PatchMapping("/{id}/status")
  public ResponseEntity<OrderResponseDTO> updateStatus(
      @PathVariable Long id,
      @Valid @RequestBody OrderUpdateStatusDTO dto,
      @RequestParam Long providerId) {

    Order updated = orderService.updateStatus(id, dto, providerId);
    return ResponseEntity.ok(new OrderResponseDTO(updated));
  }

  @Operation(summary = "Cancel order (client only)")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Order cancelled successfully"),
      @ApiResponse(responseCode = "400", description = "Cannot cancel order in current status"),
      @ApiResponse(responseCode = "403", description = "Only the client can cancel"),
      @ApiResponse(responseCode = "404", description = "Order not found")
  })
  @PatchMapping("/{id}/cancel")
  public ResponseEntity<OrderResponseDTO> cancelOrder(
      @PathVariable Long id,
      @RequestParam Long clientId) {

    Order cancelled = orderService.cancelOrder(id, clientId);
    return ResponseEntity.ok(new OrderResponseDTO(cancelled));
  }

  @Operation(summary = "Delete order by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "Order deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Order not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    orderService.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
