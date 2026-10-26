import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Revoke() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleRevoke = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch('https://localhost:8443/api/v1/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ reason })
            });

            if (response.ok) {
                localStorage.removeItem('token');
                alert("Certificado revocado con éxito. Tu sesión ha sido cerrada.");
                navigate('/', { replace: true });
            } else {
                const errText = await response.text();
                setError(errText || 'Error al revocar el certificado');
            }
        } catch {
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Revocar Certificado Activo</h2>
            <p style={{ color: 'orange' }}>
                <strong>Atención:</strong> Esta acción invalidará tu certificado mTLS actual de inmediato.
            </p>
            <form onSubmit={handleRevoke}>
                <div>
                    <label>Motivo de la revocación (opcional):</label><br />
                    <input 
                        type="text" 
                        placeholder="Ej. Pérdida o compromiso de dispositivo" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} 
                        style={{ width: '300px' }}
                    /><br />
                </div>
                <br />
                <button type="submit" style={{ backgroundColor: 'red', color: 'white' }}>
                    Confirmar Revocación
                </button>
                <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
                    Cancelar
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}