package com.example.demo;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
 interface DroneRepository extends ElasticsearchRepository<DronePlan,Long> {

}