package com.pertindetu.dev.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Address;
import com.pertindetu.dev.models.dtos.AddressRequestDTO;
import com.pertindetu.dev.repositories.AddressRepository;

import jakarta.transaction.Transactional;

@Service
public class AddressService {

  @Autowired
  private AddressRepository addressRepository;

  public List<Address> findAll() {
    return addressRepository.findAll();
  }

  public Address findById(Long id) {
    return addressRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Address with ID " + id + " not found."));
  }

  @Transactional
  public Address save(AddressRequestDTO dto) {
    Address address = new Address();
    copyDtoToEntity(dto, address);
    return addressRepository.save(address);
  }

  @Transactional
  public Address update(Long id, AddressRequestDTO dto) {
    Address existing = findById(id);
    copyDtoToEntity(dto, existing);
    return addressRepository.save(existing);
  }

  @Transactional
  public void deleteById(Long id) {
    if (!addressRepository.existsById(id)) {
      throw new ResourceNotFoundException("Address with ID " + id + " not found.");
    }
    addressRepository.deleteById(id);
  }

  private void copyDtoToEntity(AddressRequestDTO dto, Address address) {
    address.setStreet(dto.street());
    address.setNumber(dto.number());
    address.setNeighborhood(dto.neighborhood());
    address.setCity(dto.city());
    address.setFederativeUnit(dto.federativeUnit());
    address.setPostalCode(dto.postalCode());
    address.setLatitude(dto.latitude());
    address.setLongitude(dto.longitude());
  }

}
