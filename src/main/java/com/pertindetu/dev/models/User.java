package com.pertindetu.dev.models;

import java.time.Instant;

import com.pertindetu.dev.models.enums.UserType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  private String cellphoneNumber;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserType type;

  @Column(nullable = false, updatable = false)
  private Instant dateCreation;

  @Column(nullable = false)
  private boolean active;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "address_id", referencedColumnName = "id")
  private Address address;
  
  public User(){}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCellphoneNumber() { return cellphoneNumber; }
    public void setCellphoneNumber(String cellphoneNumber) { this.cellphoneNumber = cellphoneNumber; }

    public UserType getType() { return type; }
    public void setType(UserType type) { this.type = type; }

    public Instant getDateCreation() { return dateCreation; }
    public void setDateCreation(Instant dateCreation) { this.dateCreation = dateCreation; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

}