import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent } from "@/shared/ui/card";

export default function CourseLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <Skeleton className="h-75 sm:h-100 w-full" />

      <div className="container relative z-10 mx-auto -mt-20 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Skeleton */}
          <div className="space-y-8 lg:col-span-2">
            {/* Header */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap gap-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-28" />
            </div>

            {/* What You Will Learn */}
            <Card className="border-card bg-card">
              <CardContent className="space-y-4 p-6">
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Course Structure */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-card bg-card">
              <CardContent className="space-y-6 p-6">
                {/* Progress Ring */}
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-36 w-36 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-16" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
