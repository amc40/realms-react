export function getSpacing(
  centre: number,
  distance: number,
  nItems: number
): number[] {
  if (nItems % 2 === 0) {
    let absDistancesFromCentre: number[] = [];
    // even distribute around middle
    for (let i = 0; i < nItems / 2; i++) {
      const distanceFromCentre = distance * i + distance / 2;
      absDistancesFromCentre.push(distanceFromCentre);
    }
    const negatedDistances = absDistancesFromCentre.map(
      (absDistances) => -absDistances
    );
    const distancesFromCentre = [
      ...negatedDistances,
      ...absDistancesFromCentre,
    ];
    return distancesFromCentre.map(
      (distanceFromCentre) => distanceFromCentre + centre
    );
  } else {
    // have middle element
    let absDistancesFromCentre: number[] = [];
    for (let i = 0; i < Math.floor(nItems / 2); i++) {
      const distanceFromCentre = distance * (i + 1);
      absDistancesFromCentre.push(distanceFromCentre);
    }
    const negatedDistances = absDistancesFromCentre.map(
      (absDistances) => -absDistances
    );
    const distancesFromCentre = [
      ...negatedDistances,
      0,
      ...absDistancesFromCentre,
    ];
    return distancesFromCentre.map(
      (distanceFromCentre) => distanceFromCentre + centre
    );
  }
}
