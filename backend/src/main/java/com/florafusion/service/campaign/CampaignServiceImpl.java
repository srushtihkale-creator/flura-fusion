package com.florafusion.service.campaign;

import com.florafusion.dto.campaign.*;
import com.florafusion.entity.CampaignRecipient;
import com.florafusion.entity.Coupon;
import com.florafusion.entity.EmailCampaign;
import com.florafusion.entity.User;
import com.florafusion.exception.BadRequestException;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.CampaignRecipientRepository;
import com.florafusion.repository.CouponRepository;
import com.florafusion.repository.EmailCampaignRepository;
import com.florafusion.repository.UserRepository;
import com.florafusion.service.email.template.PromotionalEmailTemplateBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.florafusion.entity.Role;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {

    private final EmailCampaignRepository campaignRepository;
    private final CampaignRecipientRepository recipientRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final PromotionalEmailTemplateBuilder templateBuilder;
    private final N8nTriggerService n8nTriggerService;

    @Value("${application.frontend.url:${FRONTEND_URL:https://flura-fusion.vercel.app}}")
    private String frontendUrl;

    @Value("${application.campaign.authorized-test-recipient:srushti.h.kale2004@gmail.com}")
    private String authorizedTestRecipient;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @Override
    @Transactional(readOnly = true)
    public List<CampaignResponse> getAllCampaigns() {
        return campaignRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(CampaignResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignResponse getCampaignById(UUID id) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + id));
        return CampaignResponse.fromEntity(campaign);
    }

    @Override
    @Transactional
    public CampaignResponse createCampaign(CampaignCreateRequest request) {
        Coupon coupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            coupon = couponRepository.findByCodeIgnoreCase(request.getCouponCode().trim())
                    .orElseThrow(() -> new BadRequestException("Coupon code does not exist: " + request.getCouponCode()));
        }

        EmailCampaign campaign = EmailCampaign.builder()
                .title(request.getTitle().trim())
                .subject(request.getSubject().trim())
                .promotionalMessage(request.getPromotionalMessage().trim())
                .coupon(coupon)
                .targetCategory(request.getTargetCategory() != null ? request.getTargetCategory().trim().toLowerCase() : "all")
                .targetProductIds(request.getTargetProductIds())
                .startDate(request.getStartDate() != null ? request.getStartDate() : Instant.now())
                .endDate(request.getEndDate())
                .testMode(request.isTestMode())
                .testRecipient(request.getTestRecipient() != null ? request.getTestRecipient().trim() : null)
                .status("DRAFT")
                .build();

        EmailCampaign saved = campaignRepository.save(campaign);
        log.info("[CampaignService] Created promotional campaign #{} ('{}')", saved.getId(), saved.getTitle());
        return CampaignResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CampaignResponse updateCampaign(UUID id, CampaignCreateRequest request) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + id));

        if ("PROCESSING".equalsIgnoreCase(campaign.getStatus()) || "SENT".equalsIgnoreCase(campaign.getStatus())) {
            throw new BadRequestException("Cannot edit a campaign that is already " + campaign.getStatus());
        }

        Coupon coupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            coupon = couponRepository.findByCodeIgnoreCase(request.getCouponCode().trim())
                    .orElseThrow(() -> new BadRequestException("Coupon code does not exist: " + request.getCouponCode()));
        }

        campaign.setTitle(request.getTitle().trim());
        campaign.setSubject(request.getSubject().trim());
        campaign.setPromotionalMessage(request.getPromotionalMessage().trim());
        campaign.setCoupon(coupon);
        campaign.setTargetCategory(request.getTargetCategory() != null ? request.getTargetCategory().trim().toLowerCase() : "all");
        campaign.setTargetProductIds(request.getTargetProductIds());
        if (request.getStartDate() != null) campaign.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) campaign.setEndDate(request.getEndDate());
        campaign.setTestMode(request.isTestMode());
        if (request.getTestRecipient() != null) campaign.setTestRecipient(request.getTestRecipient().trim());

        // Any edit resets to DRAFT if it was previously approved
        if ("APPROVED".equalsIgnoreCase(campaign.getStatus())) {
            campaign.setStatus("DRAFT");
            campaign.setApprovedAt(null);
        }

        EmailCampaign updated = campaignRepository.save(campaign);
        log.info("[CampaignService] Updated promotional campaign #{}", updated.getId());
        return CampaignResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public CampaignResponse approveCampaign(UUID id) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + id));

        if ("SENT".equalsIgnoreCase(campaign.getStatus()) || "PROCESSING".equalsIgnoreCase(campaign.getStatus())) {
            throw new BadRequestException("Campaign is already " + campaign.getStatus());
        }

        campaign.setStatus("APPROVED");
        campaign.setApprovedAt(Instant.now());
        EmailCampaign saved = campaignRepository.save(campaign);
        log.info("[CampaignService] Approved promotional campaign #{}", saved.getId());
        return CampaignResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CampaignResponse triggerCampaign(UUID id, boolean testMode, String testRecipient) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + id));

        // In test mode, we allow triggering directly from DRAFT or APPROVED
        if (!testMode && !"APPROVED".equalsIgnoreCase(campaign.getStatus())) {
            throw new BadRequestException("Campaign must be explicitly APPROVED before live dispatch to customers.");
        }

        if ("PROCESSING".equalsIgnoreCase(campaign.getStatus())) {
            throw new BadRequestException("Campaign is already in PROCESSING state. Prevented duplicate dispatch.");
        }

        if ("SENT".equalsIgnoreCase(campaign.getStatus()) && !testMode) {
            throw new BadRequestException("Campaign has already been SENT. Duplicate dispatch blocked.");
        }

        campaign.setTestMode(testMode);
        if (testMode) {
            String authorizedEmail = (authorizedTestRecipient != null && !authorizedTestRecipient.isBlank())
                    ? authorizedTestRecipient.trim().toLowerCase()
                    : "srushti.h.kale2004@gmail.com";

            if (testRecipient != null && !testRecipient.isBlank()) {
                String requestedEmail = testRecipient.trim().toLowerCase();
                if (!requestedEmail.equalsIgnoreCase(authorizedEmail)) {
                    log.warn("[CampaignService] Test dispatch rejected: Recipient '{}' is not the authorized test inbox ('{}')",
                            requestedEmail, authorizedEmail);
                    throw new BadRequestException("Unauthorized test recipient. Test mode is strictly restricted to the authorized test inbox: " + authorizedEmail);
                }
            }
            campaign.setTestRecipient(authorizedEmail);
        } else if (testRecipient != null && !testRecipient.isBlank()) {
            campaign.setTestRecipient(testRecipient.trim().toLowerCase());
        }

        // Initialize recipient queue for n8n idempotency
        List<CampaignRecipient> queuedRecipients = new ArrayList<>();

        if (testMode) {
            String targetEmail = campaign.getTestRecipient();
            if (targetEmail == null || targetEmail.isBlank()) {
                targetEmail = (authorizedTestRecipient != null && !authorizedTestRecipient.isBlank())
                        ? authorizedTestRecipient.trim().toLowerCase()
                        : "srushti.h.kale2004@gmail.com";
            }

            if (!recipientRepository.existsByCampaignIdAndEmail(campaign.getId(), targetEmail)) {
                User testUser = userRepository.findByEmail(targetEmail).orElse(null);
                queuedRecipients.add(CampaignRecipient.builder()
                        .campaign(campaign)
                        .user(testUser)
                        .email(targetEmail)
                        .recipientName(testUser != null ? testUser.getName() : "Test Administrator")
                        .status("PENDING")
                        .build());
            }
        } else {
            List<User> eligibleUsers = userRepository.findByEmailVerifiedTrueAndMarketingConsentTrueAndUnsubscribedAtIsNull();
            Set<String> seenEmails = new HashSet<>();

            for (User u : eligibleUsers) {
                // Rule 1: Exclude non-customers (e.g. admins) and non-active accounts
                if (u.getRole() != Role.CUSTOMER || !"ACTIVE".equalsIgnoreCase(u.getStatus())) {
                    continue;
                }

                // Rule 2: Skip null, blank, or malformed email addresses
                if (u.getEmail() == null || u.getEmail().isBlank()) {
                    continue;
                }
                String normalizedEmail = u.getEmail().trim().toLowerCase();
                if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
                    log.warn("[CampaignService] Skipping malformed customer email address: '{}'", u.getEmail());
                    continue;
                }

                // Rule 3: Strict unsubscribe and consent guard
                if (u.getUnsubscribedAt() != null || !u.isMarketingConsent()) {
                    continue;
                }

                // Rule 4: Prevent duplicate recipients across batch and existing DB records
                if (seenEmails.contains(normalizedEmail)) {
                    continue;
                }
                seenEmails.add(normalizedEmail);

                if (!recipientRepository.existsByCampaignIdAndEmail(campaign.getId(), normalizedEmail)) {
                    queuedRecipients.add(CampaignRecipient.builder()
                            .campaign(campaign)
                            .user(u)
                            .email(normalizedEmail)
                            .recipientName(u.getName() != null && !u.getName().isBlank() ? u.getName().trim() : "Plant Lover")
                            .status("PENDING")
                            .build());
                }
            }
        }

        if (!queuedRecipients.isEmpty()) {
            recipientRepository.saveAll(queuedRecipients);
        }

        long totalEligible = recipientRepository.findByCampaignId(campaign.getId()).size();
        campaign.setTotalRecipients((int) totalEligible);
        campaign.setStatus("PROCESSING");
        campaign.setSentAt(Instant.now());
        EmailCampaign saved = campaignRepository.save(campaign);

        log.info("[CampaignService] Campaign #{} triggered (TestMode: {}, Recipients: {}). Calling n8n...", 
                saved.getId(), testMode, totalEligible);

        // Dispatch webhook to n8n Cloud
        n8nTriggerService.triggerWorkflow(saved);

        return CampaignResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CampaignResponse cancelCampaign(UUID id) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + id));

        if ("SENT".equalsIgnoreCase(campaign.getStatus())) {
            throw new BadRequestException("Cannot cancel a campaign that has already completed delivery.");
        }

        campaign.setStatus("CANCELLED");
        EmailCampaign saved = campaignRepository.save(campaign);
        log.info("[CampaignService] Cancelled promotional campaign #{}", saved.getId());
        return CampaignResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignPreviewResponse getCampaignPreview(UUID id) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + id));

        String cleanFrontendUrl = frontendUrl.replaceAll("/+$", "");
        String previewUnsubUrl = cleanFrontendUrl + "/unsubscribe?token=demo_preview_token";
        String html = templateBuilder.buildPromotionalHtml(campaign, "Flora Lover", previewUnsubUrl);

        int eligibleCount = (int) countEligibleSubscribers();

        String discountSummary = "No Coupon Linked";
        String couponCode = null;
        if (campaign.getCoupon() != null) {
            couponCode = campaign.getCoupon().getCode();
            discountSummary = campaign.getCoupon().getTitle() != null 
                    ? campaign.getCoupon().getTitle() 
                    : (campaign.getCoupon().getDiscountValue() + " " + campaign.getCoupon().getDiscountType());
        }

        return CampaignPreviewResponse.builder()
                .campaignId(campaign.getId())
                .title(campaign.getTitle())
                .subject(campaign.getSubject())
                .renderedHtml(html)
                .eligibleRecipientCount(eligibleCount)
                .sampleRecipientEmail(campaign.isTestMode() ? campaign.getTestRecipient() : "customer@florafusion.com")
                .couponCode(couponCode)
                .discountSummary(discountSummary)
                .targetCategory(campaign.getTargetCategory())
                .status(campaign.getStatus())
                .build();
    }

    @Override
    @Transactional
    public List<CampaignRecipientDto> getEligibleRecipientsForN8n(UUID campaignId) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + campaignId));

        List<CampaignRecipient> recipients = recipientRepository.findByCampaignId(campaignId);
        String cleanFrontendUrl = frontendUrl.replaceAll("/+$", "");

        return recipients.stream().map(r -> {
            String token;
            if (r.getUser() != null) {
                User u = r.getUser();
                if (u.getUnsubscribeToken() == null || u.getUnsubscribeToken().isBlank()) {
                    u.setUnsubscribeToken(com.florafusion.security.SecurityUtils.generateSecureToken());
                    userRepository.save(u);
                }
                token = u.getUnsubscribeToken();
            } else {
                var optUser = userRepository.findByEmail(r.getEmail().trim().toLowerCase());
                if (optUser.isPresent()) {
                    User u = optUser.get();
                    if (u.getUnsubscribeToken() == null || u.getUnsubscribeToken().isBlank()) {
                        u.setUnsubscribeToken(com.florafusion.security.SecurityUtils.generateSecureToken());
                        userRepository.save(u);
                    }
                    token = u.getUnsubscribeToken();
                } else {
                    token = com.florafusion.security.SecurityUtils.generateSecureToken();
                }
            }

            String unsubUrl = cleanFrontendUrl + "/unsubscribe?token=" + token;

            return CampaignRecipientDto.builder()
                    .recipientId(r.getId())
                    .email(r.getEmail())
                    .name(r.getRecipientName() != null ? r.getRecipientName() : "Plant Lover")
                    .unsubscribeToken(token)
                    .unsubscribeUrl(unsubUrl)
                    .build();
        }).toList();
    }

    @Override
    @Transactional
    public void recordRecipientResult(UUID campaignId, CampaignLogRequest logRequest) {
        var recipientOpt = recipientRepository.findByCampaignIdAndEmail(campaignId, logRequest.getEmail().trim().toLowerCase());
        if (recipientOpt.isPresent()) {
            CampaignRecipient r = recipientOpt.get();
            r.setStatus(logRequest.getStatus().toUpperCase());
            r.setMessageId(logRequest.getMessageId());
            r.setErrorMessage(logRequest.getErrorMessage());
            r.setSentAt(Instant.now());
            recipientRepository.save(r);
        } else {
            EmailCampaign campaign = campaignRepository.findById(campaignId).orElse(null);
            if (campaign != null) {
                recipientRepository.save(CampaignRecipient.builder()
                        .campaign(campaign)
                        .email(logRequest.getEmail().trim().toLowerCase())
                        .status(logRequest.getStatus().toUpperCase())
                        .messageId(logRequest.getMessageId())
                        .errorMessage(logRequest.getErrorMessage())
                        .sentAt(Instant.now())
                        .build());
            }
        }
    }

    @Override
    @Transactional
    public CampaignResponse completeCampaign(UUID campaignId, CampaignCompleteRequest completeRequest) {
        EmailCampaign campaign = campaignRepository.findByIdWithDetails(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + campaignId));

        int sent = completeRequest.getSentCount();
        int failed = completeRequest.getFailedCount();

        campaign.setSentCount(sent);
        campaign.setFailedCount(failed);

        if (completeRequest.getStatus() != null && !completeRequest.getStatus().isBlank()) {
            campaign.setStatus(completeRequest.getStatus().toUpperCase());
        } else {
            if (failed > 0 && sent > 0) {
                campaign.setStatus("PARTIALLY_FAILED");
            } else if (failed > 0 && sent == 0) {
                campaign.setStatus("FAILED");
            } else {
                campaign.setStatus("SENT");
            }
        }

        EmailCampaign saved = campaignRepository.save(campaign);
        log.info("[CampaignService] Completed campaign #{}: Status={}, Sent={}, Failed={}", 
                saved.getId(), saved.getStatus(), sent, failed);
        return CampaignResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public boolean unsubscribeUser(String token) {
        if (token == null || token.isBlank()) return false;
        var userOpt = userRepository.findByUnsubscribeToken(token.trim());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            u.setMarketingConsent(false);
            u.setUnsubscribedAt(Instant.now());
            userRepository.save(u);
            log.info("[CampaignService] Customer {} successfully unsubscribed via secure token.", u.getEmail());
            return true;
        }
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public long countEligibleSubscribers() {
        return userRepository.findByEmailVerifiedTrueAndMarketingConsentTrueAndUnsubscribedAtIsNull()
                .stream()
                .filter(u -> u.getRole() == Role.CUSTOMER && "ACTIVE".equalsIgnoreCase(u.getStatus()))
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank() && EMAIL_PATTERN.matcher(u.getEmail().trim().toLowerCase()).matches())
                .count();
    }
}
