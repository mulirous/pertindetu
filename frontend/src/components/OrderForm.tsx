import { useState } from "react";import { useState } from 'react';

import { useAuth } from "../context/AuthContext";import { api, getMockUserId } from '../api';

import { Card } from "./ui/card";

import { Button } from "./ui/button";interface OrderFormProps {

import { ordersApi, type OrderCreateData } from "../api";  serviceId: number;

import { Calendar } from "lucide-react";  providerId: number;

  basePrice: number;

interface OrderFormProps {}

  serviceId: number;

  providerId: number;export function OrderForm({ serviceId, providerId, basePrice }: OrderFormProps) {

  serviceName: string;  const [quantity, setQuantity] = useState(1);

  basePrice: number;  const [eventDate, setEventDate] = useState('');

  onSuccess?: () => void;  const [details, setDetails] = useState('');

  onCancel?: () => void;  const [error, setError] = useState<string | null>(null);

}

  const handleSubmit = async (e: React.FormEvent) => {

export function OrderForm({    e.preventDefault();

  serviceId,    setError(null);

  providerId,

  serviceName,    const clientId = getMockUserId();

  basePrice,

  onSuccess,    const orderData = {

  onCancel,      status: "PENDING", // O status inicial é pendente

}: OrderFormProps) {      details: details,

  const { user } = useAuth();      quantity: Number(quantity),

  const [isSubmitting, setIsSubmitting] = useState(false);      value: Number(quantity) * basePrice,

  const [formData, setFormData] = useState({      eventDate: new Date(eventDate).toISOString(),

    quantity: 1,      clientId: clientId,

    details: "",      providerId: providerId,

    eventDate: "",      serviceId: serviceId,

  });    };



  const totalValue = basePrice * formData.quantity;    try {

      const response = await api.post('/orders', orderData);

  const handleSubmit = async (e: React.FormEvent) => {      

    e.preventDefault();      console.log('Pedido criado com sucesso!', response.data);



    if (!user) {    } catch (err: any) {

      alert("Você precisa estar logado para fazer um pedido");      console.error('Erro ao criar pedido:', err);

      return;      setError(err.response?.data?.message || 'Erro desconhecido');

    }    }

  };

    setIsSubmitting(true);

    try {  return (

      const orderData: OrderCreateData = {    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-slate-50">

        serviceId,      <h3>Contratar Serviço</h3>

        clientId: user.id,      <div>

        providerId,        <label>Data do Evento/Serviço:</label>

        quantity: formData.quantity,        <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full border rounded p-2" />

        value: basePrice,      </div>

        details: formData.details || undefined,      <div>

        eventDate: formData.eventDate || undefined,        <label>Quantidade:</label>

      };        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} required className="w-full border rounded p-2" />

      </div>

      await ordersApi.create(orderData);       <div>

      alert("Pedido criado com sucesso! Aguarde a resposta do prestador.");        <label>Detalhes (ex: sabor do bolo, cor, etc.):</label>

      onSuccess?.();        <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full border rounded p-2" />

    } catch (error) {      </div>

      console.error("Erro ao criar pedido:", error);      

      alert("Erro ao criar pedido. Tente novamente.");      <div className="font-bold">

    } finally {        Valor Total: R$ {(quantity * basePrice).toFixed(2)}

      setIsSubmitting(false);      </div>

    }

  };      {error && <p className="text-red-500">{error}</p>}

      

  const handleInputChange = (      <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">

    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>        Confirmar Pedido

  ) => {      </button>

    const { name, value } = e.target;    </form>

    setFormData((prev) => ({ ...prev, [name]: value }));  );

  };}

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
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Enviando..." : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
