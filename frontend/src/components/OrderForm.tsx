import { useState } from 'react';
import { api, getMockUserId } from '../api';

interface OrderFormProps {
  serviceId: number;
  providerId: number;
  basePrice: number;
}

export function OrderForm({ serviceId, providerId, basePrice }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [eventDate, setEventDate] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clientId = getMockUserId();

    const orderData = {
      status: "PENDING", // O status inicial é pendente
      details: details,
      quantity: Number(quantity),
      value: Number(quantity) * basePrice,
      eventDate: new Date(eventDate).toISOString(),
      clientId: clientId,
      providerId: providerId,
      serviceId: serviceId,
    };

    try {
      const response = await api.post('/orders', orderData);
      
      console.log('Pedido criado com sucesso!', response.data);

    } catch (err: any) {
      console.error('Erro ao criar pedido:', err);
      setError(err.response?.data?.message || 'Erro desconhecido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-slate-50">
      <h3>Contratar Serviço</h3>
      <div>
        <label>Data do Evento/Serviço:</label>
        <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>Quantidade:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} required className="w-full border rounded p-2" />
      </div>
       <div>
        <label>Detalhes (ex: sabor do bolo, cor, etc.):</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full border rounded p-2" />
      </div>
      
      <div className="font-bold">
        Valor Total: R$ {(quantity * basePrice).toFixed(2)}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">
        Confirmar Pedido
      </button>
    </form>
  );
}