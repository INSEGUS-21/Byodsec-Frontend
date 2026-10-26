import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Home(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [error,setError]=useState("");
    const [message,setMessage]=useState("");
    const [reply, setreply] = useState("");

    const handleMessage = async (e) => {
        e.preventDefault();
        setError(null);
        setreply("");
        try{
            const response = await fetch('https://localhost:8443/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ message: message })
            });

            if (response.status === 200) {
                const data = await response.json();
                setreply(data.reply)
            } else {
                setError('No se pudo mandar el mensaje');
            }
        }catch{
            setError('No se pudo conectar con el servidor');
        }
    }
    const handleLogout = async () => {
        setError(null);
        const rawBody = '';
        try {
            const response = await fetch('https://localhost:8443/api/v1/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: rawBody
            });

            if (response.ok || response.status === 401) {
                localStorage.removeItem('token');
                navigate('/', { replace: true });
            } else {
                setError('No se pudo cerrar la sesión');
            }
        } catch {
            setError('No se pudo conectar con el servidor');
        }
    };
    
    
    return (
      <>
      <h1>Home</h1>
      {!token && <a href="/login">Login</a>}
      {!token && <a href="/sign-up">Register</a>}

      {token && (
                <div style={{ marginBottom: '20px' }}><button type="button" onClick={handleLogout}>
                    Logout
                </button>
                <button type="button" onClick={() => navigate('/reissue')} style={{ marginLeft: '10px' }}>
                    Reemitir Identidad / Certificado
                </button>
                <button type="button" onClick={() => navigate('/revoke')} style={{ marginLeft: '10px', color: 'red' }}>
                    Revocar Certificado
                </button>
                </div>
            )}

      {token && <form onSubmit={handleMessage}>
        <label htmlFor="message">Mensaje:</label><br />
        <input type="text" id="message" name="message" onChange = {(event) => setMessage(event.target.value)} /><br />

        <button type="submit">Enviar</button>
        {reply && (
                        <p style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>
                            {reply}
                        </p>
                    )}

      </form>}

    
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </>

    )
}