import { Skeleton } from '../ui/Skeleton'

function InquiryCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

interface InquiryListSkeletonProps {
  count?: number
}

export function InquiryListSkeleton({ count = 5 }: InquiryListSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <InquiryCardSkeleton key={i} />
      ))}
    </div>
  )
}
