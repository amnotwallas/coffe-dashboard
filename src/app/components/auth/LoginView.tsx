import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Coffee, Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('¡Bienvenido de nuevo!');
    } catch (error: any) {
      console.error(error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF9F2] via-[#F5EDE4] to-[#A78D7B]/20 p-4 font-sans relative overflow-hidden">
      {/* Abstract Glass Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A78D7B]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#482C20]/5 rounded-full blur-[120px]" />

      <Card className="w-full max-w-md border border-white/40 bg-white/40 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(72,44,32,0.1)] rounded-[48px] overflow-hidden relative z-10">
        <div className="h-1.5 bg-gradient-to-r from-[#A78D7B] to-[#482C20] opacity-50" />
        <CardHeader className="space-y-2 flex flex-col items-center pt-10 pb-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/60 backdrop-blur-md p-5 rounded-[24px] mb-4 shadow-sm border border-white/40"
          >
            <Coffee className="w-12 h-12 text-[#482C20]" />
          </motion.div>
          <CardTitle className="text-4xl font-black text-[#482C20] tracking-tighter text-center">
            Casa Chill
          </CardTitle>
          <CardDescription className="text-[#A78D7B] font-bold uppercase tracking-[0.2em] text-[10px]">
            Panel de Administración
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#482C20]/70 ml-1">
                Correo Electrónico
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#482C20]/40 group-focus-within:text-[#482C20] transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@casachill.com" 
                  className="pl-12 h-12 border-white/40 bg-white/40 backdrop-blur-md focus:bg-white/60 transition-all rounded-2xl placeholder:text-muted-foreground/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" title="password" className="text-sm font-semibold text-[#482C20]/70 ml-1">
                  Contraseña
                </Label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#482C20]/40 group-focus-within:text-[#482C20] transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-12 h-12 border-white/40 bg-white/40 backdrop-blur-md focus:bg-white/60 transition-all rounded-2xl placeholder:text-muted-foreground/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-4 pb-12">
            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-[#482C20] to-[#634436] hover:from-[#3a231a] hover:to-[#4d3529] text-white font-bold rounded-2xl shadow-[0_20px_40px_-12px_rgba(72,44,32,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Entrar al Panel'
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="bg-white/20 backdrop-blur-sm p-4 border-t border-white/20 flex justify-center items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78D7B]/40" />
            <p className="text-[10px] text-[#482C20]/60 font-bold uppercase tracking-widest">
                Casa Chill & Coffee
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78D7B]/40" />
        </div>
      </Card>
    </div>
  );
};
