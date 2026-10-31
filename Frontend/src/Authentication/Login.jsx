import { useState } from 'react';
import { api } from '../lib/api';

export function LoginScreen() {

    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    // [ASSUNÇÃO] O token fica temporariamente no estado local até a Fase 2 definir a sessão.
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api.login({ email, password: senha });
            setToken(data.token);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        {error && <p role="alert">{error}</p>}
        {token && <p role="status">Login realizado com sucesso.</p>}
        </div>
    );
}