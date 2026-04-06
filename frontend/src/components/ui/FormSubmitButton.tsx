import { Button } from './Button'
import { Spinner } from './Spinner'

interface FormSubmitButtonProps {
  isLoading: boolean
  label: string
  loadingLabel: string
  size?: 'md' | 'lg'
  className?: string
}

export function FormSubmitButton({
  isLoading,
  label,
  loadingLabel,
  size = 'lg',
  className = 'w-full justify-center',
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      size={size}
      className={className}
      disabled={isLoading}
    >
      {isLoading ? <><Spinner /> {loadingLabel}</> : label}
    </Button>
  )
}
