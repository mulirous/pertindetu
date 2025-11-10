"use client"

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[MOCK] Login attempt:", { email, password })

    login()
    
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Link to="/" className="absolute top-6 right-6 text-foreground text-2xl" aria-label="Close">
        ✕
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-foreground mb-12">Entrar</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Usuário ou e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 border-2 border-border rounded-lg text-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:border-primary"
          />

          <button
            type="submit"
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-lg text-lg transition-colors"
          >
            ENTRAR
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="space-y-4 text-center text-foreground">
            <div>
              {/* 6. Link do React Router */}
              <Link to="/register" className="hover:underline font-medium">
                Criar uma conta
              </Link>
            </div>
            <div>
              <Link to="/auth/forgot-password" className="hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}