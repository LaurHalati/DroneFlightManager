package com.example.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.io.File;
import java.io.IOException;


@RestController
public class DroneController {

    private final DroneRepository repository;

    DroneController(DroneRepository repository){
        this.repository = repository;
    }
    @GetMapping(value = "/drones")
    List<DronePlan> all(){

        return (List<DronePlan>)repository.findAll();
    }


    @CrossOrigin(origins = "*")
    @PostMapping( value ="/drones",consumes = "application/json")
    DronePlan  newDronePlan (@RequestBody DronePlan newDronePlan) {
        System.out.println(newDronePlan.toString());



        ObjectMapper mapper = new ObjectMapper();

        try {

            // Writing to a file
            mapper.writeValue(new File("C:/Users/halat/Desktop/Licenta/country.json"), newDronePlan );

        } catch (IOException e) {
            e.printStackTrace();
        }

        return repository.save(newDronePlan);
    }
    @GetMapping("/drones/{id}")
    DronePlan one(@PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow(() -> new DroneNotFoundException(id));
    }

    @PutMapping("/drones/{id}")
    DronePlan replaceEmployee(@RequestBody DronePlan newDronePlan, @PathVariable Long id) {

        return repository.findById(id)
                .map(dronePlan -> {
                    dronePlan.setName(newDronePlan.getName());
                    dronePlan.setGeometryType(newDronePlan.getGeometryType());
                    return repository.save(dronePlan);
                })
                .orElseGet(() -> {
                    newDronePlan.setId(id);
                    return repository.save(newDronePlan);
                });
    }

    @DeleteMapping("/drones/{id}")
    void deleteEmployee(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
