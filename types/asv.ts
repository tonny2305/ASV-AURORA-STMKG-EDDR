export type Sensors = {
  alt_m: number | null
  heading_deg: number | null
  pressure_hpa: number | null
  temp_c: number | null
  wave_frequency: number | null
  wave_height: number | null
  wave_period: number | null
  lat?: number | null
  lon?: number | null
  speed_kn?: number | null
}

export type NodeData = {
  gps_status: string
  sensors: Sensors
  gps?: {
    course_deg?: number
    lat?: number
    lng?: number
    lon?: number
    speed_kmh?: number
    speed_knots?: number
  }
  timestamp: string
  uptime_s: number | null
}

export type TelemetryNode = {
  key: string
  timestamp: Date
  data: NodeData
}

export type TelemetryFeed = {
  ordered: TelemetryNode[]
  latest: NodeData | null
}
