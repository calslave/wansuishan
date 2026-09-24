import { useEffect, useRef } from 'react'
import L, { type LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Stop = {
  name: string
  short: string
  position: LatLngExpression
  role: string
  time: string
  tone: 'red' | 'gold' | 'green'
}

const tianjin: LatLngExpression = [39.0851, 117.1994]
const cangzhou: LatLngExpression = [38.23579, 116.90618]
const hengshuiLake: LatLngExpression = [37.56722, 115.69063]
const daming: LatLngExpression = [36.22974, 115.12746]
const huaxian: LatLngExpression = [35.4429, 114.69521]
const kaifeng: LatLngExpression = [34.7972, 114.3076]
const puyangSouth: LatLngExpression = [35.6708, 115.0192]
const hengshui: LatLngExpression = [37.73643, 115.66772]

const stops: Stop[] = [
  { name: '天津', short: '津', position: tianjin, role: '去程起点 · 返程终点', time: '10.2 05:20 出发 / 10.7 中午到家', tone: 'red' },
  { name: '沧州服务区', short: '沧', position: cangzhou, role: '往返共同休息点', time: '去程约 07:00 / 返程约 08:40', tone: 'green' },
  { name: '衡水湖服务区附近', short: '湖', position: hengshuiLake, role: '去程第二次休息', time: '10.2 约 09:10 · 停留 30 分钟', tone: 'red' },
  { name: '大名服务区', short: '名', position: daming, role: '去程午餐 · 返程休息', time: '去程约 11:40 / 返程约 16:30', tone: 'gold' },
  { name: '滑县服务区', short: '滑', position: huaxian, role: '去程最后一次短休', time: '10.2 约 14:10 · 停留 20 分钟', tone: 'red' },
  { name: '开封', short: '汴', position: kaifeng, role: '主目的地 · 住宿 4 晚', time: '10.2 抵达 / 10.6 约 12:30 离开', tone: 'red' },
  { name: '濮阳南附近', short: '濮', position: puyangSouth, role: '返程上半程第一次休息', time: '10.6 约 14:30 · 停留 20 分钟', tone: 'gold' },
  { name: '衡水', short: '衡', position: hengshui, role: '返程中转住宿', time: '10.6 约 18:30—19:30 抵达', tone: 'green' },
]

const outbound: LatLngExpression[] = [tianjin, cangzhou, hengshuiLake, daming, huaxian, kaifeng]
const returnDayOne: LatLngExpression[] = [kaifeng, puyangSouth, daming, hengshui]
const returnDayTwo: LatLngExpression[] = [hengshui, cangzhou, tianjin]

const toneClass = (tone: Stop['tone']) => `trip-map-marker ${tone}`

function TripMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
    })
    mapRef.current = map

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const outboundLine = L.polyline(outbound, { color: '#b84436', weight: 5, opacity: .9 }).addTo(map)
    const returnOneLine = L.polyline(returnDayOne, { color: '#d3a14d', weight: 5, opacity: .95, dashArray: '10 8' }).addTo(map)
    const returnTwoLine = L.polyline(returnDayTwo, { color: '#466858', weight: 5, opacity: .95, dashArray: '4 8' }).addTo(map)

    stops.forEach((stop) => {
      const icon = L.divIcon({
        className: '',
        html: `<span class="${toneClass(stop.tone)}">${stop.short}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -16],
      })
      L.marker(stop.position, { icon })
        .bindPopup(`<div class="trip-map-popup"><small>${stop.role}</small><b>${stop.name}</b><p>${stop.time}</p></div>`)
        .addTo(map)
    })

    const bounds = L.featureGroup([outboundLine, returnOneLine, returnTwoLine]).getBounds()
    map.fitBounds(bounds, { padding: [38, 38] })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div className="trip-map-canvas" ref={containerRef} aria-label="天津至开封自驾行程地图" />
}

export default TripMap
