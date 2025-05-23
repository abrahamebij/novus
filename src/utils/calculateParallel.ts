function calculateParallel(resistors: number[], voltage: number) {
  const totalResistance =
    1 / resistors.reduce((acc, r) => acc + (r === 0 ? 0 : 1 / r), 0) || 0;
  const current = voltage / totalResistance || 0;
  const currents = resistors.map((r) => voltage / r);
  return { totalResistance, current, currents };
}

export default calculateParallel