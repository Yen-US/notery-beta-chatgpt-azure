'use client'
import { Button } from "@/components/ui/button"
import { PersonIcon } from "@radix-ui/react-icons"
import { signIn, signOut, useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export default function UserLoginButton() {
  const { data: session } = useSession()
  let user = useRef('')

  useEffect(() => {
    if (!session) return;
    if (session.user === user) return;
    user.current = session?.user?.name ?? '';
    const saveUser = async () => {
      try {
        const result = await fetch('/api/saveLogin', { method: 'POST', body: JSON.stringify({ name: session?.user?.name, email: session?.user?.email }) });
        console.log('User data saved:', result);
      } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
      }
    };

    // Call the asynchronous function
    saveUser();
  }, [session]);

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>

            <TooltipTrigger asChild>
              <Button variant="outline" className="flex justify-between relative" size="icon">
                {session ? (
                  <Avatar className="absolute left-[3px] h-7 w-7">
                    <AvatarImage src={session.user?.image ?? ''} />
                    <AvatarFallback>{session.user?.name ?? ''}</AvatarFallback>
                  </Avatar>
                ) : (
                  <PersonIcon className="absolute left-2 h-[1.2rem] w-[1.2rem] transition-all" />
                )}
                <h2 className="absolute left-12  text-md sm:hidden">{session ? (
            'Hi! ' + session?.user?.name ?? ''
          ) : (
            'Who are you?'
          )}</h2>
              </Button>
            </TooltipTrigger>

          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account:</DropdownMenuLabel>
            {session ? <DropdownMenuLabel>{session?.user?.name?.slice(0, 9) + '...' ?? ''}</DropdownMenuLabel> : <DropdownMenuLabel>Not Signed In</DropdownMenuLabel>}
            <DropdownMenuSeparator />
            {session ? <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem> : <DropdownMenuItem onClick={() => signIn()}>Sign In</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent className="sm:block hidden">
          <p>{session ? (
            'Hi! ' + session?.user?.name ?? ''
          ) : (
            'Who are you?'
          )}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
