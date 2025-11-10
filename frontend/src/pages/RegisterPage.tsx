"use client"

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cellphoneNumber: "",
  })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem.")
      return
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      cellphoneNumber: formData.cellphoneNumber,
    }

    try {
      await api.post("/users", userData)
      
      navigate("/login")

    } catch (err: any) {
      console.error("Erro no registro:", err)
      setError(err.response?.data?.error || "Erro ao criar conta.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Link to="/" className="absolute top-6 right-6 text-foreground text-2xl" aria-label="Close">
        ✕
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-foreground mb-12">Criar nova conta</h1>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* 6. Campos do formulário atualizados */}
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />
          
          <input
            type="text"
            name="cellphoneNumber" // Campo Adicionado
            placeholder="Celular (com DDD)"
            value={formData.cellphoneNumber}
            onChange={handleChange}
            className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-lg text-lg transition-colors"
          >
            CADASTRAR
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="space-y-4 text-center text-foreground">
            <div>
              <Link to="/login" className="hover:underline font-medium">
                Entrar em uma conta Existente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}