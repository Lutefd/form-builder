import { GetFormById } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import { StatsCard } from "../../page";
import {
  LucideFormInput,
  LucideMousePointerClick,
  LucideRouteOff,
  LucideView,
} from "lucide-react";

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
    </>
  );
}

export default BuilderPage;
