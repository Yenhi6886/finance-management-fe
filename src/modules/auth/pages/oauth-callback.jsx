import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useRef } from "react";

export default function OAuthCallback() {
  const { loginGoogle } = useAuth();
  const navigate = useNavigate();
  const processedRef = useRef(false);

  let [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token && !processedRef.current) {
      processedRef.current = true;
      
      loginGoogle(token)
        .then(() => {
          // Không show thông báo ở đây để tránh duplicate
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error('OAuth callback error:', error);
          navigate("/login");
        });
    }
  }, [token, loginGoogle, navigate]);

  return null;
}
