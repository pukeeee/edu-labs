import { Skeleton } from "@/shared/ui/skeleton";
import { Card } from "@/shared/ui/card";

export default function CourseLoading() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-100 w-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-[#44475A] border-[#44475A]">
              <div className="p-6 space-y-6">
                <Skeleton className="h-40 w-40 mx-auto rounded-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
