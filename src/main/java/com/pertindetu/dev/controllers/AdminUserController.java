package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pertindetu.dev.models.User;
import com.pertindetu.dev.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/admin/users")
@Tag(name = "Admin - Users", description = "Endpoints para administração de usuários")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Listar todos os usuários", description = "Retorna lista paginada de todos os usuários do sistema")
    @GetMapping
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<User> users = userService.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Buscar usuário por ID", description = "Retorna detalhes de um usuário específico")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Ativar/Desativar usuário", description = "Alterna o status ativo/inativo de um usuário")
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        User updatedUser = userService.toggleUserStatus(id);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Excluir usuário", description = "Remove permanentemente um usuário do sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Total de usuários", description = "Retorna o total de usuários cadastrados")
    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalUsers() {
        long total = userService.countTotalUsers();
        return ResponseEntity.ok(total);
    }

    @Operation(summary = "Total de usuários ativos", description = "Retorna o total de usuários ativos")
    @GetMapping("/stats/active")
    public ResponseEntity<Long> getActiveUsers() {
        long active = userService.countActiveUsers();
        return ResponseEntity.ok(active);
    }
}
