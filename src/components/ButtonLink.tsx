import type { ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type ButtonVariant = 'primary' | 'secondary' | 'specular'

type CommonProps = {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  arrow?: boolean
  disabled?: boolean
}

type LinkToProps = CommonProps & {
  to: string
  href?: never
  download?: never
  onClick?: never
  type?: never
}

type AnchorProps = CommonProps & {
  href: string
  to?: never
  download?: boolean | string
  target?: string
  rel?: string
  onClick?: never
  type?: never
}

type NativeButtonProps = CommonProps & {
  to?: never
  href?: never
  download?: never
  onClick?: () => void
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export type ButtonLinkProps = LinkToProps | AnchorProps | NativeButtonProps

export function ButtonLink({
  variant = 'primary',
  children,
  className = '',
  arrow,
  disabled = false,
  ...rest
}: ButtonLinkProps) {
  const showArrow = arrow ?? (variant === 'secondary')
  const baseClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'specular'
      ? 'btn-specular'
      : 'btn-secondary'
  const combinedClass = `${baseClass} ${className}`.trim()

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (variant === 'specular') {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      e.currentTarget.style.setProperty('--mx', `${x}px`)
      e.currentTarget.style.setProperty('--my', `${y}px`)
    }
  }

  const handlePointerEnter = (e: PointerEvent<HTMLElement>) => {
    // Phase 3.1: Trigger Jugnu reaction when hovering over any View Case Study link
    const textContent = typeof children === 'string' ? children : ''
    if (textContent.toLowerCase().includes('case study')) {
      const rect = e.currentTarget.getBoundingClientRect()
      window.dispatchEvent(
        new CustomEvent('jugnu:hover-target', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        })
      )
    }
  }

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <span aria-hidden className="btn-arrow text-xs">
          ↗
        </span>
      )}
    </>
  )

  if ('to' in rest && rest.to !== undefined) {
    if (disabled) {
      return (
        <span aria-disabled="true" className={combinedClass}>
          {content}
        </span>
      )
    }
    return (
      <Link
        to={rest.to}
        className={combinedClass}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
      >
        {content}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    if (disabled) {
      return (
        <span aria-disabled="true" className={combinedClass}>
          {content}
        </span>
      )
    }
    return (
      <a
        href={rest.href}
        download={rest.download}
        target={rest.target}
        rel={rest.rel}
        className={combinedClass}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={rest.type || 'button'}
      onClick={rest.onClick}
      disabled={disabled}
      className={combinedClass}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
    >
      {content}
    </button>
  )
}
