import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function OAuthCallback() {
  const { loginGoogle } = useAuth();
  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      loginGoogle(token);
      navigate("/dashboard");
    }
  }, [token, loginGoogle, navigate]);

  return null;
}
