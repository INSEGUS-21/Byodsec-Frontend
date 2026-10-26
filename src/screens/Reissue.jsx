import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Reissue() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [oldUsername, setOldUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleReissue = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch('https://localhost:8443/api/v1/reissue-identity', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    username_old: oldUsername,
                    password_old: oldPassword,
                    username_new: newUsername,
                    password_new: newPassword
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `${newUsername}.p12`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);

                localStorage.removeItem('token');
                alert("Identidad reemitida con éxito. Descargando nuevo certificado .p12");
                navigate('/', { replace: true });
            } else {
                const errText = await response.text();
                setError(errText || 'Error al reemitir la identidad');
            }
        } catch {
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Reemitir Identidad y Certificado</h2>
            <form onSubmit={handleReissue}>
                <div>
                    <label>Usuario actual:</label><br />
                    <input type="text" required onChange={(e) => setOldUsername(e.target.value)} />
                </div>
                <div>
                    <label>Contraseña actual:</label><br />
                    <input type="password" required onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div>
                    <label>Nuevo usuario:</label><br />
                    <input type="text" required onChange={(e) => setNewUsername(e.target.value)} />
                </div>
                <div>
                    <label>Nueva contraseña:</label><br />
                    <input type="password" required onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <br />
                <button type="submit">Reemitir e Invalidar Certificado Antiguo</button>
                <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Cancelar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}