package com.florafusion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class FloraFusionApplication {

    public static void main(String[] args) {
        loadDotEnvIfPresent();
        SpringApplication.run(FloraFusionApplication.class, args);
    }

    private static void loadDotEnvIfPresent() {
        File[] candidates = new File[] {
                new File(".env"),
                new File("backend/.env"),
                new File("../backend/.env")
        };
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
                        if (System.getProperty(key) == null) {
                            System.setProperty(key, val);
                            System.setProperty(key.toLowerCase().replace('_', '.'), val);
                        }
                    }
                    break;
                } catch (Exception ignored) {
                }
            }
        }
    }
}
