"use client";

import { type Form } from "@prisma/client";
import React from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";

function FormBuilder({ form }: { form: Form }) {
  return (
    <main className="flex w-full flex-col">
      <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
        <h2 className="truncate font-medium capitalize">
          <span className="mr-2 capitalize text-muted-foreground">
            Formulário:
          </span>
          {form.name}
        </h2>
        <div className="flex items-center gap-2">
          <PreviewDialogBtn />
          {!form.published && (
            <>
              <SaveFormBtn />
              <PublishFormBtn />
            </>
          )}
        </div>
      </nav>
      <div className="relative flex h-[200px] w-full flex-grow items-center justify-center overflow-y-auto bg-accent bg-[url(/graph-paper.svg)]">
        <Designer />
      </div>
    </main>
  );
}

export default FormBuilder;
