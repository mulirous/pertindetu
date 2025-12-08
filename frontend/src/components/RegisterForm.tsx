import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";

interface FormData {
  user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    cellphoneNumber: string;
  };
  address: {
    street: string;
    number: number;
    neighborhood: string;
    city: string;
    federativeUnit: string;
    postalCode: string;
  };
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    user: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cellphoneNumber: "",
    },
    address: {
      street: "",
      number: 0,
      neighborhood: "",
      city: "",
      federativeUnit: "",
      postalCode: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value,
      },
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (formData.user.password !== formData.user.confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    if (formData.user.password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    if (formData.address.number <= 0) {
      setError("O número do endereço deve ser maior que zero.");
      return;
    }

    const cepLimpo = formData.address.postalCode.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setError("O CEP deve ter exatamente 8 dígitos.");
      return;
    }

    if (formData.address.federativeUnit.length !== 2) {
      setError("A UF deve ter exatamente 2 caracteres.");
      return;
    }

    try {
      const response = await authApi.register({
        user: {
          name: formData.user.name,
          email: formData.user.email,
          password: formData.user.password,
          cellphoneNumber: formData.user.cellphoneNumber,
          role: "CLIENT",
        },
        address: {
          ...formData.address,
          number: Number(formData.address.number),
          postalCode: cepLimpo,
          federativeUnit: formData.address.federativeUnit.toUpperCase(),
        },
      });

      if (response.statusCode === 201) {
        navigate("/login");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar conta.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dados Pessoais</h2>
        <input
          type="text"
          name="user.name"
          placeholder="Nome Completo"
          value={formData.user.name}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
        />
        <input
          type="email"
          name="user.email"
          placeholder="E-mail"
          value={formData.user.email}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          name="user.cellphoneNumber"
          placeholder="Celular (com DDD)"
          value={formData.user.cellphoneNumber}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="password"
            name="user.password"
            placeholder="Senha"
            value={formData.user.password}
            onChange={handleChange}
            required
            className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            name="user.confirmPassword"
            placeholder="Confirmar senha"
            value={formData.user.confirmPassword}
            onChange={handleChange}
            required
            className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Endereço</h2>
        <input
          type="text"
          name="address.street"
          placeholder="Rua"
          value={formData.address.street}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="address.number"
            placeholder="Número"
            value={formData.address.number}
            onChange={handleChange}
            required
            className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            name="address.neighborhood"
            placeholder="Bairro"
            value={formData.address.neighborhood}
            onChange={handleChange}
            required
            className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <input
          type="text"
          name="address.city"
          placeholder="Cidade"
          value={formData.address.city}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="address.federativeUnit"
            placeholder="UF"
            maxLength={2}
            value={formData.address.federativeUnit}
            onChange={handleChange}
            required
            className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            name="address.postalCode"
            placeholder="CEP"
            value={formData.address.postalCode}
            onChange={handleChange}
            required
            className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-lg text-lg transition-colors"
      >
        CADASTRAR
      </button>
    </form>
  );
}
