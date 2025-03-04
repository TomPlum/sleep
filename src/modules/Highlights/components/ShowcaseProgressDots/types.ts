export interface ShowcaseProgressDotsProps {
  active: number
  dots: number
  className?: string
  onClickDot: (index: number) => void
  orientation?: 'horizontal' | 'vertical'
}