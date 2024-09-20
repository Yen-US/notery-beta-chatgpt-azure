"use client"

import * as React from "react"
import { CameraIcon } from "@radix-ui/react-icons"

import { Session } from "next-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

export interface SizeToggleProps {
  size: string;
  setSize?: (model: string) => void;
  session: Session | null;
  model: string;
}

export function SizeToggle({ size, setSize, session, model }: SizeToggleProps) {

  const sizeOptionsDalle2 = [
    { label: "256 x 256", value: "256x256" },
    { label: "512 x 512", value: "512x512" },
    { label: "1024 x 1024", value: "1024x1024" },
  ];
  const sizeOptionsDalle3 = [
    { label: "1024 x 1024", value: "1024x1024" },
    { label: "1024 x 1792", value: "1024x1792" },
    { label: "1792 x 1024", value: "1792x1024" }
  ];

  const changeSize = (newSize: string) => {
    if (session === null) {
      toast.error("You need to be signed in to change the size.");
      return;
    }

    if (size !== newSize) {
      setSize && setSize(newSize);
      toast.success(`Size changed to ${newSize}`);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>

            <TooltipTrigger asChild>
              <Button className="flex justify-between relative" variant="outline" size="icon">
                <CameraIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 left-2" />
                <CameraIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 left-2" />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {model === "dall-e-3" ? sizeOptionsDalle3.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => changeSize(option.value)}>
                {option.label}
              </DropdownMenuItem>
            )) : sizeOptionsDalle2.map((option) => (<DropdownMenuItem key={option.value} onClick={() => changeSize(option.value)}>
              {option.label}
            </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent className="sm:block hidden">
          <p>Image generated size</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
