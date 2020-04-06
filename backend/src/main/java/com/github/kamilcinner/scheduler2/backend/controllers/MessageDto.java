package com.github.kamilcinner.scheduler2.backend.controllers;

public class MessageDto {
    private String message;

    public MessageDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
