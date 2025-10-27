export function generateYearlyChartData(): {
  date: string
  desktop: number
  mobile: number
}[] {
  const today = new Date()
  const start = new Date(today)
  start.setFullYear(start.getFullYear() - 1)

  const data = []
  const current = new Date(start)

  while (current <= today) {
    const dateStr = current.toISOString().split("T")[0]!
    data.push({
      date: dateStr,
      desktop: Math.floor(Math.random() * 500),
      mobile: Math.floor(Math.random() * 500),
    })

    current.setDate(current.getDate() + 1)
  }

  return data
}
