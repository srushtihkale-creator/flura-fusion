package com.florafusion.service;

import com.florafusion.dto.auth.AuthResponse;
import com.florafusion.dto.auth.GoogleAuthRequest;
import com.florafusion.entity.Role;
import com.florafusion.entity.User;
import com.florafusion.repository.SecurityTokenRepository;
import com.florafusion.repository.UserRepository;
import com.florafusion.security.JwtService;
import com.florafusion.security.UserPrincipal;
import com.florafusion.service.email.EmailService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoogleAuthServiceTest {

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

    @Test
    @DisplayName("Google Auth - New user registration creates verified active customer account")
    void loginWithGoogle_NewUser_RegistersSuccessfully() {
        String testToken = "test_google_token:srushti.test@florafusion.com:Srushti Kale";
        GoogleAuthRequest request = new GoogleAuthRequest(testToken, null);

        when(userRepository.findByEmail("srushti.test@florafusion.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("bcrypt_generated_password_hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(UUID.randomUUID());
            return user;
        });
        when(jwtService.generateToken(any(UserPrincipal.class))).thenReturn("jwt_mock_token_srushti");

        AuthResponse response = authService.loginWithGoogle(request);

        assertNotNull(response);
        assertEquals("jwt_mock_token_srushti", response.token());
        assertEquals("srushti.test@florafusion.com", response.email());
        assertEquals("Srushti Kale", response.name());
        assertEquals("CUSTOMER", response.role());
        assertTrue(response.emailVerified());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("srushti.test@florafusion.com", savedUser.getEmail());
        assertEquals("Srushti Kale", savedUser.getName());
        assertEquals(Role.CUSTOMER, savedUser.getRole());
        assertTrue(savedUser.isEmailVerified());
        assertEquals("ACTIVE", savedUser.getStatus());
        assertEquals("bcrypt_generated_password_hash", savedUser.getPasswordHash());
    }

    @Test
    @DisplayName("Google Auth - Existing user logs in smoothly without creating duplicate account")
    void loginWithGoogle_ExistingUser_AuthenticatesSuccessfully() {
        String testToken = "test_google_token:existing@florafusion.com:Existing Customer";
        GoogleAuthRequest request = new GoogleAuthRequest(testToken, null);

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .name("Existing Customer")
                .email("existing@florafusion.com")
                .passwordHash("existing_hash")
                .role(Role.CUSTOMER)
                .emailVerified(true)
                .status("ACTIVE")
                .build();

        when(userRepository.findByEmail("existing@florafusion.com")).thenReturn(Optional.of(existingUser));
        when(jwtService.generateToken(any(UserPrincipal.class))).thenReturn("jwt_existing_token");

        AuthResponse response = authService.loginWithGoogle(request);

        assertNotNull(response);
        assertEquals("jwt_existing_token", response.token());
        assertEquals("existing@florafusion.com", response.email());
        assertEquals("Existing Customer", response.name());
        assertTrue(response.emailVerified());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Google Auth - Existing unverified user is activated upon verified Google login")
    void loginWithGoogle_ExistingUnverifiedUser_ActivatesAndAuthenticates() {
        String testToken = "test_google_token:pending@florafusion.com:Pending User";
        GoogleAuthRequest request = new GoogleAuthRequest(testToken, null);

        User pendingUser = User.builder()
                .id(UUID.randomUUID())
                .name("Pending User")
                .email("pending@florafusion.com")
                .passwordHash("pwd_hash")
                .role(Role.CUSTOMER)
                .emailVerified(false)
                .status("PENDING_VERIFICATION")
                .build();

        when(userRepository.findByEmail("pending@florafusion.com")).thenReturn(Optional.of(pendingUser));
        when(userRepository.save(any(User.class))).thenReturn(pendingUser);
        when(jwtService.generateToken(any(UserPrincipal.class))).thenReturn("jwt_pending_now_active");

        AuthResponse response = authService.loginWithGoogle(request);

        assertNotNull(response);
        assertEquals("jwt_pending_now_active", response.token());
        assertTrue(response.emailVerified());

        assertTrue(pendingUser.isEmailVerified());
        assertEquals("ACTIVE", pendingUser.getStatus());
        verify(userRepository).save(pendingUser);
    }

    @Test
    @DisplayName("Google Auth - Blank or missing token throws BadRequestException")
    void loginWithGoogle_BlankToken_ThrowsBadRequest() {
        GoogleAuthRequest emptyRequest = new GoogleAuthRequest("", "");
        assertThrows(com.florafusion.exception.BadRequestException.class, () -> authService.loginWithGoogle(emptyRequest));

        GoogleAuthRequest nullRequest = new GoogleAuthRequest(null, null);
        assertThrows(com.florafusion.exception.BadRequestException.class, () -> authService.loginWithGoogle(nullRequest));
    }

    @Test
    @DisplayName("Google Auth - Invalid token format throws BadRequestException")
    void loginWithGoogle_InvalidToken_ThrowsBadRequest() {
        GoogleAuthRequest invalidRequest = new GoogleAuthRequest("invalid_malformed_token_string", null);
        assertThrows(com.florafusion.exception.BadRequestException.class, () -> authService.loginWithGoogle(invalidRequest));
    }
}
