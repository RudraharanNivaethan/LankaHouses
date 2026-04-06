interface StatItemProps {
  value: string
  label: string
}

export function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-sm text-slate-400">{label}</p>
    </div>
  )
}
