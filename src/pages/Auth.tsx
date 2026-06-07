import { useState } from 'react';
import { useAuth } from '../store/useAuth';

type Mode = 'signin' | 'signup';

export function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password, name, username);
      if (error) {
        setError(error);
      } else {
        setInfo('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
      }
    }
    setLoading(false);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setInfo(null);
  }

  return (
    <div className="min-h-screen bg-espresso-800 flex flex-col items-center justify-center px-5">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">☕</div>
        <h1 className="text-4xl font-black text-white tracking-tight">coffeee</h1>
        <p className="text-espresso-300 text-sm mt-1.5">Track every cup. Build your taste.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Tab switcher */}
        <div className="flex border-b border-cream-200">
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                mode === m
                  ? 'text-espresso-900 border-b-2 border-espresso-800'
                  : 'text-gray-400'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="p-6 space-y-3">
          {mode === 'signup' && (
            <>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
                className="input-field"
              />
              <input
                type="text"
                placeholder="Username (e.g. alexmueller)"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
                className="input-field"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus={mode === 'signin'}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
          />

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl py-2 px-3">
              {error}
            </p>
          )}
          {info && (
            <p className="text-green-600 text-sm text-center bg-green-50 rounded-xl py-2 px-3">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !mt-4"
          >
            {loading
              ? 'Please wait…'
              : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="text-espresso-400 text-xs mt-6 text-center px-6">
        By signing up you agree that this is a demo app and your data may be reset at any time.
      </p>
    </div>
  );
}
