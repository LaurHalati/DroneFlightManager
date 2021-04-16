package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static javax.print.attribute.standard.MediaSizeName.D;

//@Configuration
//class LoadDatabase {
//
//    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);
//
//    @Bean
//    CommandLineRunner initDatabase(DroneRepository repository) {
//
//        return args -> {
//            log.info("Preloading " + repository.save(new DronePlan("null", "null",[[D@34580e44], [D@30441526], [D@3e346e3e]])));
//        };
//    }
//}