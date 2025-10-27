package com.pertindetu.dev.models.dtos;

public class ApiResponseDTO<T> {
    private boolean success;
    private T data;
    private String error;

    public ApiResponseDTO(boolean success, T data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public boolean isSuccess() { return success; }
    public T getData() { return data; }
    public String getError() { return error; }
}

