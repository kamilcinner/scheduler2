package com.github.kamilcinner.scheduler2.backend.addons;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;

public class PollubParser {
    ArrayList<Subject> subjects = new ArrayList<>();

    public PollubParser() {
        parse();
    }

    void parse() {
        Document doc;
        try {
            doc = Jsoup.connect("http://we1.pollub.pl/ats4/plan.php?type=0&id=6200&winW=943&winH=852&loadBG=000000").get();
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        Elements coursedivs = doc.getElementsByClass("coursediv");
        for (Element cd : coursedivs) {
            final String text = cd.text();
            if (text.length() < 1) continue;
            int lecturerAndClassPosition = 0;

            String name;
            String lecturer;
            String class_;
            String timeStart;
            String timeEnd;

            // Get name of the Subject.
            final int commaPosition = text.lastIndexOf(",");
            name = text.substring(0, commaPosition);
            final String name2 = text.substring(commaPosition + 2);
            String type = "none";
            if (name2.startsWith("wy") || name2.startsWith("ćw")) {
                if (name2.startsWith("ćw Centrum")) {
                    type = "wf";
                } else {
                    type = "wy/ćw";
                }
                lecturerAndClassPosition = commaPosition + 5;
            } else if (name2.startsWith("lab")) {
                type = "lab";
                lecturerAndClassPosition = commaPosition + 6;
            } else if (name2.startsWith("lekt")) {
                type = "lekt";
                lecturerAndClassPosition = commaPosition + 7;
            }

            if (type.equals("none")) continue;

            name += text.substring(commaPosition, lecturerAndClassPosition - 1);

            // Get time of the Subject.
            final int timePosition = text.length() - 13;
            final String timeString = text.substring(timePosition);
            timeStart = timeString.substring(0, 5);
            timeEnd = timeString.substring(8);

            String lecturerAndClass = text.substring(lecturerAndClassPosition, timePosition - 1);

            if (type.equals("wf")) {
                lecturer = "Enter Your lecturer name";
                class_ = lecturerAndClass;
            } else if (type.equals("lekt")) {
                lecturer = "Enter Your lecturer name";
                class_ = "Enter Your classroom name";
            } else {
                // Get class of the Subject.
                int classPosition = lecturerAndClass.lastIndexOf(" ") + 1;
                class_ = lecturerAndClass.substring(classPosition);

                // Get lecturer of the Subject.
                lecturer = lecturerAndClass.substring(0, classPosition - 1);
            }

            subjects.add(new Subject(name, lecturer, class_, timeStart, timeEnd));
        }
    }

    public ArrayList<Subject> getSubjects() {
        return subjects;
    }
}
