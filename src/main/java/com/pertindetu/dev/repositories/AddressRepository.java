package com.pertindetu.dev.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.Address;

public interface AddressRepository extends JpaRepository<Address, Long>{
  
}
