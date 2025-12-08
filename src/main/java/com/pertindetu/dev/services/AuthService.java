package com.pertindetu.dev.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

    @Autowired
    private TokenService tokenService; // A classe que cria o JWT

    @Autowired
    private ApplicationContext context; // Para pegar o AuthenticationManager sem ciclo de dependência

    public LoginResponseDTO login(LoginRequestDTO dto) {
        AuthenticationManager authenticationManager = context.getBean(AuthenticationManager.class);
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.email(), dto.password());
        var auth = authenticationManager.authenticate(usernamePassword);
        User user = (User) auth.getPrincipal();
        var token = tokenService.generateToken(user.getUsername());
        return new LoginResponseDTO(token, user.getId());
    }

    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO dto) {
        try {
            if (userRepository.findByEmail(dto.user().email()) != null) {
                // Como o controller espera um DTO de resposta, mantivemos sua lógica de retorno de erro manual
                // O ideal em REST é lançar exceção e tratar no ControllerAdvice, mas mantive sua estrutura:
                return new RegisterResponseDTO(409, "User already exists", null);
            }

            // 1. Cria Endereço
            Address address = addressService.save(dto.address(), null);
            if (address == null) {
                return new RegisterResponseDTO(400, "Error creating address", null);
            }

            // 2. Cria Usuário com Endereço (UserService já encripta a senha e define Role)
            User user = userService.save(dto.user(), address);

            if (user == null) {
                addressService.deleteById(address.getId());
                return new RegisterResponseDTO(400, "Error creating user", null);
            }

            // 3. Atualiza Endereço com Usuário (Bidirecional)
            address.setUser(user);
            addressService.update(address.getId(), dto.address());

            return new RegisterResponseDTO(201, "User registered successfully", user.getId());

        } catch (Exception e) {
            return new RegisterResponseDTO(500, "Internal server error: " + e.getMessage(), null);
        }
    }
}