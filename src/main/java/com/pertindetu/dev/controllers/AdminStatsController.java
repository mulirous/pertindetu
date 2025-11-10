package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pertindetu.dev.services.OrderService;
import com.pertindetu.dev.services.ProviderProfileService;
import com.pertindetu.dev.services.ServiceService;
import com.pertindetu.dev.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/stats")
@Tag(name = "Admin - Statistics", description = "Endpoints para estatísticas administrativas")
public class AdminStatsController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProviderProfileService providerProfileService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private OrderService orderService;

    @Operation(summary = "Dashboard completo", description = "Retorna todas as estatísticas do sistema")
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Users stats
        stats.put("totalUsers", userService.countTotalUsers());
        stats.put("activeUsers", userService.countActiveUsers());
        
        // Providers stats
        stats.put("totalProviders", providerProfileService.countTotalProviders());
        stats.put("verifiedProviders", providerProfileService.countVerifiedProviders());
        
        // Services stats
        stats.put("totalServices", serviceService.countTotalServices());
        stats.put("activeServices", serviceService.countActiveServices());
        
        // Orders stats
        stats.put("totalOrders", orderService.countAllOrders());
        stats.put("pendingOrders", orderService.countOrdersByStatus("PENDING"));
        stats.put("completedOrders", orderService.countOrdersByStatus("COMPLETED"));
        
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Estatísticas de usuários", description = "Retorna estatísticas sobre usuários")
    @GetMapping("/users")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", userService.countTotalUsers());
        stats.put("active", userService.countActiveUsers());
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Estatísticas de prestadores", description = "Retorna estatísticas sobre prestadores")
    @GetMapping("/providers")
    public ResponseEntity<Map<String, Long>> getProviderStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", providerProfileService.countTotalProviders());
        stats.put("verified", providerProfileService.countVerifiedProviders());
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Estatísticas de serviços", description = "Retorna estatísticas sobre serviços")
    @GetMapping("/services")
    public ResponseEntity<Map<String, Long>> getServiceStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", serviceService.countTotalServices());
        stats.put("active", serviceService.countActiveServices());
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Estatísticas de pedidos", description = "Retorna estatísticas sobre pedidos")
    @GetMapping("/orders")
    public ResponseEntity<Map<String, Long>> getOrderStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", orderService.countAllOrders());
        stats.put("pending", orderService.countOrdersByStatus("PENDING"));
        stats.put("accepted", orderService.countOrdersByStatus("ACCEPTED"));
        stats.put("inProgress", orderService.countOrdersByStatus("IN_PROGRESS"));
        stats.put("completed", orderService.countOrdersByStatus("COMPLETED"));
        stats.put("cancelled", orderService.countOrdersByStatus("CANCELLED"));
        stats.put("rejected", orderService.countOrdersByStatus("REJECTED"));
        return ResponseEntity.ok(stats);
    }
}
