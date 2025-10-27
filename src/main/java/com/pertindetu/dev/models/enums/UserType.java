package com.pertindetu.dev.models.enums;


public enum UserType {
    CLIENT("CLIENT"),
    PROVIDER("PROVIDER"),
    ADMIN("ADMIN");

  private final String value;

  private UserType(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public static UserType fromString(String type) {
    for (UserType t : UserType.values()) {
        if (t.getValue().equalsIgnoreCase(type)) {
            return t;
        }
    }
    throw new IllegalArgumentException("Invalid user type: " + type);
  }

}
