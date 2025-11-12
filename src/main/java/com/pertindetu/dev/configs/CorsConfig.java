package com.pertindetu.dev.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração global de CORS para permitir requisições do frontend
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Permite CORS em todas as rotas
                .allowedOriginPatterns(
                    "http://localhost:5173",      // Vite dev server
                    "http://127.0.0.1:5173",      // Localhost alternativo
                    "http://localhost:3000"       // Caso mude a porta
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                .allowedHeaders("*")              // Permite todos os headers
                .exposedHeaders("*")              // Expõe todos os headers
                .allowCredentials(true)           // Permite cookies/auth
                .maxAge(3600L);                   // Cache preflight por 1 hora
    }
}