function camelCase(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, character: string) => character.toUpperCase())
}

export function parseBatteryDump(dumpData: string): Record<string, unknown> {
  const raw: Record<string, string | number | boolean> = {}
  for (const line of dumpData.split('\n')) {
    const index = line.indexOf(':')
    if (index < 0 || line.includes('Battery Service state:'))
      continue
    const key = line.slice(0, index).trim()
    const input = line.slice(index + 1).trim()
    if (!key || !input)
      continue
    raw[camelCase(key)] = input === 'true' ? true : input === 'false' ? false : !Number.isNaN(Number(input)) ? Number(input) : input
  }
  return { raw, computed: { temperatureCelsius: typeof raw.temperature === 'number' ? raw.temperature / 10 : null, batteryPercentage: raw.level || 0, isCharging: Boolean(raw.usbPowered || raw.acPowered || raw.wirelessPowered || raw.dockPowered), voltageV: typeof raw.voltage === 'number' ? raw.voltage / 1000 : null, powerSource: raw.acPowered ? 'AC' : raw.usbPowered ? 'USB' : raw.wirelessPowered ? 'Wireless' : raw.dockPowered ? 'Dock' : 'Battery' } }
}
