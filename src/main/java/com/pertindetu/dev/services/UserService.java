package com.pertindetu.dev.services;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Se estiver usando SecurityConfig com Bean, pode injetar o PasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Address;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.UserRequestDTO;
import com.pertindetu.dev.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // É melhor injetar o Bean configurado no SecurityConfigurations
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found"));
    }

    @Transactional
    public User save(UserRequestDTO dto, Address address) {
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password())); // Encripta senha
        user.setCellphoneNumber(dto.cellphoneNumber());
        user.setRole(dto.role()); // Define o papel (Admin, Client, Provider)
        user.setActive(true);
        user.setDateCreation(Instant.now());
        user.setAddress(address);
        return userRepository.save(user);
    }

    @Transactional
    public User save(UserRequestDTO dto) {
        // Reutiliza lógica criando sem endereço
        return save(dto, null);
    }

    @Transactional
    public User update(Long id, UserRequestDTO dto) {
        User existing = findById(id);
        existing.setName(dto.name());
        existing.setEmail(dto.email());
        existing.setRole(dto.role()); // Atualiza role

        // Só encripta se a senha foi enviada
        if (dto.password() != null && !dto.password().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(dto.password()));
        }
        existing.setCellphoneNumber(dto.cellphoneNumber());

        return userRepository.save(existing);
    }

    @Transactional
    public User deleteById(Long id) {
        User userToDelete = findById(id);
        userRepository.delete(userToDelete);
        return userToDelete;
    }

    @Transactional
    public User toggleUserStatus(Long id) {
        User user = findById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Transactional
    public User becomeProvider(Long userId) {
        User user = findById(userId);
        if (user.getRole() == com.pertindetu.dev.models.enums.UserRole.ADMIN) {
            throw new com.pertindetu.dev.exceptions.BadRequestException("Administradores não podem alterar sua role.");
        }
        user.setRole(com.pertindetu.dev.models.enums.UserRole.PROVIDER);
        return userRepository.save(user);
    }

    public long countTotalUsers() {
        return userRepository.count();
    }

    public long countActiveUsers() {
        return userRepository.countByActiveTrue();
    }
}