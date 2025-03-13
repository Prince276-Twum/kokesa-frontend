interface FormattedDateTime {
  date: string;
  time: string;
}

export function formatDateTime(
  isoString: string,
  timezone: string
): FormattedDateTime {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone, // Pass the original timezone here
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone, // Pass the original timezone here
  });

  return { date: formattedDate, time: formattedTime };
}

// Use it like:
// formatDateTime("2025-03-13T02:48:03+09:00", "Asia/Tokyo");
