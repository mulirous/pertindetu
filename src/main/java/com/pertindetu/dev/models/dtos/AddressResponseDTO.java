package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;

import com.pertindetu.dev.models.Address;

/**
 * DTO returned to clients. Constructed from Address entity.
 */
public record AddressResponseDTO(
    Long id,
    String publicPlace,
    Long number,
    String neighborhood,
    String city,
    String federativeUnit,
    String cep,
    BigDecimal latitude,
    BigDecimal longitude) {
  public AddressResponseDTO(Address address) {
    this(
        address.getId(),
        address.getStreet(),
        address.getNumber(),
        address.getNeighborhood(),
        address.getCity(),
        address.getFederativeUnit(),
        address.getPostalCode(),
        address.getLatitude(),
        address.getLongitude());
  }
}