package com.pertindetu.dev.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class OpenApiConfig implements WebMvcConfigurer {

  @Bean
  public OpenAPI baseOpenAPI() {
    // Provide minimal metadata so the Swagger UI is easier to identify.
    return new OpenAPI()
        .components(new Components())
        .info(new Info()
            .title("Pertindetu - Dev")
            .description("Documentacao automatizada da API gerada pelo Springdoc OpenAPI.")
            .version("v1.0.0")
            .contact(new Contact()
                .name("Equipe Dev")));
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
  }
}
