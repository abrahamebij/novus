function calculateSeries(resistors: number[], voltage: number) {
  const totalResistance = resistors.reduce((a, b) => a + b, 0);
  const current = voltage / totalResistance || 0;
  const voltageDrops = resistors.map((r) => current * r);
  return { totalResistance, current, voltageDrops };
}

export default calculateSeries;
