import {TickItem} from "recharts/types/util/types";

export interface CustomXAxisTickProps {
  x: number
  y: number
  payload: TickItem
  earliestSession: Date
  latestSession: Date
}