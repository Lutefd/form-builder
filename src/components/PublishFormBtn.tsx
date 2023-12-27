import React from "react";
import { Button } from "./ui/button";
import { BookOpenCheck } from "lucide-react";

function PublishFormBtn() {
  return (
    <Button variant="outline" className="gap-2">
      <BookOpenCheck className="h-5 w-5" />
      Publicar
    </Button>
  );
}

export default PublishFormBtn;
