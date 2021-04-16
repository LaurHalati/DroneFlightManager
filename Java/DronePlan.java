package com.example.demo;

import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.lang.annotation.Documented;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Document(indexName="name")
public class DronePlan {
    private @Id @GeneratedValue Long id;
    private String name;
    private String geometryType;
    @ElementCollection()
    private List<List<Double>> coordinates;
    public DronePlan(){

    }
    public DronePlan(Long id, String name, String geometryType, List<List<Double>> coordinates) {
        this.id = id;
        this.name = name;
        this.geometryType = geometryType;
        this.coordinates = coordinates;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public List<List<Double>> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<List<Double>> coordinates) {
        this.coordinates = coordinates;
    }

    @Override
    public String toString() {
        return "DronePlan{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", geometryType='" + geometryType + '\'' +
                ", coordinates=" + coordinates +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DronePlan dronePlan = (DronePlan) o;
        return Objects.equals(id, dronePlan.id) && Objects.equals(name, dronePlan.name) && Objects.equals(geometryType, dronePlan.geometryType) && Objects.equals(coordinates, dronePlan.coordinates);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, geometryType, coordinates);
    }
}
