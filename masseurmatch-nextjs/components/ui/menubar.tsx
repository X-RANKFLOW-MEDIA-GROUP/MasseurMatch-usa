"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import {
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
} from "lucide-react";

import { cn } from "./utils";

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "px-2 py-1 text-sm font-medium rounded-sm",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        className={cn(
          "z-50 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item>) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
        "focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm",
        "focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <MenubarPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </MenubarPrimitive.ItemIndicator>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm",
        "focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <MenubarPrimitive.ItemIndicator>
        <CircleIcon className="size-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger>) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        "flex items-center px-2 py-1.5 text-sm",
        "focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] rounded-md border bg-popover p-1 shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarRadioGroup,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarSubTrigger,
  MenubarSubContent,
};
