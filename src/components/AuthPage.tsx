
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Facebook, Mail, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
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
    setEmailConfirmationSent(false);
    
    try {
      let result;
      
      if (isLogin) {
        result = await signIn(data.email, data.password);
        if (result.error) {
          toast({
            variant: "destructive",
            title: "Sign In Error",
            description: result.error.message,
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate('/');
        }
      } else {
        result = await signUp(data.email, data.password, data.firstName, data.lastName);
        if (result.error) {
          if (result.error.code === "email_confirmation_required") {
            setEmailConfirmationSent(true);
            toast({
              title: "Account created!",
              description: result.error.message,
              duration: 10000,
            });
            // Don't clear form or switch to login yet - let user see the confirmation message
          } else {
            toast({
              variant: "destructive",
              title: "Sign Up Error",
              description: result.error.message,
            });
          }
        } else {
          toast({
            title: "Account created successfully!",
            description: "You can now sign in with your credentials.",
          });
          // Clear form and switch to login
          form.reset();
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
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

      {/* Main Container */}
      <div className="flex w-full relative">
        {/* Left Panel - Welcome Section */}
        <div 
          className={`w-1/2 relative maple-leaf-bg hero-gradient flex items-center justify-center p-8 transition-all duration-1000 ease-in-out ${
            isLogin ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            background: `
              linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(153, 27, 27, 0.95) 50%, rgba(127, 29, 29, 0.9) 100%),
              radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `
          }}
        >
          {/* Floating 3D Shapes */}
          <div className="absolute top-20 left-20 w-20 h-20 shape-blob floating-element opacity-30 animate-bounce"></div>
          <div className="absolute bottom-32 right-16 w-32 h-32 shape-organic floating-element opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 glass-canadian rounded-full floating-element opacity-40 animate-spin"></div>
          <div className="absolute top-1/4 right-1/3 w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-lg floating-element opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl floating-element opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Fixed Centered Welcome Text with Sturdy Font */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-black font-sans mb-6 text-white drop-shadow-2xl tracking-tight">
                {isLogin ? 'Welcome Back!' : 'Hello, Friend!'}
              </h1>
              <p className="text-xl font-bold font-sans text-white drop-shadow-lg max-w-md mx-auto leading-relaxed tracking-wide">
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
        <div 
          className={`w-1/2 flex items-center justify-center p-8 relative transition-all duration-1000 ease-in-out ${
            isLogin ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            background: `
              linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%),
              radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
              linear-gradient(45deg, rgba(147, 51, 234, 0.03) 0%, rgba(236, 72, 153, 0.03) 50%, rgba(59, 130, 246, 0.03) 100%)
            `
          }}
        >
          {/* Enhanced animated background shapes for form section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-purple-200/20 rounded-full animate-pulse blur-sm"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-red-200/40 to-pink-200/20 rounded-full animate-bounce blur-sm" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-bl from-green-200/40 to-emerald-200/20 rounded-lg animate-spin blur-sm" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-gradient-to-tl from-purple-200/30 to-indigo-200/20 rounded-2xl animate-pulse blur-sm" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-10 left-1/4 w-28 h-28 bg-gradient-to-br from-yellow-200/20 to-orange-200/15 rounded-full animate-bounce blur-sm" style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-10 right-10 w-14 h-14 bg-gradient-to-tl from-teal-200/30 to-cyan-200/20 rounded-lg animate-pulse blur-sm" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-8 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
                {isLogin ? 'Sign in' : 'Create Account'}
              </h2>
              <div className="flex justify-center space-x-4 mb-4">
                <button className="p-3 border border-gray-200 rounded-full hover:bg-white/90 hover:shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </button>
                <button className="p-3 border border-gray-200 rounded-full hover:bg-white/90 hover:shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                  <Mail className="h-5 w-5 text-red-500" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {isLogin ? 'or use your account' : 'or use your email for registration'}
              </p>
              
              {/* Email Confirmation Notice */}
              {emailConfirmationSent && !isLogin && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <CheckCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">Check your email!</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    We've sent you a confirmation link. Click it to verify your account, then return here to sign in.
                  </p>
                </div>
              )}
              
              <Button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmailConfirmationSent(false);
                  form.reset();
                }}
                variant="outline"
                className="text-gray-600 border-gray-300 hover:bg-white/90 hover:shadow-lg px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/60 shadow-2xl">
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
                              className="h-12 bg-white/80 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 backdrop-blur-sm"
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
                            className="h-12 bg-white/80 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 backdrop-blur-sm"
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
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Password" 
                              {...field} 
                              className="h-12 bg-white/80 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 backdrop-blur-sm pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
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
    </div>
  );
};

export default AuthPage;
