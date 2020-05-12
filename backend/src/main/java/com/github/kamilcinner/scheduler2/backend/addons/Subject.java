package com.github.kamilcinner.scheduler2.backend.addons;

import lombok.Data;

@Data
public class Subject {
    String name;
    String lecturer;
    String class_;
    String timeStart;
    String timeEnd;

    Subject(String name, String lecturer, String class_, String timeStart, String timeEnd) {
        this.name = name;
        this.lecturer = lecturer;
        this.class_ = class_;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
    }
}
