package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pertindetu.dev.models.Service;
import com.pertindetu.dev.services.ServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/admin/services")
@Tag(name = "Admin - Services", description = "Endpoints para administração de serviços")
public class AdminServiceController {

    @Autowired
    private ServiceService serviceService;

    @Operation(summary = "Listar todos os serviços", description = "Retorna lista paginada de todos os serviços do sistema")
    @GetMapping
    public ResponseEntity<Page<Service>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<Service> services = serviceService.findAll(pageable);
        return ResponseEntity.ok(services);
    }

    @Operation(summary = "Buscar serviço por ID", description = "Retorna detalhes de um serviço específico")
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Service service = serviceService.findById(id);
        return ResponseEntity.ok(service);
    }

    @Operation(summary = "Ativar/Desativar serviço", description = "Alterna o status ativo/inativo de um serviço")
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Service> toggleServiceStatus(@PathVariable Long id) {
        Service updatedService = serviceService.toggleServiceStatus(id);
        return ResponseEntity.ok(updatedService);
    }

    @Operation(summary = "Excluir serviço", description = "Remove permanentemente um serviço do sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Total de serviços", description = "Retorna o total de serviços cadastrados")
    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalServices() {
        long total = serviceService.countTotalServices();
        return ResponseEntity.ok(total);
    }

    @Operation(summary = "Total de serviços ativos", description = "Retorna o total de serviços ativos")
    @GetMapping("/stats/active")
    public ResponseEntity<Long> getActiveServices() {
        long active = serviceService.countActiveServices();
        return ResponseEntity.ok(active);
    }
}
