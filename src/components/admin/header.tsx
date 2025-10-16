
'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { initializeFirebase } from '@/firebase';

export function Header() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { auth } = initializeFirebase();
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3 flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </form>
      </div>
      <ThemeToggle />
      <div className="relative">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            {userAvatar && (
              <Image
                src={userAvatar.imageUrl}
                width={36}
                height={36}
                alt="User Avatar"
                className="rounded-full"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <span className="sr-only">Toggle user menu</span>
        </button>
        {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-popover text-popover-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 animate-in fade-in-0 zoom-in-95 z-50" role="menu">
                <div className="px-3 py-2 text-sm font-semibold" role="none">My Account</div>
                <hr className="-mx-1 my-1 h-px bg-muted"/>
                <a href="/settings" className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent rounded-sm" role="menuitem">Settings</a>
                <a href="#" className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent rounded-sm" role="menuitem">Support</a>
                <hr className="-mx-1 my-1 h-px bg-muted"/>
                <a href="#" onClick={handleLogout} className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent rounded-sm" role="menuitem">Logout</a>
            </div>
        )}
      </div>
    </header>
  );
}
