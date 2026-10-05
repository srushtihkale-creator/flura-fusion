package com.florafusion.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.ai.AiRecommendationResponse;
import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.entity.Product;
import com.florafusion.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiRecommendationService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Value("${application.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${application.gemini.model:gemini-3.8-flash}")
    private String geminiModel;

    private static final Pattern SLUGS_PATTERN = Pattern.compile("RECOMMENDED_SLUGS:\\s*\\[?([^\\]\\r\\n]+)\\]?", Pattern.CASE_INSENSITIVE);

    public AiRecommendationResponse getRecommendation(String userQuery) {
        String query = userQuery != null ? userQuery.trim() : "";
        if (query.isEmpty()) {
            return fallbackRecommendation("Help me choose a plant");
        }

        if (geminiApiKey == null || geminiApiKey.isBlank() || "your_gemini_api_key_here".equalsIgnoreCase(geminiApiKey.trim())) {
            log.info("Gemini API key is not configured. Serving local botanical recommendation engine.");
            return fallbackRecommendation(query);
        }

        try {
            List<Product> catalog = productRepository.findByStatus("ACTIVE", PageRequest.of(0, 40)).getContent();
            String prompt = buildPrompt(query, catalog);

            Map<String, Object> requestPayload = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 800
                )
            );

            RestClient restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();

            String model = (geminiModel != null && !geminiModel.isBlank()) ? geminiModel.trim() : "gemini-2.5-flash";

            String rawResponse = restClient.post()
                .uri("/v1beta/models/{model}:generateContent", model)
                .header("x-goog-api-key", geminiApiKey.trim())
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestPayload)
                .retrieve()
                .body(String.class);

            if (rawResponse != null && !rawResponse.isBlank()) {
                JsonNode root = objectMapper.readTree(rawResponse);
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && !parts.isEmpty()) {
                        String generatedText = parts.get(0).path("text").asText("");
                        if (!generatedText.isBlank()) {
                            return parseGeminiResponse(generatedText, catalog);
                        }
                    }
                }
            }

            log.warn("Gemini returned an empty response. Falling back to local botanical recommendation engine.");
            return fallbackRecommendation(query);

        } catch (Exception e) {
            log.warn("Gemini API call failed ({}). Gracefully falling back to local botanical recommendation engine.", e.getMessage());
            return fallbackRecommendation(query);
        }
    }

    private String buildPrompt(String query, List<Product> catalog) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are Flora AI, a warm, knowledgeable botanical guide and plant expert for Flora Fusion (a premium Indian nursery).\n");
        sb.append("Answer the customer's query with friendly, encouraging, and accurate botanical advice (2 to 4 sentences).\n");
        sb.append("Include practical care advice (watering, indirect/direct light, humidity, or room placement suited for Indian homes).\n");
        sb.append("Then, select between 1 and 3 most suitable matching products from the nursery catalog provided below.\n\n");
        
        sb.append("At the very end of your response, on a new line, you MUST write:\n");
        sb.append("RECOMMENDED_SLUGS: [slug1, slug2, ...]\n");
        sb.append("Use ONLY the exact slugs from the catalog below.\n\n");

        sb.append("Nursery Catalog:\n");
        for (Product p : catalog) {
            sb.append("- ").append(p.getName())
              .append(" (slug: \"").append(p.getSlug()).append("\", ")
              .append("category: ").append(p.getCategory() != null ? p.getCategory().getSlug() : "general").append(", ")
              .append("price: ₹").append(p.getBasePrice()).append("): ")
              .append(p.getTagline() != null ? p.getTagline() : "")
              .append(" | ").append(p.getDescription() != null ? p.getDescription().substring(0, Math.min(100, p.getDescription().length())) : "")
              .append("\n");
        }

        sb.append("\nCustomer Query: ").append(query);
        return sb.toString();
    }

    private AiRecommendationResponse parseGeminiResponse(String generatedText, List<Product> catalog) {
        String cleanText = generatedText;
        List<String> extractedSlugs = new ArrayList<>();

        Matcher matcher = SLUGS_PATTERN.matcher(generatedText);
        if (matcher.find()) {
            String slugsStr = matcher.group(1);
            cleanText = generatedText.substring(0, matcher.start()).trim();
            if (slugsStr != null) {
                String[] parts = slugsStr.split("[,;\\s]+");
                for (String p : parts) {
                    String s = p.replace("\"", "").replace("'", "").replace("[", "").replace("]", "").trim();
                    if (!s.isEmpty()) {
                        extractedSlugs.add(s.toLowerCase());
                    }
                }
            }
        }

        List<ProductResponse> recommendations = new ArrayList<>();
        Set<String> seenSlugs = new HashSet<>();

        for (String slug : extractedSlugs) {
            productRepository.findBySlug(slug).ifPresent(p -> {
                if (seenSlugs.add(p.getSlug())) {
                    recommendations.add(ProductResponse.fromEntity(p));
                }
            });
            if (recommendations.size() >= 3) break;
        }

        // If no slugs parsed, check if product names are mentioned in text
        if (recommendations.isEmpty()) {
            String lowerText = generatedText.toLowerCase();
            for (Product p : catalog) {
                if (lowerText.contains(p.getName().toLowerCase()) && seenSlugs.add(p.getSlug())) {
                    recommendations.add(ProductResponse.fromEntity(p));
                    if (recommendations.size() >= 3) break;
                }
            }
        }

        // If still empty, provide 3 default bestsellers
        if (recommendations.isEmpty()) {
            catalog.stream()
                .filter(p -> "Bestseller".equalsIgnoreCase(p.getBadge()) || "Popular".equalsIgnoreCase(p.getBadge()))
                .limit(3)
                .forEach(p -> recommendations.add(ProductResponse.fromEntity(p)));
        }

        return new AiRecommendationResponse(cleanText, recommendations, "gemini");
    }

    public AiRecommendationResponse fallbackRecommendation(String query) {
        String q = query.toLowerCase();
        List<Product> all = productRepository.findByStatus("ACTIVE", PageRequest.of(0, 40)).getContent();

        String text;
        List<String> targetSlugs = new ArrayList<>();

        if (q.contains("low light") || q.contains("dim") || q.contains("dark") || q.contains("bedroom") || q.contains("shade")) {
            text = "For bedrooms or rooms with soft, indirect lighting, hardy species that tolerate lower illumination are ideal. The Snake Plant and ZZ Plant produce oxygen and require watering only once every 2–3 weeks!";
            targetSlugs = List.of("snake-plant", "zz-plant", "peace-lily");
        } else if (q.contains("500") || q.contains("budget") || q.contains("cheap") || q.contains("affordable")) {
            text = "Here are some of our most beloved nursery plants and artisan pots under ₹500 that deliver maximum green joy without stretching your budget:";
            return new AiRecommendationResponse(
                text,
                all.stream().filter(p -> p.getBasePrice().doubleValue() <= 500.0).limit(3).map(ProductResponse::fromEntity).collect(Collectors.toList()),
                "local-botanical-engine"
            );
        } else if (q.contains("beginner") || q.contains("easy") || q.contains("first time") || q.contains("new to plants")) {
            text = "Welcome to plant parenting! I recommend virtually indestructible choices like the Money Plant, Snake Plant, or Jade Plant. They are forgiving of occasional missed waterings and adapt gracefully to Indian homes.";
            targetSlugs = List.of("money-plant", "snake-plant", "jade-plant");
        } else if (q.contains("air") || q.contains("purif") || q.contains("nasa") || q.contains("toxin") || q.contains("breathe")) {
            text = "These champion air-purifying plants are scientifically proven to filter airborne toxins like benzene and formaldehyde while enriching your living spaces with oxygen:";
            targetSlugs = List.of("snake-plant", "areca-palm", "spider-plant");
        } else if (q.contains("pot") || q.contains("planter") || q.contains("ceramic") || q.contains("terracotta")) {
            text = "Our pots are handcrafted with drainage holes to keep root balls healthy. For tropical foliage, our fluted ceramic and breathable terracotta pots provide optimal aeration:";
            return new AiRecommendationResponse(
                text,
                all.stream().filter(p -> p.getCategory() != null && "pots".equalsIgnoreCase(p.getCategory().getSlug())).limit(3).map(ProductResponse::fromEntity).collect(Collectors.toList()),
                "local-botanical-engine"
            );
        } else if (q.contains("herb") || q.contains("seed") || q.contains("grow") || q.contains("kitchen") || q.contains("basil")) {
            text = "Growing fresh culinary herbs on your kitchen windowsill is wonderfully rewarding! Our heirloom non-GMO seeds germinate in 5–8 days with simple misting:";
            return new AiRecommendationResponse(
                text,
                all.stream().filter(p -> p.getCategory() != null && "seeds".equalsIgnoreCase(p.getCategory().getSlug())).limit(3).map(ProductResponse::fromEntity).collect(Collectors.toList()),
                "local-botanical-engine"
            );
        } else {
            text = "I would love to help you find the perfect botanical companion! Here are our current nursery bestsellers that delight homes across India with lush foliage and easy care:";
            targetSlugs = List.of("money-plant", "snake-plant", "peace-lily");
        }

        List<ProductResponse> recs = new ArrayList<>();
        for (String s : targetSlugs) {
            productRepository.findBySlug(s).ifPresent(p -> recs.add(ProductResponse.fromEntity(p)));
        }

        if (recs.isEmpty()) {
            all.stream().limit(3).forEach(p -> recs.add(ProductResponse.fromEntity(p)));
        }

        return new AiRecommendationResponse(text, recs, "local-botanical-engine");
    }
}
