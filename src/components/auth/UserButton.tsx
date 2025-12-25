import { UserButton as ClerkUserButton, OrganizationSwitcher, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const UserButton = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isSignedIn) {
    return (
      <Link to="/sign-in">
        <Button variant="outline" size="sm" className="gap-2">
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <OrganizationSwitcher
        appearance={{
          elements: {
            organizationSwitcherTrigger: 'text-foreground hover:bg-muted p-2 rounded-md',
            organizationPreviewTextContainer: 'text-foreground',
            organizationSwitcherPopoverCard: 'bg-card border border-border',
            organizationSwitcherPopoverActionButton: 'text-foreground hover:bg-muted',
          }
        }}
      />
      <ClerkUserButton
        appearance={{
          elements: {
            avatarBox: 'w-9 h-9',
            userButtonPopoverCard: 'bg-card border border-border',
            userButtonPopoverActionButton: 'text-foreground hover:bg-muted',
            userButtonPopoverActionButtonText: 'text-foreground',
            userButtonPopoverFooter: 'hidden',
          },
        }}
      />
    </div>
  );
};

export default UserButton;
