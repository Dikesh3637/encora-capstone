import LoginForm from "../../components/loginForm";
import { useNavigate } from "react-router";
import { useUser } from "../../provider/userProvider";
import { useEffect } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const userContext = useUser();
  useEffect(() => {
    if (userContext.user) {
      navigate("/");
    }
  });

  return (
    <div className="login-page flex-1 grid grid-cols-2">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
