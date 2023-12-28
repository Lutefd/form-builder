"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { Share } from "lucide-react";

function FormLinkShare({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const shareLink = `${window.location.origin}/published-forms/${shareUrl}`;
  return (
    <div className="flex flex-grow items-center gap-4">
      <Input value={shareLink} readOnly />
      <Button
        className="w-[250px]"
        onClick={async () => {
          await navigator.clipboard.writeText(shareLink);
          toast({
            title: "Copiado!",
            description: "Link copiado para a área de transferência.",
          });
        }}
      >
        <Share className="mr-2 h-4 w-4" />
        Compartilhar Link
      </Button>
    </div>
  );
}

export default FormLinkShare;
