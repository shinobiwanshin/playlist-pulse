import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8 z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Music className="w-6 h-6 text-primary" />
        </div>
        <span className="text-2xl font-bold text-foreground">Playlist Analyzer</span>
      </Link>

      {/* Sign Up Component */}
      <div className="z-10">
        <ClerkSignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
};

export default SignUp;
