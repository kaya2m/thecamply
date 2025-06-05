export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link' | 'outline'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps {
  loading?: boolean
  loadingText?: string
}