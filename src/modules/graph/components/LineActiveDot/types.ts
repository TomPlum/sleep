export interface LineActiveDotProps {
  onClick: (index: number) => void
  radius: number
  data: {
    x: number
    y: number
    index: number
  }
}