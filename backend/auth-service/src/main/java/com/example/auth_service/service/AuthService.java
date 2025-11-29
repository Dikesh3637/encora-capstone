package com.example.auth_service.service;

import com.example.auth_service.dto.ChangePasswordRequestDto;
import com.example.auth_service.dto.LoginRequestDto;
import com.example.auth_service.dto.RegisterRequestDto;
import com.example.auth_service.dto.RegisterResponseDto;
import com.example.auth_service.entity.Token;
import com.example.auth_service.entity.User;
import com.example.auth_service.exception.EmailAlreadyPresentException;
import com.example.auth_service.exception.InvalidCredentialsException;
import com.example.auth_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AuthService {

  private UserRepository userRepository;
  private JwtUtilsService jwtUtilService;
  private PasswordEncoder passwordEncoder;

  public AuthService(
      UserRepository userRepository,
      JwtUtilsService jwtUtilsService,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.jwtUtilService = jwtUtilsService;
    this.passwordEncoder = passwordEncoder;
  }

  public RegisterResponseDto registerUser(RegisterRequestDto requestDto) {

    userRepository
        .findByEmail(requestDto.getEmail())
        .ifPresent(
            user -> {
              throw new EmailAlreadyPresentException(
                  "the user with email :" + user.getEmail() + " already present");
            });

    final String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

    User userToBeSaved = new User();
    userToBeSaved.setEmail(requestDto.getEmail());
    userToBeSaved.setUserName(requestDto.getUserName());
    userToBeSaved.setPassword(encodedPassword);

    String refreshTokenString = jwtUtilService.generateRefreshToken(userToBeSaved);

    Token token = new Token();
    token.setRefreshToken(refreshTokenString);
    token.setUser(userToBeSaved);
    userToBeSaved.setRefreshToken(token);

    User savedUser = userRepository.save(userToBeSaved);

    return new RegisterResponseDto(savedUser.getEmail(), savedUser.getUserName());
  }

  public String generateAccessTokenOnLogin(LoginRequestDto loginRequestDto) {
    User user = userRepository
        .findByEmail(loginRequestDto.getEmail())
        .orElseThrow(
            () -> new InvalidCredentialsException("the email or password is incorrect"));

    if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
      throw new InvalidCredentialsException("the email or password is incorrect");
    }

    String newRefreshTokenString = jwtUtilService.generateRefreshToken(user);

    Token newRefreshToken = new Token();
    newRefreshToken.setRefreshToken(newRefreshTokenString);
    newRefreshToken.setUser(user);
    user.setRefreshToken(newRefreshToken);

    userRepository.save(user);

    String accessToken = jwtUtilService.generateAccessToken(user);

    return accessToken;
  }

  public void changePassword(ChangePasswordRequestDto requestDto, String token) {
    System.out.println("Changing password for token: " + token);
    String email = jwtUtilService.extractClaim(token, "email");
    if (requestDto.getNewPassword().equals(requestDto.getOldPassword())) {
      throw new InvalidCredentialsException("the new password must be different from the old password");
    }
    User user = userRepository
        .findByEmail(email)
        .orElseThrow(
            () -> new InvalidCredentialsException("the email or password is incorrect"));
    if (!passwordEncoder.matches(requestDto.getOldPassword(), user.getPassword())) {
      throw new InvalidCredentialsException("the old password is incorrect");
    }

    final String encodedNewPassword = passwordEncoder.encode(requestDto.getNewPassword());
    user.setPassword(encodedNewPassword);
    userRepository.save(user);
  }
}