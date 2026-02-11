package com.chitfund.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // MUST be Base64 encoded 256-bit key
    private static final String SECRET_KEY =
            "bXlzZWNyZXRrZXlteXNlY3JldGtleW15c2VjcmV0a2V5MTIzNDU2Nzg5MDEyMw==";

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // =========================
    // Extract Username
    // =========================
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // =========================
    // Extract Any Claim
    // =========================
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    // =========================
    // Generate Token
    // =========================
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getSignInKey())
                .compact();
    }

    // =========================
    // Validate Token
    // =========================
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // =========================
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // =========================
    private Claims extractAllClaims(String token) {
       try {
           return Jwts.parserBuilder()
                  .setSigningKey(getSignInKey())
                  .build()
                  .parseClaimsJws(token)
                  .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }

}