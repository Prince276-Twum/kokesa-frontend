import { type TimeProp } from "../business-setup/WorkingHours";

interface CustomLabelProps {
  label: string;
  startTimes: TimeProp;
  isOption: boolean;
}

export const CustomLabel: React.FC<CustomLabelProps> = ({
  label,
  startTimes,
  isOption,
}) => {
  const calculateHourLabels = (time: TimeProp): string => {
    const [startHour, startMin] = startTimes.value.split(":").map(Number);
    const [endHour, endMin] = time.value.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;

    let diffMinutes = endTotalMinutes - startTotalMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60;

    const hoursDifference = Math.floor(diffMinutes / 60);
    const minutesDifference = diffMinutes % 60;

    return `${hoursDifference}h ${minutesDifference}m`;
  };

  const hourLeft = calculateHourLabels({ value: label, label });
  return (
    <div className="flex items-center flex-col">
      <span className="font-semibold">{label}</span>
      {isOption && startTimes.value && (
        <span className="text-sm text-gray-500">{hourLeft}</span>
      )}
    </div>
  );
};
