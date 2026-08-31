package com.careerpilot.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;

    private static final long TOKEN_EXPIRATION_MS =
            1000L * 60 * 60 * 24;

    public JwtService(
            @Value("${JWT_SECRET}") String jwtSecret
    ) {
        byte[] keyBytes =
                Decoders.BASE64.decode(jwtSecret);

        this.signingKey =
                Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email) {

        Date now = new Date();

        Date expiration =
                new Date(
                        now.getTime()
                                + TOKEN_EXPIRATION_MS
                );

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    public String extractEmail(String token) {

        return extractClaims(token)
                .getSubject();
    }

    public boolean isTokenValid(String token) {

        try {
            extractClaims(token);
            return true;

        } catch (Exception exception) {
            return false;
        }
    }

    private Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}