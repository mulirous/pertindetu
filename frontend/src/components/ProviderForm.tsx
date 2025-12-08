import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { providerApi, categoriesApi, userApi } from "../api";
import type { CategoryData } from "../api";
import { useAuth } from "../context/AuthContext";

export function ProviderForm() {
  const { userId, refreshProvider, loadUserData } = useAuth();
  const [bio, setBio] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Carregar categorias ao montar o componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoriesApi.getAll();
        setCategories(cats);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setError("Erro ao carregar categorias");
      }
    };
    loadCategories();
  }, []);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("Você precisa estar logado");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Selecione pelo menos uma categoria");
      return;
    }

    setLoading(true);

    const providerData = {
      bio,
      verified: false,
      pixKey,
      userId,
      categoryIds: selectedCategories,
    };

    try {
      // 1. Primeiro, transforma o usuário em PROVIDER
      await userApi.becomeProvider(userId);

      // 2. Atualiza os dados do usuário no contexto (para refletir a nova role)
      await loadUserData();

      // 3. Cria o perfil de prestador
      await providerApi.create(providerData);

      // 4. Atualiza o provider no contexto
      await refreshProvider();

      // 5. Redirecionar para o perfil
      navigate("/profile");
    } catch (err: any) {
      console.error("Erro ao criar prestador:", err);
      setError(
        err.response?.data?.message || "Erro ao criar perfil de prestador"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Torne-se um Prestador</h2>
        <p className="text-muted-foreground">
          Preencha as informações abaixo para oferecer seus serviços na
          plataforma
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Sobre você (Bio)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          rows={4}
          placeholder="Conte um pouco sobre sua experiência e serviços..."
          className="w-full px-4 py-3 border-2 border-border rounded-lg text-base placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Chave Pix</label>
        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          required
          placeholder="Digite sua chave Pix"
          className="w-full px-4 py-3 border-2 border-border rounded-lg text-base placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Categorias de Serviço
        </label>
        <p className="text-sm text-muted-foreground">
          Selecione as categorias em que você atua
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 p-3 border-2 border-border rounded-lg cursor-pointer hover:bg-secondary"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg text-base transition-colors"
      >
        {loading ? "Criando..." : "Criar Perfil de Prestador"}
      </button>
    </form>
  );
}
