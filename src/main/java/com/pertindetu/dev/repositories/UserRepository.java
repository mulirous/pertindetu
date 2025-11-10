package com.pertindetu.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pertindetu.dev.models.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countByActiveTrue();

}
