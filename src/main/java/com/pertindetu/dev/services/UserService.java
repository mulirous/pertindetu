package com.pertindetu.dev.services;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.UserRequestDTO;
import com.pertindetu.dev.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public List<User> findAll() {
    return userRepository.findAll();
  }

  public User findById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found"));
  }

  @Transactional
  public User save(UserRequestDTO dto) {
    User user = new User();
    user.setName(dto.name());
    user.setEmail(dto.email());
    user.setPassword(passwordEncoder.encode(dto.password()));
    user.setCellphoneNumber(dto.cellphoneNumber());
    user.setActive(true);
    user.setDateCreation(Instant.now());
    return userRepository.save(user);
  }

  @Transactional
  public User update(Long id, UserRequestDTO dto) {
    User existing = findById(id);
    existing.setName(dto.name());
    existing.setEmail(dto.email());

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
}