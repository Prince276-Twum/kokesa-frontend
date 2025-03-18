interface FormattedDateTime {
  date: string;
  time: string;
}

export function formatDateTime(
  isoString: string,
  timezone: string
): FormattedDateTime {
  const date = new Date(isoString);

  const now = new Date();

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });

  const dateInTimezone = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );
  const todayInTimezone = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );

  dateInTimezone.setHours(0, 0, 0, 0);
  todayInTimezone.setHours(0, 0, 0, 0);

  const tomorrowInTimezone = new Date(todayInTimezone);
  tomorrowInTimezone.setDate(tomorrowInTimezone.getDate() + 1);

  let displayDate = formattedDate;
  if (dateInTimezone.getTime() === todayInTimezone.getTime()) {
    displayDate = "Today";
  } else if (dateInTimezone.getTime() === tomorrowInTimezone.getTime()) {
    displayDate = "Tomorrow";
  }

  return { date: displayDate, time: formattedTime };
}

// Usage examples:
//
// Today's date in Tokyo:
// formatDateTime("2025-03-15T14:30:00+09:00", "Asia/Tokyo");  // { date: "Today", time: "2:30 PM" }
//
// Tomorrow's date in Tokyo:
// formatDateTime("2025-03-16T14:30:00+09:00", "Asia/Tokyo");  // { date: "Tomorrow", time: "2:30 PM" }
//
// Any other date:
// formatDateTime("2025-03-20T14:30:00+09:00", "Asia/Tokyo");  // { date: "Mar 20, 2025", time: "2:30 PM" }
// Determine if the date is today or tomorrow
