import { useNavigate } from "react-router-dom";
import { ServiceForm } from "../components/ServiceForm";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function ServiceCreatePage() {
  const { user, isProvider } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isProvider) {
      navigate("/provider/create");
    }
  }, [user, isProvider, navigate]);

  const handleSuccess = () => {
    navigate("/profile");
  };

  if (!isProvider) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ServiceForm onSuccess={handleSuccess} />
    </div>
  );
}
