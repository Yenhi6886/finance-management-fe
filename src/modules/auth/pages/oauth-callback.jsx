import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useRef } from "react";
import { errorHandler } from "../../../shared/utils/errorHandler.js";

export default function OAuthCallback() {
  const { loginGoogle } = useAuth();
  const navigate = useNavigate();
  const processedRef = useRef(false);

  let [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (processedRef.current) return;
    if (error) {
      processedRef.current = true;
      errorHandler.handleApiError({ response: { data: { message: decodeURIComponent(error) } } });
      navigate("/login");
      return;
    }
    if (token) {
      processedRef.current = true;
      loginGoogle(token)
        .then(() => {
          navigate("/dashboard");
        })
        .catch((e) => {
          console.error('OAuth callback error:', e);
          navigate("/login");
        });
    }
  }, [token, error, loginGoogle, navigate]);

  return null;
}
