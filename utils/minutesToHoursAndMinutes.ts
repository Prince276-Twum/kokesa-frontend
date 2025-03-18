export function minutesToHoursAndMinutes(
  totalMinutes: number | string,
  padZero = true
) {
  if (totalMinutes === null || totalMinutes === undefined) {
    return "--:--";
  }

  const minutes = Number(totalMinutes);

  if (isNaN(minutes)) {
    return "--:--";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formattedMinutes = padZero
    ? remainingMinutes.toString().padStart(2, "0")
    : remainingMinutes;

  return `${hours}:${formattedMinutes}`;
}
