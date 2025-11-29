package com.example.auth_service.controller;

import com.example.auth_service.dto.ChangePasswordRequestDto;
import com.example.auth_service.dto.ErrorResponseDto;
import com.example.auth_service.dto.LoginRequestDto;
import com.example.auth_service.dto.LoginResponseDto;
import com.example.auth_service.dto.RegisterRequestDto;
import com.example.auth_service.dto.RegisterResponseDto;
import com.example.auth_service.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Authentication", description = "APIs for user registration and authentication")
public class AuthController {

        private AuthService authService;

        public AuthController(AuthService authService) {
                this.authService = authService;
        }

        @PostMapping("/register")
        @Operation(summary = "Register new user", description = "Creates a new user account with email and username")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User successfully registered", content = @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterResponseDto.class))),
                        @ApiResponse(responseCode = "400", description = "Email already exists", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class))),
        })
        public ResponseEntity<RegisterResponseDto> registerUser(
                        @Parameter(description = "User registration request data", required = true) @RequestBody RegisterRequestDto requestDto) {
                RegisterResponseDto response = authService.registerUser(requestDto);
                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        @PostMapping("/login")
        @Operation(summary = "User login", description = "Authenticates user and returns access token as HTTP-only cookie")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully authenticated and cookie set", headers = @Header(name = "Set-Cookie", description = "HTTP-only access token cookie", schema = @Schema(type = "string", example = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/;"
                                        +
                                        " HttpOnly; SameSite=Lax"))),
                        @ApiResponse(responseCode = "400", description = "User does not exist", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class))),
                        @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class))),
        })
        public ResponseEntity<LoginResponseDto> loginUser(
                        @Parameter(description = "User login credentials", required = true) @RequestBody LoginRequestDto loginRequestDto) {
                String accessToken = authService.generateAccessTokenOnLogin(
                                loginRequestDto);
                ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .sameSite("Lax")
                                .build();

                LoginResponseDto responseBody = new LoginResponseDto(accessToken);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .body(responseBody);
        }

        @PostMapping("/change-password")
        @Operation(summary = "Change user password", description = "Allows a user to change their password")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Password successfully changed"),
                        @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class))),
                        @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class))),
        })
        public ResponseEntity<Void> changePassword(
                        @Parameter(description = "Old and new password data", required = true) @RequestBody ChangePasswordRequestDto requestDto,
                        @CookieValue(name = "accessToken") String token) {

                authService.changePassword(requestDto, token);
                return ResponseEntity.ok().build();
        }
}