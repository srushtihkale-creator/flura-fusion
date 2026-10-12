package com.florafusion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/health", "/health"})
@RequiredArgsConstructor
@Tag(name = "Health", description = "System health check endpoints")
public class HealthController {

    private final DataSource dataSource;

    @GetMapping
    @Operation(summary = "Check backend and database health status")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "flora-fusion-backend");
        response.put("timestamp", Instant.now().toString());

        boolean dbConnected = false;
        try (Connection conn = dataSource.getConnection()) {
            dbConnected = conn.isValid(2);
        } catch (Exception ignored) {
            dbConnected = false;
        }

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");
        details.put("databaseType", "PostgreSQL");

        response.put("details", details);

        if (!dbConnected) {
            response.put("status", "DEGRADED");
            return ResponseEntity.status(503).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
