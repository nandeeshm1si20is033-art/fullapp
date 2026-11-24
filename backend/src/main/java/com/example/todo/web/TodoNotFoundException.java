package com.example.todo.web;

public class TodoNotFoundException extends RuntimeException {
    public TodoNotFoundException(Long id) {
        super("Todo " + id + " not found");
    }
}
