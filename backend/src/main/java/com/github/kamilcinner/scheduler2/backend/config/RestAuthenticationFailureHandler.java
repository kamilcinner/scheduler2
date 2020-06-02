package com.github.kamilcinner.scheduler2.backend.config;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class RestAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        response.getOutputStream().print(
                "{\"errors\":[" +
                    "{\"field\": \"username\"," +
                    "\"defaultMessage\": \"Username or password is invalid.\"}," +

                    "{\"field\": \"password\"," +
                    "\"defaultMessage\": \"Username or password is invalid.\"}" +
                "]}"
        );

        response.setStatus(400);
    }
}
