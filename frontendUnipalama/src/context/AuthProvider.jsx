import { useState, useEffect, createContext } from 'react';

import clienteAxios from '../config/axios'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [cargando, setCargando] = useState(true);
    const [auth, setAuth] = useState({});

    useEffect(() => {
        const autenticarUsuario = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                setCargando(false);
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            
            try {
                const { data } = await clienteAxios('/usuarios/perfil', config);
                console.log("Datos del usuario:", data); // Verifica qué devuelve el backend
                setAuth(data); // almacena los datos del usuario
                // console.log(data);
                // console.log(auth);
                setCargando(false);
            } catch (error) {
                console.log(error.response.data.msg);
                setAuth({});
            }
            setCargando(false);
        };
        autenticarUsuario();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
    };

    const actualizarPerfil = async datos => {
        const token = localStorage.getItem('token')
        if (!token) {
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const url = `/usuarios/perfil/${datos._id}`
            await clienteAxios.put(url, datos, config)
            return {
                msg: 'Almacenado Correctamente'
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    };

    const guardarPassword = async (datos) => {
        const token = localStorage.getItem('token')
        if (!token) {
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const url = '/usuarios/actualizar-password'
            const { data } = await clienteAxios.put(url, datos, config)
            // console.log(data)
            return {
                msg: data.msg
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
};

export {
    AuthProvider
};
export default AuthContext;