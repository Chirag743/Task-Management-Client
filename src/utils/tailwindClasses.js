export const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export const statusColorClasses = {
  pending: 'text-status-pending',
  'in-progress': 'text-status-progress',
  completed: 'text-status-done',
}

export const statusBadgeClass =
  'inline-block border border-current px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider'

export const kicker =
  'text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint'

export const btnBase =
  'inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-65'

export const btnPrimary = `${btnBase} border-accent bg-accent text-surface hover:border-accent-hover hover:bg-accent-hover`

export const btnSecondary = `${btnBase} border-rule bg-surface text-ink hover:bg-paper-dark`

export const btnDanger = `${btnBase} border-danger bg-danger text-surface hover:border-danger-hover hover:bg-danger-hover`

export const btnGhost = `${btnBase} border-transparent bg-transparent text-ink-muted hover:bg-paper-dark hover:text-ink`

export const inputClass =
  'w-full border border-rule bg-surface px-3 py-2 text-[0.9375rem] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none'

export const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted'

export const panel = 'border border-rule bg-surface'

export const panelHeader = 'border-b border-rule-light px-5 py-3.5'

export const panelBody = 'p-5'

export const navLink =
  'block border-l-2 border-transparent px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-dark hover:text-ink'

export const navLinkActive =
  'block border-l-2 border-accent bg-paper-dark px-3 py-2 text-sm font-medium text-ink'

export const tableHead =
  'grid border-b border-rule bg-paper-dark px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-muted'

export const tableRow =
  'grid items-start border-b border-rule-light px-4 py-3.5 text-sm text-ink-muted last:border-b-0'

export const alertError =
  'border border-[#c4a0a0] bg-[#faf5f5] px-3.5 py-2.5 text-sm text-danger'

export const alertSuccess =
  'border border-[#a8b8ae] bg-[#f5f8f6] px-3.5 py-2.5 text-sm text-accent'

export const loaderClass =
  'h-4 w-4 animate-spin rounded-full border-2 border-rule border-t-accent'

export const loaderCompactClass =
  'h-3.5 w-3.5 animate-spin rounded-full border-2 border-rule border-t-accent'
