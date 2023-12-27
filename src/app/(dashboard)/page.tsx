import { GetFormStats } from "@/actions/form";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideFormInput,
  LucideMousePointerClick,
  LucideRouteOff,
  LucideView,
} from "lucide-react";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="col-span-2 text-4xl font-bold"> Seus Formulários</h2>
      <Separator className="my-6" />
      <CreateFormBtn />
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardsProps {
  loading: boolean;
  data?: Awaited<ReturnType<typeof GetFormStats>>;
}

function StatsCards({ loading, data }: StatsCardsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Visitas Totais"
        icon={<LucideView className="text-blue-600" />}
        helperText="Todas as visitas dos formulários"
        value={data?.visits.toLocaleString() ?? ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />
      <StatsCard
        title="Submissões Totais"
        icon={<LucideFormInput className="text-yellow-600" />}
        helperText="Todas as submissões dos formulários"
        value={data?.submissions.toLocaleString() ?? ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />
      <StatsCard
        title="Taxa de Envios"
        icon={<LucideMousePointerClick className="text-green-600" />}
        helperText="Visitas que resultaram em submissões"
        value={`${data?.submissionRate.toLocaleString()}%` ?? "0%"}
        loading={loading}
        className="shadow-md shadow-green-600"
      />
      <StatsCard
        title="Taxa de Rejeição"
        icon={<LucideRouteOff className="text-red-600" />}
        helperText="Visitas que não interagiram com os formulários"
        value={`${data?.bounceRate.toLocaleString()}%` ?? "0%"}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

function StatsCard({
  title,
  icon,
  helperText,
  value,
  loading,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  helperText: string;
  value: string;
  loading: boolean;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="text-transparent opacity-0">000</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="pt-1 text-xs text-muted-foreground">{helperText}</p>
      </CardContent>
    </Card>
  );
}
