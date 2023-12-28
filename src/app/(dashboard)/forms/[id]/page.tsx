import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import { StatsCard } from "../../page";
import {
  LucideFormInput,
  LucideMousePointerClick,
  LucideRouteOff,
  LucideView,
} from "lucide-react";
import {
  type ElementsType,
  type FormElementInstance,
} from "@/components/FormElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ptBR } from "date-fns/locale";
import { format, formatDistance } from "date-fns";
import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

async function BuilderPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const form = await GetFormById(params.id);
  if (!form) {
    throw new Error("Formulário não encontrado");
  }
  const visits = form.visits ?? 0;
  const submissions = form.submissions ?? 0;

  const submissionRate = visits ? (submissions / visits) * 100 : 0;

  const bounceRate = visits ? 100 - submissionRate : 0;
  return (
    <>
      <div className="border-b border-t border-muted py-10">
        <div className="container flex justify-between">
          <h1 className="truncate text-4xl font-bold">{form.name}</h1>
          <VisitBtn shareUrl={form.ShareURL} />
        </div>
      </div>
      <div className="border-b border-muted py-4">
        <div className="container flex items-center justify-between gap-2">
          <FormLinkShare shareUrl={form.ShareURL} />
        </div>
      </div>
      <div className="container grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Visitas Totais"
          icon={<LucideView className="text-blue-600" />}
          helperText="Todas as visitas dos formulários"
          value={visits.toLocaleString() ?? ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="Submissões Totais"
          icon={<LucideFormInput className="text-yellow-600" />}
          helperText="Todas as submissões dos formulários"
          value={submissions.toLocaleString() ?? ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="Taxa de Envios"
          icon={<LucideMousePointerClick className="text-green-600" />}
          helperText="Visitas que resultaram em submissões"
          value={`${submissionRate.toLocaleString()}%` ?? "0%"}
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Taxa de Rejeição"
          icon={<LucideRouteOff className="text-red-600" />}
          helperText="Visitas que não interagiram com os formulários"
          value={`${bounceRate.toLocaleString()}%` ?? "0%"}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>
      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

export default BuilderPage;

type Row = Record<string, string | Date> & {
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: string }) {
  const form = await GetFormWithSubmissions(id);
  if (!form) {
    throw new Error("Formulário não encontrado");
  }

  const formElements = form.content as FormElementInstance[];

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];
  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label as string,
          required: element.extraAttributes?.required as boolean,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });
  const rows: Row[] = [];
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content) as Record<string, string>;
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });
  return (
    <>
      <h1 className="my-4 text-2xl font-bold">Envios</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-right uppercase text-muted-foreground">
                Enviado há
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id] as string}
                  />
                ))}
                <TableCell className="text-right">
                  {formatDistance(new Date(row.submittedAt), new Date(), {
                    locale: ptBR,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}
