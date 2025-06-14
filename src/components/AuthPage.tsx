
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Facebook, Mail } from 'lucide-react';

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      let result;
      
      if (isLogin) {
        result = await signIn(data.email, data.password);
      } else {
        result = await signUp(data.email, data.password, data.firstName, data.lastName);
      }

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: result.error.message,
        });
      } else {
        if (isLogin) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 particles pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Left Panel - Welcome Section */}
      <div className="flex-1 relative maple-leaf-bg hero-gradient flex items-center justify-center p-8">
        {/* Floating 3D Shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 shape-blob floating-element opacity-30"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 shape-organic floating-element opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 glass-canadian rounded-full floating-element opacity-40"></div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="glass-canadian p-8 rounded-3xl backdrop-blur-xl border border-white/30 animate-stagger">
            <h1 className="text-4xl font-bold text-white mb-4 gradient-text">
              {isLogin ? 'Welcome Back!' : 'Hello, Friend!'}
            </h1>
            <p className="text-white/90 mb-8 text-lg">
              {isLogin 
                ? 'To keep connected with us please login with your personal info' 
                : 'Enter your personal details and start your journey with us'
              }
            </p>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              variant="outline"
              className="canadian-button text-white border-white/40 hover:bg-white/20 px-8 py-3 rounded-full font-semibold"
            >
              {isLogin ? 'SIGN UP' : 'SIGN IN'}
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-primary/20 to-transparent rounded-full animate-morph"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-accent/20 to-transparent rounded-full animate-morph" style={{ animationDelay: '5s' }}></div>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Sign in' : 'Create Account'}
            </h2>
            <div className="flex justify-center space-x-4 mb-4">
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <Facebook className="h-5 w-5 text-blue-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <Mail className="h-5 w-5 text-red-500" />
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              {isLogin ? 'or use your account' : 'or use your email for registration'}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Name" 
                          {...field} 
                          className="h-12 bg-gray-100 border-0 rounded-lg placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        {...field} 
                        className="h-12 bg-gray-100 border-0 rounded-lg placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        {...field} 
                        className="h-12 bg-gray-100 border-0 rounded-lg placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:transform-none" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'SIGN IN' : 'SIGN UP'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
