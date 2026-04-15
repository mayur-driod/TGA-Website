type PageHeaderProps = {
  title: string
  subtitle?: string
  badge?: string
}

export default function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary/5 px-4 py-14 md:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {badge ? (
          <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {badge}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p> : null}
      </div>
    </section>
  )
}
