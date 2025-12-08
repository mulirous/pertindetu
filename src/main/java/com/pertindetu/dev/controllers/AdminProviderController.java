package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.dtos.ProviderProfileResponseDTO;
import com.pertindetu.dev.services.ProviderProfileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/admin/providers")
@Tag(name = "Admin - Providers", description = "Endpoints para administração de prestadores")
public class AdminProviderController {

    @Autowired
    private ProviderProfileService providerProfileService;

    @Operation(summary = "Listar todos os prestadores", description = "Retorna lista paginada de todos os prestadores")
    @GetMapping
    public ResponseEntity<Page<ProviderProfileResponseDTO>> getAllProviders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<ProviderProfile> providers = providerProfileService.findAll(pageable);
        Page<ProviderProfileResponseDTO> dtoPage = providers.map(ProviderProfileResponseDTO::new);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Buscar prestador por ID", description = "Retorna detalhes de um prestador específico")
    @GetMapping("/{id}")
    public ResponseEntity<ProviderProfileResponseDTO> getProviderById(@PathVariable Long id) {
        ProviderProfile provider = providerProfileService.findById(id);
        return ResponseEntity.ok(new ProviderProfileResponseDTO(provider));
    }

    @Operation(summary = "Verificar/Desverificar prestador", description = "Alterna o status de verificação de um prestador")
    @PatchMapping("/{id}/toggle-verification")
    public ResponseEntity<ProviderProfileResponseDTO> toggleVerification(@PathVariable Long id) {
        ProviderProfile updatedProvider = providerProfileService.toggleVerification(id);
        return ResponseEntity.ok(new ProviderProfileResponseDTO(updatedProvider));
    }

    @Operation(summary = "Excluir prestador", description = "Remove permanentemente um prestador do sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        providerProfileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Total de prestadores", description = "Retorna o total de prestadores cadastrados")
    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalProviders() {
        long total = providerProfileService.countTotalProviders();
        return ResponseEntity.ok(total);
    }

    @Operation(summary = "Total de prestadores verificados", description = "Retorna o total de prestadores verificados")
    @GetMapping("/stats/verified")
    public ResponseEntity<Long> getVerifiedProviders() {
        long verified = providerProfileService.countVerifiedProviders();
        return ResponseEntity.ok(verified);
    }
}
