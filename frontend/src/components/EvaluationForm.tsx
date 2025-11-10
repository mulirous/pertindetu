import { useState } from 'react';
import { api, getMockUserId } from '../api';

interface EvaluationFormProps {
  orderId: number;
  providerProfileId: number;
}

export function EvaluationForm({ orderId, providerProfileId }: EvaluationFormProps) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clientId = getMockUserId();

    const evaluationData = {
      score: Number(score),
      comment: comment,
      orderId: orderId,
      clientId: clientId,
      providerProfileId: providerProfileId,
    };

    try {
      const response = await api.post('/evaluations', evaluationData);
      
      console.log('Avaliação enviada com sucesso!', response.data);

    } catch (err: any) {
      console.error('Erro ao enviar avaliação:', err);
      setError(err.response?.data?.message || 'Erro desconhecido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-slate-50">
      <h3>Avaliar este Serviço</h3>
      <div>
        <label>Nota (1 a 5):</label>
        <input type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} min={1} max={5} required className="w-full border rounded p-2" />
      </div>
       <div>
        <label>Comentário:</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
        Enviar Avaliação
      </button>
    </form>
  );
}