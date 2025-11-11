import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary-hover',
        destructive: 'bg-error text-white shadow-md hover:shadow-lg hover:bg-error-hover',
        outline: 'border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-gray-100',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-success text-white shadow-md hover:shadow-lg hover:bg-success-hover',
      },
      size: {
        default: 'h-12 px-5 py-3',
        sm: 'h-10 px-4 text-xs',
        lg: 'h-14 px-7 text-base',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
