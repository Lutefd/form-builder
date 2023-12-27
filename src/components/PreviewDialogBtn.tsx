import { ScanEye } from "lucide-react";
import { Button } from "./ui/button";

function PreviewDialogBtn() {
  return (
    <Button variant="outline" className="gap-2">
      <ScanEye className="h-5 w-5" />
      Pré-visualizar
    </Button>
  );
}

export default PreviewDialogBtn;
