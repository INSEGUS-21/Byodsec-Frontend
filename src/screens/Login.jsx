import { useState } from "react";
import { useNavigate } from "react-router";
import { sha256 } from 'js-sha256';


export default function Login(){
  
  const BASE_API= "http://localhost:8443/api/v1";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secretKey, setSecretKey] = useState("");


  async function login() {

    //el hmac del body + clave
    const body= JSON.stringify({ "username":username, "password": password });
    
    try{const res = await fetch(BASE_API+"/login", {method: "POST",
                  headers: {'Content-Type': 'application/json'}, 
                  body: body
                }                  
      );

      if (!res.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const data = await res.json(); //respuesta del backend al post que trae el token
      console.log(data) //pa depurar  
      localStorage.setItem("token", data.token);
      navigate("/")


    }catch(err){
      setError("No se pudo conectar con el servidor");

    }
  }

  return (   
      <>
      <h1>Login</h1>
      <form>

        <label htmlFor="secretKey">SecretKey:</label><br />
        <input type="password" id="secretKey" name="secretKey" onChange = {(event) => setSecretKey(event.target.value)} /><br />
      
        <label htmlFor="username">Username:</label><br />
        <input type="text" id="username" name="username" onChange = {(event) => setUsername(event.target.value)} /><br />

        <label htmlFor="password">Password:</label><br />
        <input type="password" id="password" name="password" onChange = {(event) => setPassword(event.target.value)} /><br />
        <button type="button" onClick={login}>Entrar</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
    )



}

