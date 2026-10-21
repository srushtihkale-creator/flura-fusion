package com.florafusion.service;

import com.florafusion.dto.campaign.*;
import com.florafusion.entity.CampaignRecipient;
import com.florafusion.entity.EmailCampaign;
import com.florafusion.entity.User;
import com.florafusion.exception.BadRequestException;
import com.florafusion.repository.CampaignRecipientRepository;
import com.florafusion.repository.CouponRepository;
import com.florafusion.repository.EmailCampaignRepository;
import com.florafusion.repository.UserRepository;
import com.florafusion.service.campaign.CampaignServiceImpl;
import com.florafusion.service.campaign.N8nTriggerService;
import com.florafusion.service.email.template.PromotionalEmailTemplateBuilder;
import com.florafusion.entity.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampaignServiceTest {

    @Mock
    private EmailCampaignRepository campaignRepository;

    @Mock
    private CampaignRecipientRepository recipientRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private PromotionalEmailTemplateBuilder templateBuilder;

    @Mock
    private N8nTriggerService n8nTriggerService;

    @InjectMocks
    private CampaignServiceImpl campaignService;

    private EmailCampaign testCampaign;
    private User testUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(campaignService, "authorizedTestRecipient", "srushti.h.kale2004@gmail.com");
        ReflectionTestUtils.setField(campaignService, "frontendUrl", "https://flura-fusion.vercel.app");

        testCampaign = EmailCampaign.builder()
                .id(UUID.randomUUID())
                .title("Monsoon Plant Sale")
                .subject("Special Monsoon Offers for You 🌿")
                .promotionalMessage("Get 15% off all indoor plants this week only!")
                .targetCategory("plants")
                .status("DRAFT")
                .startDate(Instant.now())
                .build();

        testUser = User.builder()
                .id(UUID.randomUUID())
                .name("Srushti Kale")
                .email("srushti.h.kale2004@gmail.com")
                .emailVerified(true)
                .marketingConsent(true)
                .unsubscribeToken("secure_unsub_token_12345")
                .build();
    }

    @Test
    @DisplayName("Should create promotional campaign in DRAFT status")
    void testCreateCampaign_Success() {
        CampaignCreateRequest req = CampaignCreateRequest.builder()
                .title("Monsoon Plant Sale")
                .subject("Special Monsoon Offers 🌿")
                .promotionalMessage("Exclusive discount on all indoor plants")
                .targetCategory("plants")
                .build();

        when(campaignRepository.save(any(EmailCampaign.class))).thenAnswer(i -> {
            EmailCampaign c = i.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });

        CampaignResponse response = campaignService.createCampaign(req);

        assertNotNull(response);
        assertEquals("Monsoon Plant Sale", response.getTitle());
        assertEquals("DRAFT", response.getStatus());
        verify(campaignRepository, times(1)).save(any(EmailCampaign.class));
    }

    @Test
    @DisplayName("Should approve DRAFT campaign and record approvedAt timestamp")
    void testApproveCampaign_Success() {
        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));
        when(campaignRepository.save(any(EmailCampaign.class))).thenAnswer(i -> i.getArgument(0));

        CampaignResponse response = campaignService.approveCampaign(testCampaign.getId());

        assertNotNull(response);
        assertEquals("APPROVED", response.getStatus());
        assertNotNull(response.getApprovedAt());
    }

    @Test
    @DisplayName("Should trigger campaign in Test Mode queuing strictly the test recipient")
    void testTriggerCampaign_TestMode() {
        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));
        when(recipientRepository.existsByCampaignIdAndEmail(any(), any())).thenReturn(false);
        when(campaignRepository.save(any(EmailCampaign.class))).thenAnswer(i -> i.getArgument(0));
        when(recipientRepository.findByCampaignId(any())).thenReturn(List.of(
                CampaignRecipient.builder().id(UUID.randomUUID()).email("srushti.h.kale2004@gmail.com").status("PENDING").build()
        ));
        when(n8nTriggerService.triggerWorkflow(any(EmailCampaign.class))).thenReturn(true);

        CampaignResponse response = campaignService.triggerCampaign(testCampaign.getId(), true, "srushti.h.kale2004@gmail.com");

        assertNotNull(response);
        assertEquals("PROCESSING", response.getStatus());
        assertTrue(response.isTestMode());
        assertEquals("srushti.h.kale2004@gmail.com", response.getTestRecipient());
        verify(n8nTriggerService, times(1)).triggerWorkflow(any(EmailCampaign.class));
    }

    @Test
    @DisplayName("Should reject duplicate trigger if campaign is already PROCESSING")
    void testTriggerCampaign_DuplicatePrevented() {
        testCampaign.setStatus("PROCESSING");
        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));

        assertThrows(BadRequestException.class, () ->
                campaignService.triggerCampaign(testCampaign.getId(), false, null)
        );
    }

    @Test
    @DisplayName("Should unsubscribe customer given valid unguessable token")
    void testUnsubscribeUser_ValidToken() {
        when(userRepository.findByUnsubscribeToken("secure_unsub_token_12345")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        boolean result = campaignService.unsubscribeUser("secure_unsub_token_12345");

        assertTrue(result);
        assertFalse(testUser.isMarketingConsent());
        assertNotNull(testUser.getUnsubscribedAt());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    @DisplayName("Should return false when unsubscribing with non-existent token")
    void testUnsubscribeUser_InvalidToken() {
        when(userRepository.findByUnsubscribeToken("invalid_token")).thenReturn(Optional.empty());

        boolean result = campaignService.unsubscribeUser("invalid_token");

        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should record recipient outcome idempotently")
    void testRecordRecipientResult() {
        CampaignRecipient recipient = CampaignRecipient.builder()
                .id(UUID.randomUUID())
                .campaign(testCampaign)
                .email("test@florafusion.com")
                .status("PENDING")
                .build();

        when(recipientRepository.findByCampaignIdAndEmail(testCampaign.getId(), "test@florafusion.com"))
                .thenReturn(Optional.of(recipient));

        CampaignLogRequest logReq = CampaignLogRequest.builder()
                .email("test@florafusion.com")
                .status("SENT")
                .messageId("msg_123456789")
                .build();

        campaignService.recordRecipientResult(testCampaign.getId(), logReq);

        assertEquals("SENT", recipient.getStatus());
        assertEquals("msg_123456789", recipient.getMessageId());
        assertNotNull(recipient.getSentAt());
        verify(recipientRepository, times(1)).save(recipient);
    }

    @Test
    @DisplayName("Should complete campaign and update final status to SENT")
    void testCompleteCampaign_Success() {
        testCampaign.setStatus("PROCESSING");
        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));
        when(campaignRepository.save(any(EmailCampaign.class))).thenAnswer(i -> i.getArgument(0));

        CampaignCompleteRequest req = CampaignCompleteRequest.builder()
                .sentCount(15)
                .failedCount(0)
                .status("SENT")
                .build();

        CampaignResponse response = campaignService.completeCampaign(testCampaign.getId(), req);

        assertNotNull(response);
        assertEquals("SENT", response.getStatus());
        assertEquals(15, response.getSentCount());
        assertEquals(0, response.getFailedCount());
    }

    @Test
    @DisplayName("Should reject unauthorized test recipient in test mode with BadRequestException")
    void testTriggerCampaign_UnauthorizedTestRecipient_Rejected() {
        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                campaignService.triggerCampaign(testCampaign.getId(), true, "unauthorized.customer@example.com")
        );

        assertTrue(ex.getMessage().contains("Unauthorized test recipient"));
        verify(n8nTriggerService, never()).triggerWorkflow(any(EmailCampaign.class));
    }

    @Test
    @DisplayName("Should default to authorized test recipient when testRecipient is null in test mode")
    void testTriggerCampaign_NullTestRecipient_DefaultsToAuthorized() {
        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));
        when(recipientRepository.existsByCampaignIdAndEmail(any(), eq("srushti.h.kale2004@gmail.com"))).thenReturn(false);
        when(campaignRepository.save(any(EmailCampaign.class))).thenAnswer(i -> i.getArgument(0));
        when(recipientRepository.findByCampaignId(any())).thenReturn(List.of(
                CampaignRecipient.builder().id(UUID.randomUUID()).email("srushti.h.kale2004@gmail.com").status("PENDING").build()
        ));
        when(n8nTriggerService.triggerWorkflow(any(EmailCampaign.class))).thenReturn(true);

        CampaignResponse response = campaignService.triggerCampaign(testCampaign.getId(), true, null);

        assertNotNull(response);
        assertEquals("PROCESSING", response.getStatus());
        assertTrue(response.isTestMode());
        assertEquals("srushti.h.kale2004@gmail.com", response.getTestRecipient());
        verify(n8nTriggerService, times(1)).triggerWorkflow(any(EmailCampaign.class));
    }

    @Test
    @DisplayName("Should generate and persist 64-character secure token if recipient user is missing one")
    void testGetEligibleRecipientsForN8n_GeneratesTokenIfMissing() {
        User userWithoutToken = User.builder()
                .id(UUID.randomUUID())
                .name("New User")
                .email("newuser@example.com")
                .emailVerified(true)
                .marketingConsent(true)
                .unsubscribeToken(null) // missing token
                .build();

        CampaignRecipient recipient = CampaignRecipient.builder()
                .id(UUID.randomUUID())
                .campaign(testCampaign)
                .user(userWithoutToken)
                .email("newuser@example.com")
                .recipientName("New User")
                .status("PENDING")
                .build();

        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));
        when(recipientRepository.findByCampaignId(testCampaign.getId())).thenReturn(List.of(recipient));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        List<CampaignRecipientDto> dtos = campaignService.getEligibleRecipientsForN8n(testCampaign.getId());

        assertEquals(1, dtos.size());
        CampaignRecipientDto dto = dtos.get(0);
        assertNotNull(dto.getUnsubscribeToken());
        assertEquals(64, dto.getUnsubscribeToken().length(), "Token must be exactly 64 hex characters");
        assertNotEquals("test_mode_token", dto.getUnsubscribeToken(), "Must never use placeholder token");
        assertTrue(dto.getUnsubscribeUrl().startsWith("https://flura-fusion.vercel.app/unsubscribe?token="));
        assertTrue(dto.getUnsubscribeUrl().endsWith(dto.getUnsubscribeToken()));
        verify(userRepository, times(1)).save(userWithoutToken);
    }

    @Test
    @DisplayName("Should return false when unsubscribing with null or blank token")
    void testUnsubscribeUser_NullOrBlankToken_ReturnsFalse() {
        assertFalse(campaignService.unsubscribeUser(null));
        assertFalse(campaignService.unsubscribeUser(""));
        assertFalse(campaignService.unsubscribeUser("   "));
        verify(userRepository, never()).findByUnsubscribeToken(any());
    }

    @Test
    @DisplayName("Should skip malformed emails, non-customers, suspended accounts, and deduplicate recipients in live mode")
    void testTriggerCampaign_FiltersMalformedAndDuplicateAndIneligibleRecipients() {
        testCampaign.setStatus("APPROVED");
        when(campaignRepository.findByIdWithDetails(testCampaign.getId())).thenReturn(Optional.of(testCampaign));
        when(campaignRepository.save(any(EmailCampaign.class))).thenAnswer(i -> i.getArgument(0));
        when(n8nTriggerService.triggerWorkflow(any(EmailCampaign.class))).thenReturn(true);

        User validCustomer = User.builder()
                .id(UUID.randomUUID())
                .name("Alice Green")
                .email("alice@example.com")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        User malformedEmail = User.builder()
                .id(UUID.randomUUID())
                .name("Bad Email")
                .email("not-an-email")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        User duplicateCustomer = User.builder()
                .id(UUID.randomUUID())
                .name("Alice Duplicate")
                .email("alice@example.com")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        User adminUser = User.builder()
                .id(UUID.randomUUID())
                .name("Admin User")
                .email("admin@florafusion.com")
                .role(Role.ADMIN)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        User suspendedCustomer = User.builder()
                .id(UUID.randomUUID())
                .name("Suspended Customer")
                .email("suspended@example.com")
                .role(Role.CUSTOMER)
                .status("SUSPENDED")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        User unsubscribedCustomer = User.builder()
                .id(UUID.randomUUID())
                .name("Unsubscribed Customer")
                .email("unsub@example.com")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .unsubscribedAt(Instant.now())
                .build();

        User noConsentCustomer = User.builder()
                .id(UUID.randomUUID())
                .name("No Consent Customer")
                .email("noconsent@example.com")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(false)
                .build();

        List<User> candidateUsers = List.of(
                validCustomer,
                malformedEmail,
                duplicateCustomer,
                adminUser,
                suspendedCustomer,
                unsubscribedCustomer,
                noConsentCustomer
        );

        when(userRepository.findByEmailVerifiedTrueAndMarketingConsentTrueAndUnsubscribedAtIsNull()).thenReturn(candidateUsers);
        when(recipientRepository.existsByCampaignIdAndEmail(testCampaign.getId(), "alice@example.com")).thenReturn(false);

        CampaignRecipient queuedAlice = CampaignRecipient.builder()
                .id(UUID.randomUUID())
                .campaign(testCampaign)
                .email("alice@example.com")
                .recipientName("Alice Green")
                .status("PENDING")
                .build();
        when(recipientRepository.findByCampaignId(testCampaign.getId())).thenReturn(List.of(queuedAlice));

        CampaignResponse response = campaignService.triggerCampaign(testCampaign.getId(), false, null);

        assertNotNull(response);
        assertEquals("PROCESSING", response.getStatus());
        assertEquals(1, response.getTotalRecipients());

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<CampaignRecipient>> captor = ArgumentCaptor.forClass(List.class);
        verify(recipientRepository).saveAll(captor.capture());
        List<CampaignRecipient> savedRecipients = captor.getValue();

        assertEquals(1, savedRecipients.size(), "Only the single valid, active, non-duplicate customer should be queued");
        assertEquals("alice@example.com", savedRecipients.get(0).getEmail());
        assertEquals("Alice Green", savedRecipients.get(0).getRecipientName());
        verify(n8nTriggerService, times(1)).triggerWorkflow(any(EmailCampaign.class));
    }

    @Test
    @DisplayName("Should strictly count only active, verified, consented customers with valid emails")
    void testCountEligibleSubscribers_StrictFilter() {
        User validCustomer = User.builder()
                .email("valid@example.com")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        User adminUser = User.builder()
                .email("admin@example.com")
                .role(Role.ADMIN)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        User malformed = User.builder()
                .email("broken-email")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .emailVerified(true)
                .marketingConsent(true)
                .build();

        when(userRepository.findByEmailVerifiedTrueAndMarketingConsentTrueAndUnsubscribedAtIsNull())
                .thenReturn(List.of(validCustomer, adminUser, malformed));

        long count = campaignService.countEligibleSubscribers();
        assertEquals(1, count, "Only valid@example.com should be counted as an eligible subscriber");
    }
}
