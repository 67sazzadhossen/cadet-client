import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export const GlassPanel = ({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`dashboard-glass ${className}`} {...props} />
);

export const DashboardButton = ({
  children,
  className = "",
  tone = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "primary" | "success" | "danger" | "muted";
}) => (
  <button className={`dashboard-button dashboard-button-${tone} ${className}`} {...props}>
    {children}
  </button>
);

export const DashboardField = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/75">{label}</span>
    {children}
  </label>
);

export const DashboardPageShell = ({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section className={`dashboard-page space-y-3 ${className}`}>
    <GlassPanel className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-xs text-blue-100/70 sm:text-sm">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </GlassPanel>
    {children}
  </section>
);

export const DashboardToolbar = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <GlassPanel className={`dashboard-toolbar flex flex-wrap items-end gap-2 p-3 ${className}`}>
    {children}
  </GlassPanel>
);

export const DashboardTable = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <GlassPanel className={`dashboard-table overflow-auto ${className}`}>{children}</GlassPanel>
);
