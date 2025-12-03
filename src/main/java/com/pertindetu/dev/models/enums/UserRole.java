package com.pertindetu.dev.models.enums;

public enum UserRole {
    ADMIN("admin"),
    CLIENT("client"),
    PROVIDER("provider");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}