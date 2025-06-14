
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
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 particles pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 15}s`
            }}
          />
        ))}
      </div>

      {/* Left Panel - Welcome Section */}
      <div className={`flex-1 relative maple-leaf-bg hero-gradient flex items-center justify-center p-8 transform transition-all duration-1000 ease-in-out ${
        isLogin ? 'translate-x-0' : 'translate-x-full'
      } ${isLogin ? 'order-1' : 'order-2'}`}>
        {/* Floating 3D Shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 shape-blob floating-element opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 shape-organic floating-element opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 glass-canadian rounded-full floating-element opacity-40 animate-spin"></div>
        <div className="absolute top-1/4 right-1/3 w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-lg floating-element opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl floating-element opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-md transform transition-all duration-500">
          <div className="glass-canadian p-8 rounded-3xl backdrop-blur-xl border border-white/30 animate-stagger shadow-2xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 gradient-text animate-fade-in">
              {isLogin ? 'Welcome Back!' : 'Hello, Friend!'}
            </h1>
            <p className="text-gray-700 mb-8 text-lg font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {isLogin 
                ? 'To keep connected with us please login with your personal info' 
                : 'Enter your personal details and start your journey with us'
              }
            </p>
          </div>
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-primary/20 to-transparent rounded-full animate-morph"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-accent/20 to-transparent rounded-full animate-morph" style={{ animationDelay: '5s' }}></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-300/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
      </div>

      {/* Right Panel - Enhanced Form Section */}
      <div className={`flex-1 flex items-center justify-center p-8 relative transform transition-all duration-1000 ease-in-out ${
        isLogin ? 'translate-x-0' : '-translate-x-full'
      } ${isLogin ? 'order-2' : 'order-1'}`}
      style={{
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%),
          radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)
        `
      }}>
        {/* Subtle animated background shapes for form section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-red-100/30 to-transparent rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-bl from-green-100/30 to-transparent rounded-lg animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-gradient-to-tl from-purple-100/20 to-transparent rounded-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              {isLogin ? 'Sign in' : 'Create Account'}
            </h2>
            <div className="flex justify-center space-x-4 mb-4">
              <button className="p-3 border border-gray-200 rounded-full hover:bg-white/80 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Facebook className="h-5 w-5 text-blue-600" />
              </button>
              <button className="p-3 border border-gray-200 rounded-full hover:bg-white/80 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Mail className="h-5 w-5 text-red-500" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {isLogin ? 'or use your account' : 'or use your email for registration'}
            </p>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-white/80 hover:shadow-md px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </Button>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-xl">
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
                            className="h-12 bg-white/70 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
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
                          className="h-12 bg-white/70 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
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
                          className="h-12 bg-white/70 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
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
                      className="text-sm text-gray-600 hover:text-primary transition-colors hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl" 
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
    </div>
  );
};

export default AuthPage;
