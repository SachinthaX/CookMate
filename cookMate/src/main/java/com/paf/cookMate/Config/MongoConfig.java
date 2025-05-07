package com.paf.cookMate.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import com.mongodb.client.MongoClients;

@Configuration
@EnableMongoRepositories(basePackages = "com.paf.cookMate.Repository")
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory() {
        return new SimpleMongoClientDatabaseFactory(MongoClients.create(mongoUri), getDatabaseName());
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoDatabaseFactory());
    }

    private String getDatabaseName() {

        String dbName = "skill_sub3";
        
        if (mongoUri != null && !mongoUri.isEmpty()) {
            int dbNameStart = mongoUri.lastIndexOf("/") + 1;
            int dbNameEnd = mongoUri.indexOf("?", dbNameStart);
            
            if (dbNameStart > 0) {
                if (dbNameEnd > dbNameStart) {
                    dbName = mongoUri.substring(dbNameStart, dbNameEnd);
                } else {
                    dbName = mongoUri.substring(dbNameStart);
                }
            }
        }
        
        return dbName;
    }
} 