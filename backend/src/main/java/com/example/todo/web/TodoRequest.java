package com.example.todo.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Body for creating or updating a todo. "completed" is optional on create. */
public record TodoRequest(
        @NotBlank(message = "Title must not be empty")
        @Size(max = 255, message = "Title must be at most 255 characters")
        String title,
        Boolean completed) {}
