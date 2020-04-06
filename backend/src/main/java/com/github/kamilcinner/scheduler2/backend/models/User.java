package com.github.kamilcinner.scheduler2.backend.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String username;
    private String password;

    protected User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return String.format(
                "User[id=%d, username=%s",
                id, username
        );
    }

    public Long getId() {
        return id;
    }
    public String getUsername() {
        return username;
    }
}
