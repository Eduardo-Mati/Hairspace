import useState from 'react';

export function LoginScreen() {

    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5173/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: senha })
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error during login:', error);
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
        </div>
    );
}