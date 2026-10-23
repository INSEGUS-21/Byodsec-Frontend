import { useState } from "react";
import { useNavigate } from "react-router";


export default function Login(){
  
  const BASE_API= "https://localhost:8443/api/v1";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault(); 
        setError("");

        if (!username || !password) {
          setError("Por favor, introduce usuario y contraseña");
          return;
        }

        const body = JSON.stringify({ username, password });

        try {
          await new Promise((resolve, reject) => {
            const popup = window.open(
              `${BASE_API}/auth-trigger`,
              'mTLSPrompt',
              'width=500,height=400'
            );

            if (!popup) {
              reject(new Error("POPUP_BLOCKED"));
              return;
            }

            const checkClosed = setInterval(() => {
              if (popup.closed) {
                clearInterval(checkClosed);
                resolve();
              }
            }, 300);
          });

          const res = await fetch(`${BASE_API}/login`, {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: body
          });

          if (!res.ok) {
            if (res.status === 401) {
              setError("Usuario o contraseña incorrectos, o certificado no autorizado");
            } else {
              setError("Error en la autenticación con el servidor");
            }
            return;
          }

          const data = await res.json();
          localStorage.setItem("token", data.token);
          navigate("/");

        } catch (err) {
          if (err.message === "POPUP_BLOCKED") {
            setError("Por favor, permite las ventanas emergentes en tu navegador para seleccionar el certificado.");
          } else {
            setError("No se pudo conectar con el servidor o se canceló la selección de certificado.");
          }
        }
      };
  return (   
      <>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label><br />
        <input type="text" id="username" name="username" onChange = {(event) => setUsername(event.target.value)} /><br />

        <label htmlFor="password">Password:</label><br />
        <input type="password" id="password" name="password" onChange = {(event) => setPassword(event.target.value)} /><br />
        <button type="submit">Entrar</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
    )



}

