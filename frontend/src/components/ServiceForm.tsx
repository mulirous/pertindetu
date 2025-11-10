import { useState } from 'react';
import { api } from '../api';

const LOGGED_IN_PROVIDER_ID = 1;

export function ServiceForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [avgDuration, setAvgDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const serviceData = {
      title: title,
      description: description,
      basePrice: Number(basePrice),
      active: true,
      avgDuration: Number(avgDuration),
      providerId: LOGGED_IN_PROVIDER_ID,
      categoryId: Number(categoryId)
    };

    try {
      const response = await api.post('/services', serviceData);
      
      console.log('Serviço (anúncio) criado!', response.data);

    } catch (err: any) {
      console.error('Erro ao criar serviço:', err);
      setError(err.response?.data?.message || 'Erro desconhecido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2>Criar Novo Serviço (Anúncio)</h2>
      <div>
        <label>Título:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>Preço Base (R$):</label>
        <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required className="w-full border rounded p-2" />
      </div>
       <div>
        <label>Duração Média (minutos):</label>
        <input type="number" value={avgDuration} onChange={(e) => setAvgDuration(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>ID da Categoria:</label>
        <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Criar Serviço
      </button>
    </form>
  );
}