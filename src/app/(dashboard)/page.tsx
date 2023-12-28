import { GetFormStats, GetForms } from "@/actions/form";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { type Form } from "@prisma/client";
import {
  ArrowRight,
  EditIcon,
  LucideFormInput,
  LucideMousePointerClick,
  LucideRouteOff,
  LucideView,
} from "lucide-react";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="col-span-2 text-4xl font-bold"> Seus Formulários</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
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

export function StatsCard({
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

function FormCardSkeleton() {
  return <Skeleton className="h-[190px] w-full border-2 border-primary/20" />;
}

async function FormCards() {
  const forms = await GetForms();
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="text-md truncate font-bold capitalize">
            {form.name}
          </span>

          {form.published && <Badge>Publicado</Badge>}
          {!form.published && <Badge variant="destructive">Rascunho</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-sm text-muted-foreground">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
            locale: ptBR,
          })}
          {form.published && (
            <span className="flex items-center gap-2">
              <LucideView className="text-muted-foreground" />
              {form.visits.toLocaleString()}
              <LucideFormInput className="text-muted-foreground" />
              {form.submissions.toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description ?? "Sem descrição"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="text-md mt-2 w-full gap-4 ">
            <Link href={`/form-details/${form.id}`}>
              Ver detalhes <ArrowRight />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            asChild
            className="text-md mt-2 w-full gap-4 "
            variant="secondary"
          >
            <Link href={`/form-builder/${form.id}`}>
              Editar Form <EditIcon className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
