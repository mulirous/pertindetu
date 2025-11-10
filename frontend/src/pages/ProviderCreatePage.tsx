import { ProviderForm } from "../components/ProviderForm";

export default function ProviderCreatePage() {

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Torne-se um Prestador
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Preencha os dados abaixo para criar seu perfil profissional na Pertindetu.
        </p>
        
        {/* Aqui usamos o formulário que já tínhamos feito */}
        <ProviderForm />
      </div>
    </div>
  );
}