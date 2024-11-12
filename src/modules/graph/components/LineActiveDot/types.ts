export interface LineActiveDotProps {
  onClick: (id: string) => void
  radius: number
  data: {
    x: number
    y: number
    index: number
  }
}