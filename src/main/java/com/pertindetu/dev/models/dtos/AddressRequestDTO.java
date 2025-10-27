  package com.pertindetu.dev.models.dtos;

  import java.math.BigDecimal;

  import jakarta.validation.constraints.NotBlank;
  import jakarta.validation.constraints.NotNull;
  import jakarta.validation.constraints.Size;

/**
 * DTO for creating/updating Address.
 * Validation messages are in English to keep the API standardized.
 */
public record AddressRequestDTO(

    @NotBlank(message = "Street is required")
    String street,

    @NotNull(message = "Number is required")
    Long number,

    @NotBlank(message = "Neighborhood is required")
    String neighborhood,

    @NotBlank(message = "City is required")
    String city,

    @NotBlank(message = "Federative unit (state) is required")
    @Size(min = 2, max = 2, message = "Federative unit must have 2 characters")
    String federativeUnit,

    @NotBlank(message = "Postal code (CEP) is required")
    @Size(min = 8, max = 8, message = "Postal code (CEP) must have 8 characters")
    String postalCode,

    BigDecimal latitude,
    BigDecimal longitude

) {}
