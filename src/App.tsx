import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  CircleAlert,
  Clock3,
  ExternalLink,
  Fuel,
  Landmark,
  MapPinned,
  Menu,
  MoonStar,
  Navigation,
  ParkingCircle,
  Route,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  X,
} from 'lucide-react'
import TripMap from './TripMap'

type TimelineItem = {
  time: string
  title: string
  detail: string
  kind: 'drive' | 'visit' | 'meal' | 'rest'
}

type TripDay = {
  day: string
  date: string
  title: string
  theme: string
  badge: string
  driving: string
  items: TimelineItem[]
}

const departureDate = new Date('2026-10-02T05:20:00+08:00').getTime()
const endDate = new Date('2026-10-07T23:59:59+08:00').getTime()
const dayMs = 86_400_000
const initialNow = Date.now()

const tripDays: TripDay[] = [
  {
    day: 'DAY 01',
    date: '10月2日 · 周五',
    title: '向南六百里，傍晚入汴京',
    theme: '天津 → 沧州 → 衡水 → 开封',
    badge: '长途驾驶日',
    driving: '640 km · 9—11 h',
    items: [
      { time: '05:20', title: '天津出发', detail: '前一晚加满油，争取 06:00 前驶上津沧高速。', kind: 'drive' },
      { time: '07:00', title: '沧州附近短休', detail: '停留约 20 分钟，活动身体，不安排长早餐。', kind: 'rest' },
      { time: '09:10', title: '衡水湖服务区', detail: '停留约 30 分钟；双司机在此换手，单司机认真评估疲劳。', kind: 'rest' },
      { time: '11:40', title: '大名服务区午餐', detail: '正餐控制在 40—50 分钟，出发前复核 G45 实时路况。', kind: 'meal' },
      { time: '14:10', title: '滑县 / 濮阳南短休', detail: '最后一次主动休息，服务区以当天导航实际经过为准。', kind: 'rest' },
      { time: '16:00—17:30', title: '抵达开封酒店', detail: '办理入住后把车停稳，晚餐步行解决；不再开车进鼓楼或景区核心区。', kind: 'drive' },
    ],
  },
  {
    day: 'DAY 02',
    date: '10月3日 · 周六',
    title: '初入江湖，先看镇园大戏',
    theme: '万岁山 · 第一日',
    badge: '核心演出日',
    driving: '网约车往返 · 酒店留车',
    items: [
      { time: '07:00', title: '网约车前往万岁山', detail: '车留酒店；临近景区若开始拥堵，在官方落客点或外围安全位置下车步行。', kind: 'drive' },
      { time: '入园即刻', title: '查节目单与预约', detail: '先处理《三打祝家庄》、打铁花等热门节目，再开始游园。', kind: 'visit' },
      { time: '上午', title: '水浒街与互动小戏', detail: '熟悉园区动线，观看《王婆说媒》等互动内容，不追求场场打卡。', kind: 'visit' },
      { time: '午后', title: '《三打祝家庄》优先', detail: '以当天官方场次为准，预留排队和提前入场时间。', kind: 'visit' },
      { time: '傍晚', title: '坐下吃饭与休息', detail: '为夜场保留体力，避免连续站立到闭园。', kind: 'meal' },
      { time: '夜间', title: '打铁花与夜游', detail: '预约成功则当晚完成核心夜演；散场后先走出密集人流，再到官方候车点或外围主路叫车。', kind: 'visit' },
    ],
  },
  {
    day: 'DAY 03',
    date: '10月4日 · 周日',
    title: '再走江湖，把体验慢下来',
    theme: '万岁山 · 第二日',
    badge: '深度体验日',
    driving: '网约车往返 · 酒店留车',
    items: [
      { time: '07:30前后', title: '酒店叫车出发', detail: '沿用首日落客路线；不临时改为自驾，避免把时间耗在停车和夜间出场。', kind: 'drive' },
      { time: '08:00前后', title: '第二次入园', detail: '可比首日晚半小时到场，仍先确认节目与临时调整。', kind: 'visit' },
      { time: '上午', title: '补齐撞场的大型节目', detail: '选择与前一天不同区域，按地理顺序游览，少做折返。', kind: 'visit' },
      { time: '12:00—13:30', title: '完整午餐与午休', detail: '连续两天暴走，宁可少赶一场小戏，也要恢复体力。', kind: 'meal' },
      { time: '下午', title: '动作、水上与互动体验', detail: '把第二天留给参与感更强、第一天来不及看的内容。', kind: 'visit' },
      { time: '夜间', title: '夜演补看或提前返程', detail: '若首日没约到打铁花，今晚补看；已看过则错峰离园。', kind: 'visit' },
    ],
  },
  {
    day: 'DAY 04',
    date: '10月5日 · 周一',
    title: '上午古城，下午重返江湖',
    theme: '开封府 · 大相国寺 · 万岁山',
    badge: '2.5 天完成',
    driving: '网约车落客 · 古城步行串联',
    items: [
      { time: '07:00', title: '酒店叫车到开封府', detail: '当天不动车，避免包公湖单行、古城找位和下午万岁山二次停车。', kind: 'drive' },
      { time: '07:30—09:15', title: '开封府', detail: '尽量赶第一批入园和晨间仪式，避开午后集中客流。', kind: 'visit' },
      { time: '09:15—12:30', title: '步行串联古城', detail: '开封府 → 大相国寺 → 书店街 → 鼓楼，一次落客后不再反复叫车。', kind: 'visit' },
      { time: '12:30—13:30', title: '午餐与短暂休整', detail: '体力充足就从鼓楼外围直接叫车去万岁山；疲劳则先回酒店休息。', kind: 'meal' },
      { time: '14:00—闭园', title: '万岁山第三次入园', detail: '网约车送至外围落客点；二刷喜欢的演出，散场后按前两日方式返店。', kind: 'visit' },
    ],
  },
  {
    day: 'DAY 05',
    date: '10月6日 · 周二',
    title: '读懂汴京，向北夜宿衡水',
    theme: '开封博物馆 → 衡水',
    badge: '返程上半程',
    driving: '390 km · 6—7 h',
    items: [
      { time: '08:15', title: '退房、装车并自驾出发', detail: '结束三天市内打车模式；行李全部装车，不再返回酒店。', kind: 'drive' },
      { time: '09:00—11:20', title: '开封市博物馆', detail: '西部新区停车相对方便；重点看宋代历史、《清明上河图》专题与宋代科技展陈。', kind: 'visit' },
      { time: '11:30', title: '简餐', detail: '不进入老城用餐，12:30 左右驶离开封。', kind: 'meal' },
      { time: '14:30', title: '濮阳附近休息', detail: '停留约 20 分钟，检查车辆与精神状态。', kind: 'rest' },
      { time: '16:30', title: '大名服务区再休息', detail: '停留 20—30 分钟，避开连续驾驶。', kind: 'rest' },
      { time: '18:30—19:30', title: '抵达衡水', detail: '选择靠近 G45/G1811、带停车场的酒店，只吃饭休息。', kind: 'drive' },
    ],
  },
  {
    day: 'DAY 06',
    date: '10月7日 · 周三',
    title: '错峰北归，中午回到天津',
    theme: '衡水 → 沧州 → 天津',
    badge: '轻量返程日',
    driving: '253 km · 4—5 h',
    items: [
      { time: '06:50—07:10', title: '衡水出发', detail: '避开假期最后一日下午返程核心高峰。', kind: 'drive' },
      { time: '08:40', title: '沧州服务区休息', detail: '即使路况顺畅也停车 20 分钟，不把短程当成无需休息。', kind: 'rest' },
      { time: '11:00—12:30', title: '抵达天津', detail: '回家后不再追加长途活动，完成六天五晚行程。', kind: 'drive' },
    ],
  },
]

const outboundStops = [
  { time: '05:20', place: '天津', note: '出发' },
  { time: '07:00', place: '沧州', note: '20 min' },
  { time: '09:10', place: '衡水湖', note: '30 min' },
  { time: '11:40', place: '大名', note: '午餐' },
  { time: '14:10', place: '滑县', note: '20 min' },
  { time: '16:00+', place: '开封', note: '入住' },
]

const budget = [
  { label: '油费', value: 850, note: '约 1350—1450 公里', color: '#bd493c' },
  { label: '开封住宿 4 晚', value: 2500, note: '国庆浮动最大', color: '#d29148' },
  { label: '衡水住宿 1 晚', value: 350, note: '停车方便优先', color: '#577565' },
  { label: '门票与演出', value: 600, note: '2 人参考值', color: '#52768a' },
  { label: '餐饮', value: 1300, note: '2 人 6 天', color: '#806b91' },
  { label: '停车与市内交通', value: 350, note: '三天网约车＋停车', color: '#777064' },
]

const bookingTasks = [
  { id: 'hotel-kf', title: '开封酒店', when: '现在', detail: '10 月 2—6 日，选可取消、自有停车场、早餐供应早的房型。', icon: BedDouble },
  { id: 'hotel-hs', title: '衡水酒店', when: '现在', detail: '10 月 6 日一晚，靠近 G45/G1811，避免进入城市最深处。', icon: MoonStar },
  { id: 'wansui-ticket', title: '万岁山多日票', when: '开放预售后', detail: '确认是否支持连续三天重复入园，以及热门演出预约规则。', icon: TicketCheck },
  { id: 'museum', title: '开封博物馆', when: '按放票节奏', detail: '通过官方预约小程序操作，确认 10 月 6 日节假日开放安排。', icon: Landmark },
  { id: 'traffic', title: '交通与 P+R', when: '9 月 28 日后', detail: '复核免费换乘停车场、临时交通管制和高速施工信息。', icon: ParkingCircle },
  { id: 'weather', title: '逐小时天气', when: '出发前 3 天', detail: '重点检查 10 月 2、6、7 日降雨、大雾和大风。', icon: ShieldCheck },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDay, setActiveDay] = useState(0)
  const [now, setNow] = useState(initialNow)
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem('kaifeng-booking-checks') ?? '[]')
    } catch {
      return []
    }
  })

  const countdownDays = Math.max(0, Math.ceil((departureDate - now) / dayMs))
  const countdownState = now < departureDate ? 'waiting' : now <= endDate ? 'traveling' : 'finished'
  const planned = useMemo(() => budget.reduce((sum, item) => sum + item.value, 0), [])
  const budgetMin = 4750
  const budgetMax = 8100

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('kaifeng-booking-checks', JSON.stringify(completed))
  }, [completed])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const toggleTask = (id: string) => {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const active = tripDays[activeDay]

  return (
    <div className="kf-shell">
      <header className="kf-header">
        <button className="kf-brand" onClick={() => scrollTo('home')}>
          <span>汴</span>
          <b>汴京入梦<small>TIANJIN · KAIFENG</small></b>
        </button>
        <nav className={menuOpen ? 'kf-nav open' : 'kf-nav'}>
          <button onClick={() => scrollTo('overview')}>方案总览</button>
          <button onClick={() => scrollTo('trip-map')}>行程地图</button>
          <button onClick={() => scrollTo('route')}>自驾路线</button>
          <button onClick={() => scrollTo('itinerary')}>每日行程</button>
          <button onClick={() => scrollTo('wansui')}>万岁山</button>
          <button onClick={() => scrollTo('stay')}>市内交通</button>
          <button onClick={() => scrollTo('budget')}>预算</button>
          <button onClick={() => scrollTo('booking')}>出发清单</button>
        </nav>
        <div className="kf-header-actions">
          <aside className={`kf-countdown ${countdownState}`}>
            <CalendarDays />
            <span>
              <small>{countdownState === 'waiting' ? '国庆出发倒计时' : countdownState === 'traveling' ? '旅行进行中' : '旅程已结束'}</small>
              <b>{countdownState === 'waiting' ? <><strong>{countdownDays}</strong> 天</> : countdownState === 'traveling' ? '正在汴京' : '已平安归来'}</b>
            </span>
          </aside>
          <button className="kf-menu" aria-label="打开菜单" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="home">
        <section className="kf-hero kf-wrap">
          <div className="kf-hero-copy">
            <p className="kf-eyebrow"><span /> 2026 国庆 · 6天5晚自驾</p>
            <h1>沿大广南下，<br />去汴京闯一场<em>江湖</em></h1>
            <p>天津出发，单程约 640 公里。万岁山留足两天半，去程四次主动休息，返程在衡水拆成两段——好玩，也把安全余量留在路上。</p>
            <div className="kf-actions">
              <button onClick={() => scrollTo('itinerary')}>查看六日行程 <ArrowRight /></button>
              <button onClick={() => scrollTo('route')}><Route /> 查看行车安排</button>
            </div>
            <div className="kf-facts">
              <span><CalendarDays /><small>日期</small><b>10.2—10.7</b></span>
              <span><CarFront /><small>往返里程</small><b>约 1,350 km</b></span>
              <span><Sparkles /><small>万岁山</small><b>2.5 天</b></span>
            </div>
          </div>

          <div className="kf-hero-art" aria-label="天津至开封自驾路线插画">
            <div className="kf-moon" />
            <div className="kf-cloud cloud-one" /><div className="kf-cloud cloud-two" />
            <div className="kf-city-wall"><i /><i /><i /><i /><i /></div>
            <div className="kf-pagoda"><i /><i /><i /><i /><i /></div>
            <div className="kf-road"><span className="kf-car"><CarFront /></span></div>
            <div className="kf-route-label start"><small>起点</small><b>天津</b></div>
            <div className="kf-route-label end"><small>目的地</small><b>开封</b></div>
            <div className="kf-hero-stamp"><small>万岁山</small><b>2.5</b><em>DAYS</em></div>
          </div>
        </section>

        <div className="kf-alert">
          <div className="kf-wrap">
            <CircleAlert />
            <p><b>当前交通策略：</b>万岁山和古城核心区打车，博物馆、离城日及外围景点开车。2026 年国庆临时管制尚未发布，出发前再确认落客点与 P+R。</p>
            <a href="https://m.kf.bendibao.com/jieri/guoqing/22356.shtm" target="_blank" rel="noreferrer">参考往年方案 <ExternalLink /></a>
          </div>
        </div>

        <section className="kf-map-section kf-wrap" id="trip-map">
          <div className="kf-heading">
            <div><p className="kf-eyebrow"><span /> TRIP MAP</p><h2>往返节点，一图看清</h2></div>
            <p>红色实线为 10 月 2 日去程，金色虚线为 10 月 6 日开封至衡水，绿色点线为 10 月 7 日衡水至天津。点击标记可查看停留任务与计划时间。</p>
          </div>
          <div className="kf-map-frame">
            <TripMap />
            <aside className="kf-map-panel">
              <small>ROUND TRIP · 约 1,350 KM</small>
              <h3>天津 ⇄ 开封</h3>
              <div className="kf-map-legend">
                <span><i className="out" /><b>去程</b><em>10.02 · 一日直达</em></span>
                <span><i className="back-one" /><b>返程第一段</b><em>10.06 · 宿衡水</em></span>
                <span><i className="back-two" /><b>返程第二段</b><em>10.07 · 回天津</em></span>
              </div>
              <p><Navigation /> 地图连线用于呈现停留顺序，实际道路、服务区入口和临时绕行以当天导航为准。</p>
            </aside>
          </div>
        </section>

        <section className="kf-overview kf-wrap" id="overview">
          <div className="kf-heading">
            <div><p className="kf-eyebrow"><span /> THE PLAN</p><h2>这次为什么这样排</h2></div>
            <p>六天里不追求把开封所有景点塞满。最想玩的万岁山成为主线，古城与博物馆负责补足宋文化背景，长途返程则用一晚衡水换取更稳定的节奏。</p>
          </div>
          <div className="kf-overview-grid">
            <article className="featured">
              <div className="kf-number">01</div><Sparkles />
              <small>核心取舍</small><h3>万岁山<br /><em>2.5 天</em></h3>
              <p>两天完整游玩＋第三天下午夜场。核心大秀、互动体验和补看机会分开，不再被节目撞场牵着跑。</p>
            </article>
            <article>
              <div className="kf-number">02</div><CarFront />
              <small>去程策略</small><h3>一日直达</h3>
              <p>05:20 出发，四次主动休息。约 640 公里，国庆按 9—11 小时门到门准备。</p>
            </article>
            <article>
              <div className="kf-number">03</div><MoonStar />
              <small>返程策略</small><h3>衡水拆程</h3>
              <p>10 月 6 日先到衡水，7 日只开约 253 公里，绕开最后一天下午的集中返程。</p>
            </article>
            <article>
              <div className="kf-number">04</div><ParkingCircle />
              <small>市内策略</small><h3>分区用车</h3>
              <p>万岁山与古城打车步行，博物馆和离城日自驾；不是弃用汽车，而是把车用在更有价值的路段。</p>
            </article>
          </div>
        </section>

        <section className="kf-route-section" id="route">
          <div className="kf-wrap">
            <div className="kf-heading light">
              <div><p className="kf-eyebrow light"><span /> ON THE ROAD</p><h2>去程，一日抵达</h2></div>
              <p>主线为 S6 津沧高速—G2/G3—G1811 黄石高速—G45 大广高速—G30 连霍高速短段。服务区以当天导航实际经过为准。</p>
            </div>
            <div className="kf-route-summary">
              <span><small>规划里程</small><b>≈ 640<em> km</em></b></span>
              <span><small>纯驾驶</small><b>7.5—8<em> h</em></b></span>
              <span className="accent"><small>国庆执行窗口</small><b>9—11<em> h</em></b></span>
              <span><small>主动休息</small><b>4<em> 次</em></b></span>
            </div>
            <div className="kf-roadmap">
              <div className="kf-roadline" />
              {outboundStops.map((stop, index) => (
                <article key={stop.place} className={index === 0 || index === outboundStops.length - 1 ? 'terminal' : ''}>
                  <time>{stop.time}</time><i>{index + 1}</i><b>{stop.place}</b><small>{stop.note}</small>
                </article>
              ))}
            </div>
            <div className="kf-return-card">
              <span className="kf-return-icon"><Navigation /></span>
              <div><small>RETURN · 分两段北归</small><h3>开封 → 衡水 → 天津</h3><p>10 月 6 日约 390 km / 6—7 h；10 月 7 日约 253 km / 4—5 h。两天累计仍是约 640 km，但不再一次硬扛。</p></div>
              <div className="kf-return-days"><span><b>10.06</b><small>宿衡水</small></span><ArrowRight /><span><b>10.07</b><small>午前后到家</small></span></div>
            </div>
          </div>
        </section>

        <section className="kf-itinerary kf-wrap" id="itinerary">
          <div className="kf-heading">
            <div><p className="kf-eyebrow"><span /> SIX DAYS</p><h2>六天，逐日执行</h2></div>
            <p>点击日期查看详细节奏。景区演出时刻不提前写死，以当日官方节目单为准；固定的是优先级、休息和移动边界。</p>
          </div>
          <div className="kf-day-tabs">
            {tripDays.map((day, index) => (
              <button key={day.day} className={activeDay === index ? 'active' : ''} onClick={() => setActiveDay(index)}>
                <small>{day.day}</small><b>{day.date}</b><em>{day.title}</em>
              </button>
            ))}
          </div>
          <article className="kf-day-card">
            <header>
              <div><small>{active.day} · {active.badge}</small><h3>{active.title}</h3><p>{active.theme}</p></div>
              <span><Clock3 /><small>驾驶 / 交通</small><b>{active.driving}</b></span>
            </header>
            <div className="kf-timeline">
              {active.items.map((item, index) => (
                <div key={`${item.time}-${item.title}`}>
                  <time>{item.time}</time>
                  <span className={item.kind}><i />{index < active.items.length - 1 && <em />}</span>
                  <p><b>{item.title}</b><small>{item.detail}</small></p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="kf-wansui" id="wansui">
          <div className="kf-wrap">
            <div className="kf-heading light">
              <div><p className="kf-eyebrow light"><span /> 2.5 DAYS IN WUXIA</p><h2>万岁山，不赶场</h2></div>
              <p>把三次入园分成三个任务：第一天抓主秀，第二天深度体验，第三天下午自由补完。这样比一天内横穿园区更稳。</p>
            </div>
            <div className="kf-wansui-grid">
              <article><span>第一日</span><small>建立全局</small><h3>先看镇园大戏</h3><p>入园先约热门节目，以《三打祝家庄》和打铁花为核心，再穿插水浒街和互动小戏。</p><div><b>完整 1 天</b><em>核心主秀</em></div></article>
              <article><span>第二日</span><small>减少折返</small><h3>把江湖走深</h3><p>补齐撞场节目，集中体验动作、水上与互动内容，中午安排 60—90 分钟完整休息。</p><div><b>完整 1 天</b><em>深度体验</em></div></article>
              <article className="half"><span>第三次</span><small>自由补完</small><h3>喜欢的，再看一遍</h3><p>古城半日后重返园区，二刷喜欢的表演、拍照、买文创，也给未预约成功的节目最后机会。</p><div><b>下午＋夜间</b><em>约 0.5 天</em></div></article>
            </div>
            <div className="kf-wansui-rule"><TicketCheck /><span><b>购票前必须确认</b><p>多日票是否支持连续三天重复入园、每日入园次数，以及《三打祝家庄》和打铁花的预约时点。国庆规则以当时购票页与官方小程序为准。</p></span></div>
          </div>
        </section>

        <section className="kf-stay kf-wrap" id="stay">
          <div className="kf-heading">
            <div><p className="kf-eyebrow"><span /> MOVE IN KAIFENG</p><h2>什么地方开车，什么地方打车</h2></div>
            <p>以停车难度、散场压力和是否需要带着行李离城为分界。长途自驾保留，古城“最后三公里”交给网约车和步行。</p>
          </div>
          <div className="kf-mobility-grid">
            <article className="drive">
              <span className="kf-mobility-icon"><CarFront /></span>
              <small>DRIVE · 发挥自驾优势</small>
              <h3>这些地方开车</h3>
              <ul>
                <li><b>天津 ⇄ 开封</b><em>长途与行李运输</em></li>
                <li><b>开封市博物馆</b><em>参观后直接去衡水</em></li>
                <li><b>朱仙镇 / 西湖</b><em>若临时增加外围景点</em></li>
              </ul>
            </article>
            <article className="taxi">
              <span className="kf-mobility-icon"><Navigation /></span>
              <small>RIDE HAILING · 避开停车</small>
              <h3>这些地方打车</h3>
              <ul>
                <li><b>万岁山三次入园</b><em>避开夜演集中散场</em></li>
                <li><b>开封府 / 鼓楼</b><em>规避单行与反复找位</em></li>
                <li><b>夜市与夜游</b><em>不担心返店无车位</em></li>
              </ul>
            </article>
            <article className="walk">
              <span className="kf-mobility-icon"><MapPinned /></span>
              <small>ONE DROP-OFF · 一次落客</small>
              <h3>古城这样步行串联</h3>
              <p>开封府 <ArrowRight /> 大相国寺 <ArrowRight /> 书店街 <ArrowRight /> 鼓楼</p>
              <strong>10 月 5 日上午执行</strong>
              <em>午后从鼓楼外围叫车前往万岁山，不回酒店取车。</em>
            </article>
          </div>
          <div className="kf-mobility-days" aria-label="开封市内每日交通方式">
            <span><small>10.02</small><b>自驾抵店</b><em>停车后不再进老城</em></span>
            <i />
            <span><small>10.03—04</small><b>打车往返</b><em>万岁山两整天</em></span>
            <i />
            <span><small>10.05</small><b>打车＋步行</b><em>古城至万岁山</em></span>
            <i />
            <span><small>10.06</small><b>自驾离城</b><em>博物馆后去衡水</em></span>
          </div>
          <div className="kf-stay-grid">
            <article className="recommended"><span>推荐区域</span><MapPinned /><h3>金明大道—大梁路—郑开大道东段</h3><p>兼顾高速进出、博物馆与老城打车距离，酒店选择也比鼓楼核心区更宽松。</p><ul><li><Check /> 自有停车场</li><li><Check /> 可免费取消</li><li><Check /> 早餐供应早</li></ul></article>
            <article><ParkingCircle /><h3>万岁山散场：先走再叫</h3><p>不要堵在景区出口定位。先步行离开密集人流，到官方候车点或外围主路叫车；首日确认好位置，第二日照旧执行。</p></article>
            <article><CircleAlert /><h3>自驾切换条件</h3><p>只有早到、官方停车位充足、酒店保证返店车位且计划提前离园时，才临时改为自驾万岁山；任一条件不满足就维持打车。</p></article>
          </div>
        </section>

        <section className="kf-budget" id="budget">
          <div className="kf-wrap kf-budget-grid">
            <div>
              <p className="kf-eyebrow light"><span /> BUDGET</p>
              <h2>两人一车，<br />预算留有余地</h2>
              <p>高速通行费按 7 座及以下小客车国庆免费计算。酒店和景区票种是最大浮动项，购物始终单列。</p>
              <span className="kf-budget-range"><small>建议总预算</small><b>¥{budgetMin.toLocaleString()}—{budgetMax.toLocaleString()}</b><em>当前中位估算 ¥{planned.toLocaleString()}</em></span>
            </div>
            <article className="kf-budget-card">
              <header><span>预算构成 · 2 人</span><b>高速费 ¥0</b></header>
              <div className="kf-budget-bar">{budget.map((item) => <i key={item.label} style={{ width: `${item.value / planned * 100}%`, background: item.color }} />)}</div>
              <div className="kf-budget-lines">
                {budget.map((item) => <div key={item.label}><span><i style={{ background: item.color }} /><b>{item.label}</b><small>{item.note}</small></span><strong>¥{item.value.toLocaleString()}</strong></div>)}
              </div>
              <footer><Fuel /><p><b>新能源车提示</b> 服务区充电排队时间另计，优先酒店慢充或城区快充，服务区只作为补电。</p></footer>
            </article>
          </div>
        </section>

        <section className="kf-booking kf-wrap" id="booking">
          <div className="kf-heading">
            <div><p className="kf-eyebrow"><span /> BEFORE LEAVING</p><h2>把不确定性逐项关掉</h2></div>
            <p>点击卡片即可标记完成，状态会保存在当前浏览器。越靠近出发日，越要以官方公告和实时导航替代旧攻略。</p>
          </div>
          <div className="kf-progress"><span><b>{completed.length}</b> / {bookingTasks.length} 项完成</span><div><i style={{ width: `${completed.length / bookingTasks.length * 100}%` }} /></div></div>
          <div className="kf-booking-grid">
            {bookingTasks.map((task, index) => {
              const Icon = task.icon
              const done = completed.includes(task.id)
              return <button key={task.id} className={done ? 'done' : ''} onClick={() => toggleTask(task.id)}>
                <span className="kf-task-number">0{index + 1}</span><span className="kf-task-check">{done && <Check />}</span><Icon />
                <small>{task.when}</small><h3>{task.title}</h3><p>{task.detail}</p><em>{done ? '已完成 · 点击撤销' : '点击标记完成'}</em>
              </button>
            })}
          </div>
          <div className="kf-source-note"><ShieldCheck /><span><b>最后复核节点：9 月 28 日—10 月 1 日</b><p>确认开封免费换乘停车场、景区国庆节目单、G45/G1811 路况、博物馆开放安排和逐小时天气。</p></span></div>
        </section>
      </main>

      <footer className="kf-footer">
        <div className="kf-wrap"><span>汴京入梦 · 2026</span><p>天津—开封国庆自驾计划</p><a href="https://www.beijing.gov.cn/ywdt/gzdt/202511/t20251107_4265508.html" target="_blank" rel="noreferrer">高速免费政策 <ExternalLink /></a></div>
      </footer>
    </div>
  )
}

export default App
