import { ClerkProvider } from '@clerk/clerk-react';
import { ReactNode } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

const ClerkProviderWrapper = ({ children }: ClerkProviderWrapperProps) => {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: 'hsl(141, 76%, 48%)',
          colorBackground: 'hsl(220, 20%, 6%)',
          colorInputBackground: 'hsl(220, 18%, 10%)',
          colorInputText: 'hsl(0, 0%, 98%)',
          colorText: 'hsl(0, 0%, 98%)',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'bg-card border border-border shadow-xl',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-secondary border border-border hover:bg-muted',
          formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          footerActionLink: 'text-primary hover:text-primary/80',
          identityPreviewText: 'text-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-input border-border text-foreground',
          dividerLine: 'bg-border',
          dividerText: 'text-muted-foreground',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
