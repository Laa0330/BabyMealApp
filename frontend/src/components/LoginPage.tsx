import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Baby, Mail, Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in a real app, this would validate credentials
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-3xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5FCFD4] rounded-full mb-4">
            <Baby className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#2D3748' }}>Baby Feeding Tracker</h1>
          <p className="text-gray-600">
            {isSignUp
              ? 'Create an account to start tracking'
              : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-[#5FCFD4] hover:text-[#4FB9BE] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#5FCFD4] hover:bg-[#4FB9BE] rounded-xl"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6">
          <Separator />
        </div>

        {/* Toggle between Login and Sign Up */}
        <div className="text-center">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#5FCFD4] hover:text-[#4FB9BE] transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-[#E0F4F5] rounded-xl border border-[#B2F5EA]">
          <p className="text-[#2D3748] text-center">
            <span>Demo Mode</span>
            <br />
            <span className="text-[#5FCFD4]">
              Click "{isSignUp ? 'Create Account' : 'Sign In'}" with any email
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}
