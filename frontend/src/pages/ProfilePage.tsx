"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { servicesApi } from "../api";
import type { ServiceData } from "../api";
import Header from "../components/header";
import Footer from "../components/footer";
import { ProviderForm } from "../components/ProviderForm";
import { User, Mail, Phone, Calendar, Badge, Plus } from "lucide-react";

export default function ProfilePage() {
  const { user, provider, isProvider, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    if (isProvider && provider) {
      loadServices();
    }
  }, [isProvider, provider]);

  const loadServices = async () => {
    if (!provider) return;

    setLoadingServices(true);
    try {
      const response = await servicesApi.getByProviderId(provider.id);
      console.log(response);
      setServices(response.content);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Você precisa estar logado
            </h2>
            <p className="text-muted-foreground">
              Faça login para acessar seu perfil
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Card */}
              <div className="bg-card border-2 border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">{user.name}</h1>
                      <div className="flex items-center space-x-2 mt-1">
                        {isProvider && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Badge className="w-3 h-3 mr-1" />
                            Prestador Verificado
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.active
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {user.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 border-2 border-border rounded-lg hover:bg-secondary transition-colors">
                    {isEditing ? "Cancelar" : "Editar Perfil"}
                  </button>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                    <span>{user.cellphoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Calendar className="w-5 h-5" />
                    <span>
                      Membro desde{" "}
                      {new Date(user.dateCreation).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              {isProvider && provider && (
                <>
                  <div className="bg-card border-2 border-border rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      Perfil de Prestador
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Bio</h3>
                        <p className="text-muted-foreground">{provider.bio}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Chave Pix</h3>
                        <p className="text-muted-foreground font-mono">
                          {provider.pixKey}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Categorias</h3>
                        <div className="flex flex-wrap gap-2">
                          {provider.categories.map((cat) => (
                            <span
                              key={cat.id}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Section */}
                  <div className="bg-card border-2 border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Meus Serviços</h2>
                      <button
                        onClick={() => navigate("/services/new")}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Novo Serviço</span>
                      </button>
                    </div>

                    {loadingServices ? (
                      <p className="text-muted-foreground text-center py-8">
                        Carregando serviços...
                      </p>
                    ) : services.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Você ainda não criou nenhum serviço
                        </p>
                        <button
                          onClick={() => navigate("/services/new")}
                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                          Criar Primeiro Serviço
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className="border-2 border-border rounded-lg p-4 hover:border-primary transition-colors">
                            {service.media && service.media.length > 0 && (
                              <img
                                src={service.media[0].mediaUrl}
                                alt={service.title}
                                className="w-full h-40 object-cover rounded-md mb-3"
                              />
                            )}
                            <h3 className="font-bold text-lg mb-2">
                              {service.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary">
                                R$ {service.basePrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {service.avgDuration}h
                              </span>
                            </div>
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  service.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                {service.active ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Become Provider Card */}
              {!isProvider && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3">
                    Torne-se um Prestador
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ofereça seus serviços na plataforma e comece a ganhar
                    dinheiro hoje mesmo!
                  </p>
                  <button
                    onClick={() => setShowProviderForm(!showProviderForm)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors">
                    {showProviderForm ? "Cancelar" : "Quero ser Prestador"}
                  </button>
                </div>
              )}

              {/* Provider Form */}
              {showProviderForm && !isProvider && (
                <div className="bg-card border-2 border-border rounded-lg p-6">
                  <ProviderForm />
                </div>
              )}

              {/* Stats Card (if provider) */}
              {isProvider && (
                <div className="bg-card border-2 border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Estatísticas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Serviços</span>
                      <span className="font-bold">{services.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pedidos</span>
                      <span className="font-bold">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avaliações</span>
                      <span className="font-bold">0</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
