package com.pertindetu.dev.models;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
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

  @Column(name = "cellphone_number")
  private String cellphoneNumber;

  @Column(nullable = false, updatable = false)
  private Instant dateCreation;

  @Column(nullable = false)
  private boolean active;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "address_id", referencedColumnName = "id")
  @JsonIgnore
  private Address address;

  @Column(columnDefinition = "TEXT")
  private String bio;

  private boolean verified;

  @Column(name = "pix_key")
  private String pixKey;

  @Column(name = "profile_photo_url")
  private String profilePhotoUrl;

  @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Order> clientOrders;

  @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Order> providerOrders;

  public User() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getCellphoneNumber() {
    return cellphoneNumber;
  }

  public void setCellphoneNumber(String cellphoneNumber) {
    this.cellphoneNumber = cellphoneNumber;
  }

  public Instant getDateCreation() {
    return dateCreation;
  }

  public void setDateCreation(Instant dateCreation) {
    this.dateCreation = dateCreation;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public boolean isVerified() {
    return verified;
  }

  public void setVerified(boolean verified) {
    this.verified = verified;
  }

  public String getPixKey() {
    return pixKey;
  }

  public void setPixKey(String pixKey) {
    this.pixKey = pixKey;
  }

  public String getProfilePhotoUrl() {
    return profilePhotoUrl;
  }

  public void setProfilePhotoUrl(String profilePhotoUrl) {
    this.profilePhotoUrl = profilePhotoUrl;
  }

  public List<Order> getClientOrders() {
    return clientOrders;
  }

  public void setClientOrders(List<Order> clientOrders) {
    this.clientOrders = clientOrders;
  }

  public List<Order> getProviderOrders() {
    return providerOrders;
  }

  public void setProviderOrders(List<Order> providerOrders) {
    this.providerOrders = providerOrders;
  }
}