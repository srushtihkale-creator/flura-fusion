package com.florafusion;

import java.io.File;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class UserDeleter {
    public static void main(String[] args) {
        String targetEmail = args.length > 0 ? args[0] : "srushti.h.kale2004@gmail.com";
        try {
            Map<String, String> env = loadEnv();
            String user = env.getOrDefault("DATABASE_USERNAME", "postgres");
            String pass = env.getOrDefault("DATABASE_PASSWORD", "postgres");
            String rawUrl = env.getOrDefault("DATABASE_URL", "jdbc:postgresql://localhost:5432/flora_fusion");

            Class.forName("org.postgresql.Driver");
            try (Connection conn = DriverManager.getConnection(rawUrl, user, pass)) {
                // Find user id
                UUID userId = null;
                try (PreparedStatement findStmt = conn.prepareStatement("SELECT id FROM users WHERE LOWER(email) = LOWER(?)")) {
                    findStmt.setString(1, targetEmail.trim());
                    try (ResultSet rs = findStmt.executeQuery()) {
                        if (rs.next()) {
                            userId = (UUID) rs.getObject("id");
                        }
                    }
                }

                if (userId == null) {
                    System.out.println("STATUS: User " + targetEmail + " was not found in the database (ready for registration).");
                    return;
                }

                // Delete dependencies
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM carts WHERE user_id = ?")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM wishlist_items WHERE wishlist_id IN (SELECT id FROM wishlists WHERE user_id = ?)")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM wishlists WHERE user_id = ?")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM orders WHERE user_id = ?")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM addresses WHERE user_id = ?")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM reviews WHERE user_id = ?")) {
                    stmt.setObject(1, userId);
                    stmt.executeUpdate();
                }

                // Delete user
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM users WHERE id = ?")) {
                    stmt.setObject(1, userId);
                    int deleted = stmt.executeUpdate();
                    System.out.println("STATUS: Successfully deleted user " + targetEmail + " (Rows affected: " + deleted + ").");
                }
            }
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();
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
                } catch (Exception ignored) {}
            }
        }
        return env;
    }
}
