package com.florafusion.service;

import com.florafusion.dto.auth.*;
import com.florafusion.entity.Role;
import com.florafusion.entity.User;
import com.florafusion.exception.BadRequestException;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.UserRepository;
import com.florafusion.security.JwtService;
import com.florafusion.security.UserPrincipal;
import com.florafusion.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with email " + request.email() + " already exists.");
        }

        // Hard Rule: Public signup is unconditionally assigned ROLE_CUSTOMER
        User user = User.builder()
                .name(request.name().trim())
                .email(request.email().trim().toLowerCase())
                .phone(request.phone() != null ? request.phone().trim() : null)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .build();

        user = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtService.generateToken(principal);

        // Asynchronously dispatch Welcome and Verification emails
        try {
            String verifyToken = jwtService.generateActionToken(user.getEmail(), "VERIFY_EMAIL", 86400000L); // 24 hours
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), verifyToken);
        } catch (Exception e) {
            log.warn("[AuthService] Non-blocking email dispatch failed for {}: {}", user.getEmail(), e.getMessage());
        }

        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().trim().toLowerCase(),
                        request.password()
                )
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtService.generateToken(principal);

        return AuthResponse.of(token, principal.getId(), principal.getName(), principal.getEmail(), principal.getRole().name());
    }

    public Map<String, String> requestPasswordReset(ForgotPasswordRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            String resetToken = jwtService.generateActionToken(user.getEmail(), "RESET_PASSWORD", 3600000L); // 1 hour
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken);
            log.info("[AuthService] Password reset token generated and email dispatched for user: {}", email);
        } else {
            log.info("[AuthService] Password reset requested for non-existent email: {} (suppressing error for security)", email);
        }

        return Map.of("message", "If an account exists with that email, a password reset link has been sent.");
    }

    @Transactional
    public Map<String, String> resetPassword(ResetPasswordRequest request) {
        if (!jwtService.isActionTokenValid(request.token(), "RESET_PASSWORD")) {
            throw new BadRequestException("Invalid or expired password reset token.");
        }

        String email = jwtService.extractUsername(request.token());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for password reset."));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        log.info("[AuthService] Password successfully reset for user: {}", email);
        return Map.of("message", "Password has been successfully reset. You can now sign in with your new password.");
    }

    @Transactional
    public Map<String, String> verifyEmail(VerifyEmailRequest request) {
        if (!jwtService.isActionTokenValid(request.token(), "VERIFY_EMAIL")) {
            throw new BadRequestException("Invalid or expired email verification token.");
        }

        String email = jwtService.extractUsername(request.token());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email verification."));

        user.setStatus("VERIFIED");
        userRepository.save(user);

        log.info("[AuthService] Email successfully verified for user: {}", email);
        return Map.of("message", "Email has been successfully verified.");
    }
}
