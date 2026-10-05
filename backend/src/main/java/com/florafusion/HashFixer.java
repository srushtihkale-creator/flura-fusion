package com.florafusion;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.File;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HashFixer {
    public static void main(String[] args) {
        try {
            Map<String, String> env = loadEnv();
            String user = env.getOrDefault("DATABASE_USERNAME", "postgres");
            String pass = env.getOrDefault("DATABASE_PASSWORD", "postgres");
            String rawUrl = env.getOrDefault("DATABASE_URL", "jdbc:postgresql://localhost:5432/flora_fusion");

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String validHash = encoder.encode("Password@123");

            Class.forName("org.postgresql.Driver");
            try (Connection conn = DriverManager.getConnection(rawUrl, user, pass);
                 PreparedStatement stmt = conn.prepareStatement("UPDATE users SET password_hash = ? WHERE email IN ('admin@florafusion.com', 'srushti@florafusion.com')")) {
                stmt.setString(1, validHash);
                int updated = stmt.executeUpdate();
                System.out.println("STATUS: Updated " + updated + " users with valid BCrypt hash.");
            }

            // Update in sql scripts
            String oldHash = "$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6";
            for (String path : List.of("backend/src/main/resources/db/migration/V2__seed_catalog_and_cms.sql", "backend/sql/02_seed_data.sql")) {
                File f = new File(path);
                if (!f.exists()) f = new File("../" + path);
                if (f.exists()) {
                    String content = Files.readString(f.toPath());
                    content = content.replace(oldHash, validHash);
                    Files.writeString(f.toPath(), content);
                    System.out.println("STATUS: Updated script " + f.getName());
                }
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
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
