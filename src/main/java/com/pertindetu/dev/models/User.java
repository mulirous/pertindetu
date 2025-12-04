package com.pertindetu.dev.models;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pertindetu.dev.models.enums.UserRole;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
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
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "users")
public class User implements UserDetails {

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
    private boolean active = true; // Padrão como ativo ao criar

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    @JsonIgnore
    private Address address;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders;

    // Construtor utilitário para o registro (AuthService)
    public User(String name, String email, String password, String cellphoneNumber, UserRole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.cellphoneNumber = cellphoneNumber;
        this.role = role;
        this.active = true;
    }

    // Garante que a data de criação seja salva automaticamente antes de inserir no banco
    @PrePersist
    public void prePersist() {
        if (this.dateCreation == null) {
            this.dateCreation = Instant.now();
        }
    }

    // --- MÉTODOS DO USERDETAILS ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Define as permissões baseadas no Enum
        if (this.role == UserRole.ADMIN) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_CLIENT"),
                    new SimpleGrantedAuthority("ROLE_PROVIDER")
            );
        } else if (this.role == UserRole.PROVIDER) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_PROVIDER"),
                    new SimpleGrantedAuthority("ROLE_USER") // Opcional, se quiser uma role genérica
            );
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));
        }
    }

    @Override
    public String getUsername() {
        return email; // Importante: O Spring Security usará o EMAIL como login
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.active; // Usa seu campo 'active' para bloquear login se necessário
    }
}