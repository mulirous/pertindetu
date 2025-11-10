package com.pertindetu.dev.models.enums;

public enum OrderStatus {
  PENDING,      // Aguardando resposta do provider
  ACCEPTED,     // Provider aceitou
  REJECTED,     // Provider rejeitou
  IN_PROGRESS,  // Serviço em andamento
  COMPLETED,    // Serviço concluído
  CANCELLED     // Cancelado pelo cliente
}
