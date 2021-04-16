package com.example.demo;

 class DroneNotFoundException extends RuntimeException {
    DroneNotFoundException(Long id) {
         super("Could not find drone plan " + id);

     }
}
