package com.example.demo;


import org.springframework.data.elasticsearch.annotations.*;
import org.springframework.data.elasticsearch.core.geo.GeoJsonPolygon;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;
import java.util.Objects;


@Document(indexName = "drone-plan-laurentiu")
public class DronePlan {
    @Id
    @GeneratedValue
    private String id;
    private String name;
    @GeoShapeField
    private GeoJsonPolygon geometry;
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd'T'HH:mm")
    private Date startTime;
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd'T'HH:mm")

    private Date endTime;

    public DronePlan() {

    }

    public DronePlan(String id, String name, GeoJsonPolygon geometry, Date startTime, Date endTime) {
        this.id = id;
        this.name = name;
        this.geometry = geometry;
        this.startTime = startTime;
        this.endTime = endTime;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GeoJsonPolygon getGeometry() {
        return geometry;
    }

    public void setGeometry(GeoJsonPolygon geometry) {
        this.geometry = geometry;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DronePlan dronePlan = (DronePlan) o;
        return Objects.equals(id, dronePlan.id) && Objects.equals(name, dronePlan.name) && Objects.equals(geometry, dronePlan.geometry) && Objects.equals(startTime, dronePlan.startTime) && Objects.equals(endTime, dronePlan.endTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, geometry, startTime, endTime);
    }

    @Override
    public String toString() {
        return "DronePlan{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", geometry=" + geometry +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}
