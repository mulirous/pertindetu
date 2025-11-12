package com.pertindetu.dev.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.models.Address;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.auth.LoginRequestDTO;
import com.pertindetu.dev.models.dtos.auth.LoginResponseDTO;
import com.pertindetu.dev.models.dtos.auth.RegisterRequestDTO;
import com.pertindetu.dev.models.dtos.auth.RegisterResponseDTO;
import com.pertindetu.dev.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AuthService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private UserService userService;

  @Autowired
  private AddressService addressService;

  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public LoginResponseDTO login(LoginRequestDTO dto) {
    String email = dto.email();
    String password = dto.password();

    // Check if the user exists
    User user = userRepository.findByEmail(email);

    if (user == null) {
      return new LoginResponseDTO(404, "User not found", null);
    }

    // Verify the password
    if (!passwordEncoder.matches(password, user.getPassword())) {
      return new LoginResponseDTO(401, "Invalid password", null);
    }

    return new LoginResponseDTO(200, "Login successful", user.getId());
  }

  @Transactional
  public RegisterResponseDTO register(RegisterRequestDTO dto) {
    try {
      // Check if user already exists
      if (userRepository.findByEmail(dto.user().email()) != null) {
        return new RegisterResponseDTO(409, "User already exists", null);
      }

      // Primeiro cria o endereço
      Address address = addressService.save(dto.address(), null);
      if (address == null) {
        return new RegisterResponseDTO(400, "Error creating address", null);
      }

      // Depois cria o usuário com o endereço
      User user = userService.save(dto.user(), address);
      if (user == null) {
        addressService.deleteById(address.getId());
        return new RegisterResponseDTO(400, "Error creating user", null);
      }

      // Atualiza o endereço com o usuário
      address.setUser(user);
      addressService.update(address.getId(), dto.address());

      return new RegisterResponseDTO(201, "User registered successfully", user.getId());

    } catch (Exception e) {
      return new RegisterResponseDTO(500, "Internal server error: " + e.getMessage(), null);
    }
  }

}