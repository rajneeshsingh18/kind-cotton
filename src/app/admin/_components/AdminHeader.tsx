"use client";

import { Button } from "@/components/ui/button";
import { Menu, Package } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {/* This button will only be visible on mobile to open the sidebar drawer */}
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* You can add breadcrumbs or a search bar here later */}
      <div className="w-full flex-1">
        {/* Example: <Search placeholder="Search products..." /> */}
      </div>
    </header>
  );
}