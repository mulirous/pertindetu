import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ordersApi, type OrderCreateData } from "../api";
import { Calendar } from "lucide-react";

interface OrderFormProps {
  serviceId: number;
  providerId: number;
  serviceName: string;
  basePrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrderForm({
  serviceId,
  providerId,
  serviceName,
  basePrice,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    details: "",
    eventDate: "",
  });

  const totalValue = basePrice * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado para fazer um pedido");
      return;
    }

    setIsSubmitting(true);
    try {
      let eventDateValue: number | undefined = undefined;

      if (formData.eventDate) {
        const ms = Date.parse(formData.eventDate);
        if (Number.isNaN(ms)) {
          alert("Data do evento inválida.");
          setIsSubmitting(false);
          return;
        }
        eventDateValue = ms;
      }

      const orderData: OrderCreateData = {
        serviceId,
        clientId: user.id,
        providerId,
        quantity: formData.quantity,
        value: basePrice,
        details: formData.details || undefined,
        eventDate: eventDateValue,
      };

      await ordersApi.create(orderData);
      alert("Pedido criado com sucesso! Aguarde a resposta do prestador.");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Você precisa estar logado para fazer um pedido.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Solicitar Serviço</h3>
      <p className="text-sm text-muted-foreground mb-6">{serviceName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Quantidade <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Data do Evento (opcional)
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Detalhes / Observações (opcional)
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows={4}
            placeholder="Descreva detalhes importantes sobre o serviço que você precisa..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Preço base: R$ {basePrice.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              Quantidade: {formData.quantity}
            </span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {totalValue.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1">
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Enviando..." : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
