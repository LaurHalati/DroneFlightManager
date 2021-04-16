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
    //@CrossOrigin(origins = "*")
    @GetMapping(value = "/drones")
    DronePlan all(){

        return (DronePlan) repository;
    }


    @CrossOrigin(origins = "*")
    @PostMapping( value ="/drones",consumes = "application/json")
    DronePlan  newDronePlan (@RequestBody DronePlan newDronePlan) {
        System.out.println(newDronePlan.toString());
//        double[][] d = newDronePlan.getCoordinates();
//        String[] parts = Arrays.deepToString(d).split(",");
//        parts[0] = parts[0].substring(2,parts[0].length());
//        parts[parts.length-1]= parts[parts.length-1].substring(0, parts[parts.length-1].length()-2);
//
//        for (int i=1;i<parts.length-2;i+=2) {
//                parts[i] = parts[i].substring(0, parts[i].length() - 1);
//                parts[i+1] = parts[i+1].substring(2);
//
//        }
//
//        double coordonate [][] = new double [parts.length/2][2];
//        for( int i=0;i<parts.length;i++){
//            int j=i/2;
//            if(i%2==0)
//                coordonate[j][0]= Double.parseDouble(parts[i]);
//            else
//                coordonate[j][1]= Double.parseDouble(parts[i]);
//        }
//        for (int i =0 ;i<coordonate.length;i++) {
//            for (int j = 0; j < 2; j++){
//                System.out.print(coordonate[i][j]+" ");
//        }
//            System.out.println(" ");
//        }


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
