package com.pertindetu.dev.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.pertindetu.dev.models.Address;
import com.pertindetu.dev.models.dtos.AddressRequestDTO;
import com.pertindetu.dev.models.dtos.AddressResponseDTO;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.services.AddressService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("address")
@CrossOrigin(origins = "*")
public class AddressController {
    
    @Autowired
    private AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<AddressResponseDTO>>> getAll() {
        List<AddressResponseDTO> addresses = addressService.findAll()
                .stream()
                .map(AddressResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponseDTO<>(true, addresses, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<AddressResponseDTO>> getById(@PathVariable Long id) {
        Address address = addressService.findById(id);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, new AddressResponseDTO(address), null));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<AddressResponseDTO>> create(
            @Valid @RequestBody AddressRequestDTO request) {

        Address created = addressService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDTO<>(true, new AddressResponseDTO(created), null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<AddressResponseDTO>> update(
            @PathVariable Long id, @Valid @RequestBody AddressRequestDTO request) {

        Address updated = addressService.update(id, request);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, new AddressResponseDTO(updated), null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<String>> delete(@PathVariable Long id) {
        addressService.deleteById(id);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Address deleted successfully.", null));
    }
}
