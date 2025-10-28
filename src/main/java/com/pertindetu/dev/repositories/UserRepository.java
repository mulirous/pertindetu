package com.pertindetu.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
