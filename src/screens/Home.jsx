export default function Home(){
    const handleLogout = async () => {
        setError(null);

        if (!formData.key) { setError('Introduce la clave para cerrar sesión'); return; }

        const rawBody = '';

        try {

            console.log("COSAAA")
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
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        }
    };
    if (!token) return null;
  
  
  
  
  
  
  
  
  return (
      <>
      <h1>Home</h1>
      <a href="/login">Login</a>
      <a href="/sign-up">Register</a>

      <button type="button" onClick={handleLogout}>
                    Logout
                </button>

      </>

    )
}