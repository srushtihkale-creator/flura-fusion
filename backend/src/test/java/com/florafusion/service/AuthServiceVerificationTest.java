package com.florafusion.service;

import com.florafusion.dto.auth.*;
import com.florafusion.entity.Role;
import com.florafusion.entity.SecurityToken;
import com.florafusion.entity.User;
import com.florafusion.exception.BadRequestException;
import com.florafusion.repository.SecurityTokenRepository;
import com.florafusion.repository.UserRepository;
import com.florafusion.security.JwtService;
import com.florafusion.security.UserPrincipal;
import com.florafusion.service.email.EmailService;
import com.florafusion.service.email.provider.EmailProvider.EmailSendResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceVerificationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityTokenRepository securityTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(UUID.randomUUID())
                .name("Srushti Test")
                .email("srushti.test@florafusion.com")
                .passwordHash("encodedHash")
                .role(Role.CUSTOMER)
                .status("PENDING_VERIFICATION")
                .emailVerified(false)
                .build();

        lenient().when(emailService.sendVerificationEmail(anyString(), anyString(), anyString()))
                .thenReturn(CompletableFuture.completedFuture(EmailSendResult.ok("msg-1")));
        lenient().when(emailService.sendWelcomeEmail(anyString(), anyString()))
                .thenReturn(CompletableFuture.completedFuture(EmailSendResult.ok("msg-2")));
    }

    @Test
    @DisplayName("1. Register creates PENDING_VERIFICATION user and dispatches 6-digit code")
    void testRegisterFlow() {
        when(userRepository.existsByEmail("srushti.test@florafusion.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPass");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        RegisterRequest request = new RegisterRequest(
                "Srushti Test",
                "srushti.test@florafusion.com",
                "Password@123",
                "+91 9890414379"
        );

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNull(response.token(), "Registration should not issue an active session token before email verification");
        assertFalse(response.emailVerified());
        assertTrue(response.message().contains("verification code"));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("PENDING_VERIFICATION", savedUser.getStatus());
        assertFalse(savedUser.isEmailVerified());
        assertNotNull(savedUser.getUnsubscribeToken(), "New registered user must have an unsubscribe token");
        assertEquals(64, savedUser.getUnsubscribeToken().length(), "Unsubscribe token must be a 64-char hex string");
        assertFalse(savedUser.isMarketingConsent(), "Marketing consent must default to false unless explicitly opted in");

        verify(securityTokenRepository).save(any(SecurityToken.class));
        verify(emailService).sendVerificationEmail(eq("srushti.test@florafusion.com"), eq("Srushti Test"), anyString());
    }

    @Test
    @DisplayName("2. Login is blocked if user is PENDING_VERIFICATION")
    void testLoginBlockedForUnverifiedUser() {
        Authentication auth = mock(Authentication.class);
        UserPrincipal principal = mock(UserPrincipal.class);
        when(auth.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("srushti.test@florafusion.com")).thenReturn(Optional.of(sampleUser));

        LoginRequest loginRequest = new LoginRequest("srushti.test@florafusion.com", "Password@123");

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.login(loginRequest));
        assertTrue(ex.getMessage().contains("not verified"));
    }

    @Test
    @DisplayName("3. Verify Email with valid 6-digit code activates user, sends Welcome Email and returns JWT")
    void testVerifyEmailSuccess() {
        when(userRepository.findByEmail("srushti.test@florafusion.com")).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateToken(any())).thenReturn("jwt-active-session-token");

        SecurityToken validToken = SecurityToken.builder()
                .id(UUID.randomUUID())
                .user(sampleUser)
                .tokenType(SecurityToken.TYPE_EMAIL_VERIFICATION)
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .build();

        when(securityTokenRepository.findTopByUserAndTokenTypeAndTokenHashAndUsedAtIsNull(
                eq(sampleUser), eq(SecurityToken.TYPE_EMAIL_VERIFICATION), anyString()
        )).thenReturn(Optional.of(validToken));

        VerifyEmailRequest verifyReq = new VerifyEmailRequest(
                "srushti.test@florafusion.com",
                "123456",
                null
        );

        AuthResponse authResponse = authService.verifyEmail(verifyReq);

        assertNotNull(authResponse);
        assertEquals("jwt-active-session-token", authResponse.token());
        assertTrue(authResponse.emailVerified());
        assertEquals("ACTIVE", sampleUser.getStatus());
        assertTrue(sampleUser.isEmailVerified());
        assertNotNull(validToken.getUsedAt(), "Token must be marked as used");

        verify(emailService).sendWelcomeEmail(eq("srushti.test@florafusion.com"), eq("Srushti Test"));
    }

    @Test
    @DisplayName("4. Resend verification code enforces 60-second cooldown rate limit")
    void testResendVerificationRateLimit() {
        when(userRepository.findByEmail("srushti.test@florafusion.com")).thenReturn(Optional.of(sampleUser));

        SecurityToken recentToken = SecurityToken.builder()
                .createdAt(Instant.now().minus(20, ChronoUnit.SECONDS))
                .build();

        when(securityTokenRepository.findTopByUserAndTokenTypeOrderByCreatedAtDesc(
                sampleUser, SecurityToken.TYPE_EMAIL_VERIFICATION
        )).thenReturn(Optional.of(recentToken));

        ResendVerificationRequest resendReq = new ResendVerificationRequest("srushti.test@florafusion.com");

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.resendVerification(resendReq));
        assertTrue(ex.getMessage().contains("Please wait"));
    }

    @Test
    @DisplayName("5. Reset password with valid code updates password and marks token used")
    void testResetPasswordSuccess() {
        when(userRepository.findByEmail("srushti.test@florafusion.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.encode("NewSecretPassword@123")).thenReturn("newHashedPassword");

        SecurityToken resetToken = SecurityToken.builder()
                .id(UUID.randomUUID())
                .user(sampleUser)
                .tokenType(SecurityToken.TYPE_PASSWORD_RESET)
                .expiresAt(Instant.now().plus(30, ChronoUnit.MINUTES))
                .build();

        when(securityTokenRepository.findTopByUserAndTokenTypeAndTokenHashAndUsedAtIsNull(
                eq(sampleUser), eq(SecurityToken.TYPE_PASSWORD_RESET), anyString()
        )).thenReturn(Optional.of(resetToken));

        ResetPasswordRequest resetReq = new ResetPasswordRequest(
                "srushti.test@florafusion.com",
                null,
                "654321",
                "NewSecretPassword@123"
        );

        var result = authService.resetPassword(resetReq);

        assertNotNull(result);
        assertTrue(result.get("message").contains("successfully reset"));
        assertEquals("newHashedPassword", sampleUser.getPasswordHash());
        assertNotNull(resetToken.getUsedAt(), "Reset token must be marked as used to prevent replay");
    }
}
