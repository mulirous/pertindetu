import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { categoriesApi, servicesApi } from "../api";
import type { ServiceCreateData, CategoryData } from "../api";
import { useAuth } from "../context/AuthContext";

interface ServiceFormProps {
  onSuccess?: () => void;
}

export function ServiceForm({ onSuccess }: ServiceFormProps) {
  const { provider } = useAuth();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<ServiceCreateData>({
    title: "",
    description: "",
    basePrice: 0,
    active: true,
    avgDuration: 0,
    providerId: provider?.id || 0,
    categoryId: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (provider) {
      setFormData((prev) => ({ ...prev, providerId: provider.id }));
    }
  }, [provider]);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!provider) {
      alert("Você precisa ser um prestador para criar serviços");
      return;
    }

    setLoading(true);
    try {
      // Criar o serviço
      const service = await servicesApi.create(formData);

      // Se houver imagem, fazer upload
      if (imageFile) {
        await servicesApi.uploadMedia(service.id, imageFile);
      }

      alert("Serviço criado com sucesso!");

      // Limpar formulário
      setFormData({
        title: "",
        description: "",
        basePrice: 0,
        active: true,
        avgDuration: 0,
        providerId: provider.id,
        categoryId: categories[0]?.id || 0,
      });
      setImageFile(null);
      setImagePreview(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      alert("Erro ao criar serviço. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Criar Novo Serviço</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Preço Base (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basePrice: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Duração Média (horas)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={formData.avgDuration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  avgDuration: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagem do Serviço
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-full h-48 object-cover rounded-md"
            />
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="active" className="text-sm font-medium">
            Serviço Ativo
          </label>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Criando..." : "Criar Serviço"}
        </Button>
      </form>
    </Card>
  );
}
