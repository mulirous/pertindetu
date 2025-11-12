"use client";

import { Link } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Link
        to="/"
        className="absolute top-6 right-6 text-foreground text-2xl"
        aria-label="Close"
      >
        ✕
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-foreground mb-12">
          Criar nova conta
        </h1>

        <RegisterForm />

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
  );
}
