"use client"

import * as React from "react"
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Session } from "next-auth"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ModelToggleProps {
  model: string;
  setModel?: (model: string) => void;
  session: Session | null;
}

export function ModelToggle({ model, setModel, session }: ModelToggleProps) {
  const modelsOptions = [
    { label: "GPT 4o mini", value: "gpt-4o-mini" },
    { label: "Dall-E 3", value: "dall-e-3" }

  ];
  
  const changeModel = (newModel: string) => {
    if (session === null) {
      toast.error("You need to be signed in to change the model.");
      return;
    }
  
    if (model !== newModel) {
      setModel && setModel(newModel);
      toast.success(`Model changed to ${modelsOptions.find(opt => opt.value === newModel)?.label}`);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>

            <TooltipTrigger asChild>
              <Button className="flex justify-between relative" variant="outline" size="icon">
                <StarFilledIcon className="absolute left-2 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <StarIcon className="absolute left-2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <h2 className="absolute left-12  text-md sm:hidden">Smart or dumb GPT?</h2>
              </Button>
            </TooltipTrigger>

          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          {modelsOptions.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => changeModel(option.value)}>
              {option.label}
            </DropdownMenuItem>
          ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent className="sm:block hidden">
          <p>Smart or dumb GPT?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
