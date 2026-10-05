package com.florafusion;

import java.io.File;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LocalDbCreator {

    public static void main(String[] args) {
        try {
            Map<String, String> env = loadEnv();
            String user = env.getOrDefault("DATABASE_USERNAME", env.getOrDefault("DB_USERNAME", "postgres"));
            String pass = env.getOrDefault("DATABASE_PASSWORD", env.getOrDefault("DB_PASSWORD", "postgres"));
            String rawUrl = env.getOrDefault("DATABASE_URL", "jdbc:postgresql://localhost:5432/flora_fusion");

            // Extract host and port
            String host = "localhost";
            int port = 5432;
            if (rawUrl.contains("://")) {
                String clean = rawUrl.substring(rawUrl.indexOf("://") + 3);
                if (clean.contains("/")) {
                    clean = clean.substring(0, clean.indexOf("/"));
                }
                if (clean.contains(":")) {
                    String[] parts = clean.split(":");
                    host = parts[0];
                    port = Integer.parseInt(parts[1]);
                } else if (!clean.isBlank()) {
                    host = clean;
                }
            }

            // Only connect to localhost / 127.0.0.1 to strictly prevent production access
            if (!host.equalsIgnoreCase("localhost") && !host.equals("127.0.0.1")) {
                System.err.println("Safety check failed: Non-local host detected. Operation aborted.");
                return;
            }

            String maintenanceUrl = "jdbc:postgresql://" + host + ":" + port + "/postgres";

            Class.forName("org.postgresql.Driver");
            try (Connection conn = DriverManager.getConnection(maintenanceUrl, user, pass);
                 Statement stmt = conn.createStatement()) {

                boolean forceClean = args.length > 0 && "clean".equalsIgnoreCase(args[0]);
                if (forceClean) {
                    try {
                        try (ResultSet rsTerm = stmt.executeQuery("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'flora_fusion' AND pid <> pg_backend_pid()")) {
                            while (rsTerm.next()) { /* drain */ }
                        }
                        stmt.executeUpdate("DROP DATABASE IF EXISTS flora_fusion");
                        stmt.executeUpdate("CREATE DATABASE flora_fusion");
                        System.out.println("STATUS: Clean database flora_fusion created successfully.");
                    } catch (Exception e) {
                        System.err.println("Clean database error: " + e.getMessage());
                    }
                    return;
                }

                ResultSet rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = 'flora_fusion'");
                if (!rs.next()) {
                    stmt.executeUpdate("CREATE DATABASE flora_fusion");
                    System.out.println("STATUS: Database flora_fusion created successfully.");
                } else {
                    System.out.println("STATUS: Database flora_fusion already exists.");
                }
            }
        } catch (Exception e) {
            System.err.println("Database initialization error: " + e.getMessage());
        }
    }

    private static Map<String, String> loadEnv() {
        Map<String, String> env = new HashMap<>();
        File[] candidates = new File[] { new File(".env"), new File("backend/.env"), new File("../backend/.env") };
        for (File candidate : candidates) {
            if (candidate.exists() && candidate.isFile()) {
                try {
                    List<String> lines = Files.readAllLines(candidate.toPath());
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                            continue;
                        }
                        int eqIdx = trimmed.indexOf('=');
                        String key = trimmed.substring(0, eqIdx).trim();
                        String val = trimmed.substring(eqIdx + 1).trim();
                        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.substring(1, val.length() - 1);
                        }
                        env.put(key, val);
                    }
                    break;
                } catch (Exception ignored) {
                }
            }
        }
        return env;
    }
}
