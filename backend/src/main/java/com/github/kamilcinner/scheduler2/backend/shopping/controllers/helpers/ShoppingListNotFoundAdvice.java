package com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.ShoppingListController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ShoppingListNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(ShoppingListNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String shoppingListNotFoundHandler(ShoppingListNotFoundException e) {
        return e.getMessage();
    }
}
