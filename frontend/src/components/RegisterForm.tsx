import { useState } from 'react';
import { api } from '../api';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const userData = {
      name: name,
      email: email,
      password: password,
      cellphoneNumber: cellphone,
    };

    try {
      const response = await api.post('/users', userData);
      
      console.log('Usuário criado com sucesso!', response.data);

    } catch (err: any) {
      console.error('Erro ao criar usuário:', err);
      setError(err.response?.data?.message || 'Erro desconhecido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2>Criar Conta de Cliente</h2>
      <div>
        <label>Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>Senha:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      <div>
        <label>Celular:</label>
        <input type="text" value={cellphone} onChange={(e) => setCellphone(e.target.value)} required className="w-full border rounded p-2" />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Registrar
      </button>
    </form>
  );
}