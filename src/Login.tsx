import React, { useState } from 'react';
import { useMaintenance } from './store';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { users, setCurrentUser } = useMaintenance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.email === email);
    
    if (!user) {
      setError('Usuário não encontrado.');
      return;
    }

    // Since we just added passwords, some users might not have one in localStorage.
    // We'll allow login if password matches, or if user has no password set yet (for backward compatibility during testing).
    const isPasswordCorrect = user.password === password || (!user.password && password === '123');

    if (isPasswordCorrect) {
      setCurrentUser(user);
    } else {
      setError('Senha incorreta.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 bg-slate-900 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Giga Plan</h1>
          <p className="text-slate-400 mt-2">Sistema de Gestão de Manutenção</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Acesse sua conta</h2>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Contas de Teste:</h3>
            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between">
                <span><strong>Admin:</strong> admin@gigaplan.com</span>
                <span className="text-gray-400">senha: admin</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Técnico:</strong> joao@gigaplan.com</span>
                <span className="text-gray-400">senha: 123</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Visualizador:</strong> maria@gigaplan.com</span>
                <span className="text-gray-400">senha: 123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
