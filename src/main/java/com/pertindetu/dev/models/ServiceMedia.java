package com.pertindetu.dev.models;

import com.pertindetu.dev.models.enums.MediaType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "service_media")
public class ServiceMedia {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private MediaType type;

  @Column(columnDefinition = "TEXT")
  private String mediaUrl;

  @Column(columnDefinition = "TEXT")
  private String shortDescription;

  @Column(name = "display_order", nullable = false)
  private Long order;

  @ManyToOne
  @JoinColumn(name = "service_id", nullable = false)
  private Service service;

}