import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Skeleton } from "@components/skeleton";
import { cn } from "@lib/utils";
import { LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  data: string | number;
  description?: string;
  icon?: LucideIcon;
  showSkeleton?: boolean;
}

const DataCard = ({
  title,
  data,
  description,
  icon: Icon,
  showSkeleton,
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {showSkeleton ? (
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-5 rounded-none" />
            {/* <Skeleton className="w-full h-3 rounded-none" /> */}
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{data}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;

export const DataItem = ({
  label,
  data,
  className,
}: {
  label?: string;
  data?: any;
  className?: string;
}) => (
  <div className={cn("space-y-1", className)}>
    <p className="text-sm font-medium leading-none">{label}</p>
    <p className="text-sm text-muted-foreground">{data ?? "N/A"}</p>
  </div>
);
