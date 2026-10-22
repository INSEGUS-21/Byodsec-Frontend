import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Home(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [error,setError]=useState("");

    const handleLogout = async () => {
        setError(null);
        const rawBody = '';
        try {
            const response = await fetch('http://localhost:8443/api/v1/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: rawBody
            });

            if (response.ok || response.status === 401) {
                localStorage.removeItem('token');
                navigate('/', { replace: true });
            } else {
                setError('No se pudo cerrar la sesión (¿clave incorrecta?)');
            }
        } catch {
            setError('No se pudo conectar con el servidor');
        }
    };
    
    
    return (
      <>
      <h1>Home</h1>
      <a href="/login">Login</a>
      <a href="/sign-up">Register</a>

      {token && <button type="button" onClick={handleLogout}>
                    Logout
                </button>}

    
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </>

    )
}