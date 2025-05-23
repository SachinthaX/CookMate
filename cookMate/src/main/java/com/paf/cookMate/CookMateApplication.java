package com.paf.cookMate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class CookMateApplication {

    public static void main(String[] args) {
        SpringApplication.run(CookMateApplication.class, args);
		System.out.println("SERVER STARTED!");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
