import { useState } from "react";
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";


const BASE_URL_API="http://localhost:8080/api/v1/";


function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push(`Debe tener al menos 8 caracteres`);
  }
  if (!/\p{Lu}/u.test(password)) {
    errors.push("Debe contener al menos una mayúscula");
  }
  if (!/\p{Ll}/u.test(password)) {
    errors.push("Debe contener al menos una minuscula");
  }
  if (!/\d/.test(password)) {
    errors.push("Debe contener al menos un número");
  }
  if (!/[^\p{L}\p{N}\s]/u.test(password)) {
    errors.push("Debe contener al menos un carácter especial");
  }

  return { valid: errors.length === 0, errors };
}

export default function SignUp(){

    const navigate=useNavigate()

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    const [error,setError]=useState("");

    

    const handleSendForm=async ()=>{
        const { valid, errors } = validatePassword(password);
        if (!valid) {
          setError(errors.join(". "));
          return; // no se envía nada al servidor
        }

        const messageBody={"username":username,"password":password};
        const data=JSON.stringify(messageBody);

        try{
          let response=await fetch(BASE_URL_API+"/register",{method:'POST',
            body:data,
            headers:{"Content-Type":"application/json"}
            
          });
          if(response.status===400) setError("Falta el nombre de usuario o la contraseña");
          if(response.status===409) setError("Ese nombre de usuario ya existe");
          if(response.status==201) {
            setError("");
            navigate("/");
          }
        }catch(e){
          setError("Ha ocurrido un error en el envío");
        }
      }

    

    return (<>
      <h1>Register</h1>

      <div>
        <label htmlFor="username">Nombre </label>

        <input type="text" id="username" onChange={(event)=>{
          setUsername(event.target.value);

        }}/>

      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" onChange={(event)=>{
          setPassword(event.target.value);
        }}/>
      </div>

      <Alert severity="info" sx={{ my: 1 }}>
      La contraseña debe tener entre 8 y 128 caracteres e incluir una mayúscula,
      una minúscula, un número y un carácter especial.
      </Alert>

      <div>
        <button onClick={()=>{handleSendForm()}}>Enviar</button>
      </div>
       

      {error && <Alert severity="error" variant="filled" >{error}</Alert>}
      </>)

      

      
}
