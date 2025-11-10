import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const LOGGED_IN_USER_ID = 1; 

export function ProviderForm() {
  const [bio, setBio] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [categoryId, setCategoryId] = useState(''); 
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const providerData = {
      bio: bio,
      verified: false, 
      pixKey: pixKey,
      profilePhotoUrl: "default.jpg", 
      userId: LOGGED_IN_USER_ID, 
      categoryIds: [Number(categoryId)] 
    };

    try {
      const response = await api.post('/providers', providerData);
      
      console.log('Perfil de Prestador criado!', response.data);
      if (response.data && response.data.id) {
        
        const newProviderId = response.data.id;
        
        console.log(`Redirecionando para /profile/${newProviderId}`);
        
        navigate(`/profile/${newProviderId}`);

      } else {
        console.warn("Provider created, but response format was unexpected (missing ID). Navigating to dashboard.");
        navigate('/dashboard');
      }

    } catch (err: any) {
      console.error('Erro ao criar prestador:', err);
      setError(err.response?.data?.message || 'Erro desconhecido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2>Criar Perfil de Prestador</h2>
      <div>
        <label>Bio (Descrição):</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>Chave Pix:</label>
        <input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>ID da Categoria Principal:</label>
        <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Criar Perfil
      </button>
    </form>
  );
}   