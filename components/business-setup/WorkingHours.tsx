import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import Select from "react-select";
import Button from "../UI/Button";
import Switch from "../UI/Switch";
import { timeIntervals } from "@/utils/times";
import { type WorkingHours } from "@/store/features/businessSetupSlice";

interface TimeProp {
  value: string;
  label: string;
}

interface Break {
  start: string;
  end: string;
}

interface BreakTime extends Break {
  startProp: TimeProp;
}

interface CustomLabelProps {
  label: string;
  startTimes: TimeProp;
  isOption: boolean;
}

type Day = keyof WorkingHours;

// Custom Label Component
const CustomLabel: React.FC<CustomLabelProps> = ({
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

const WorkingHours: React.FC = () => {
  const { workingHours } = useAppSelector((store) => store.businessSetup);
  const [editingDay, setEditingDay] = useState<Day | null>(null);
  const [startTime, setStartTime] = useState<TimeProp>({
    value: "",
    label: "",
  });
  const [endTime, setEndTime] = useState<TimeProp>({ value: "", label: "" });
  const [breakTimes, setBreakTimes] = useState<BreakTime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBreakInput, setShowBreakInput] = useState(false);

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isTimeInBreakRange = (
    time: string,
    currentBreakIndex: number
  ): boolean => {
    const timeMinutes = timeToMinutes(time);

    return breakTimes.some((breakTime, index) => {
      if (index === currentBreakIndex || !breakTime.start || !breakTime.end) {
        return false;
      }

      const breakStartMinutes = timeToMinutes(breakTime.start);
      const breakEndMinutes = timeToMinutes(breakTime.end);

      return timeMinutes >= breakStartMinutes && timeMinutes <= breakEndMinutes;
    });
  };

  const generateTimeIntervals = (startTimeStr: string): TimeProp[] => {
    if (!startTimeStr) return [];

    const [hours, minutes] = startTimeStr.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = timeToMinutes(endTime.value || "23:55");

    return Array.from(
      { length: Math.ceil((endMinutes - startMinutes) / 5) + 1 },
      (_, index) => {
        const totalMinutes = startMinutes + index * 5;
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        const timeStr = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        return {
          value: timeStr,
          label: timeStr,
        };
      }
    );
  };

  const handleEdit = (day: Day): void => {
    setStartTime({
      value: workingHours[day].start,
      label: workingHours[day].start,
    });
    setEndTime({
      value: workingHours[day].end,
      label: workingHours[day].end,
    });

    const initialBreaks: BreakTime[] =
      workingHours[day].breaks?.map((break_) => ({
        start: break_.start,
        end: break_.end,
        startProp: { value: break_.start, label: break_.start },
      })) || [];
    setBreakTimes(initialBreaks);
    setEditingDay(day);
    setIsModalOpen(true);
    setShowBreakInput(false);
  };

  const addBreakTime = (): void => {
    setShowBreakInput(true);
    setBreakTimes([
      ...breakTimes,
      {
        start: "",
        end: "",
        startProp: { value: "", label: "" },
      },
    ]);
  };

  const removeBreakTime = (index: number): void => {
    setBreakTimes(breakTimes.filter((_, i) => i !== index));
  };

  const handleSave = (): void => {
    if (!editingDay) return;

    if (!startTime.value || !endTime.value) {
      alert("Please select both start and end times");
      return;
    }

    const validBreakTimes = breakTimes
      .filter((break_) => break_.start && break_.end)
      .map(({ start, end }) => ({ start, end }));

    const hasOverlap = validBreakTimes.some((break1, i) =>
      validBreakTimes.some(
        (break2, j) =>
          i !== j &&
          ((timeToMinutes(break1.start) >= timeToMinutes(break2.start) &&
            timeToMinutes(break1.start) < timeToMinutes(break2.end)) ||
            (timeToMinutes(break1.end) > timeToMinutes(break2.start) &&
              timeToMinutes(break1.end) <= timeToMinutes(break2.end)))
      )
    );

    if (hasOverlap) {
      alert("Break times cannot overlap");
      return;
    }

    console.log("Saving:", {
      day: editingDay,
      start: startTime.value,
      end: endTime.value,
      breaks: validBreakTimes,
    });

    setIsModalOpen(false);
    setEditingDay(null);
  };

  const handleClose = (): void => {
    setIsModalOpen(false);
    setEditingDay(null);
    setBreakTimes([]);
    setShowBreakInput(false);
  };

  const availableEndTimes = timeIntervals.filter((time) => {
    if (!startTime.value) return true;
    return timeToMinutes(time.value) > timeToMinutes(startTime.value);
  });

  interface TimeOption extends TimeProp {
    isDisabled?: boolean;
  }

  const getAvailableBreakTimes = (currentBreakIndex: number): TimeOption[] => {
    const times = generateTimeIntervals(startTime.value);
    return times.map((time) => ({
      ...time,
      isDisabled: isTimeInBreakRange(time.value, currentBreakIndex),
    }));
  };

  const handleNext = (): void => {
    const formattedData = Object.entries(workingHours).reduce<WorkingHours>(
      (acc, [day, hours]) => ({
        ...acc,
        [day]: {
          enabled: hours.enabled,
          start: hours.start,
          end: hours.end,
          breaks: hours.breaks || [],
        },
      }),
      {} as WorkingHours
    );

    console.log("Working Hours Configuration:", formattedData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Working Hours Setup</h2>
      <>
        {Object.entries(workingHours).map(([day, hours]) => (
          <div key={day} className="mb-4 p-4 border rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">{day}</span>
              <div className="flex items-center gap-4">
                <Switch checked={hours.enabled} />
                <Button
                  el="button"
                  primary
                  onClick={() => handleEdit(day as Day)}
                >
                  Edit
                </Button>
              </div>
            </div>
            {hours.enabled && (
              <div className="mt-2 text-sm text-gray-600">
                <div>
                  Hours: {hours.start} - {hours.end}
                </div>
                {hours.breaks?.length > 0 && (
                  <div className="mt-1">
                    Breaks:{" "}
                    {hours.breaks.map((b: Break, i: number) => (
                      <span key={i}>
                        {b.start}-{b.end}
                        {i < hours.breaks.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <Button onClick={handleNext} el="button" primary>
          Next
        </Button>
      </>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit {editingDay}</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <Select
                    value={startTime}
                    options={timeIntervals}
                    onChange={(option) => {
                      setStartTime(option as TimeProp);
                      setEndTime({ value: "", label: "" });
                      setBreakTimes([]);
                      setShowBreakInput(false);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    End Time
                  </label>
                  <Select
                    value={endTime}
                    options={availableEndTimes}
                    formatOptionLabel={(
                      option: TimeProp,
                      { context }: { context: string }
                    ) => (
                      <CustomLabel
                        label={option.value}
                        startTimes={startTime}
                        isOption={context === "menu"}
                      />
                    )}
                    onChange={(option) => {
                      setEndTime(option as TimeProp);
                      setBreakTimes([]);
                      setShowBreakInput(false);
                    }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium mb-2">Breaks</h4>
                {showBreakInput &&
                  breakTimes.map((breakTime, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Select
                        className="flex-1"
                        value={
                          breakTime.start
                            ? { value: breakTime.start, label: breakTime.start }
                            : null
                        }
                        options={getAvailableBreakTimes(index)}
                        onChange={(option) => {
                          const updatedBreaks = [...breakTimes];
                          updatedBreaks[index] = {
                            start: option?.value || "",
                            end: "",
                            startProp: option as TimeProp,
                          };
                          setBreakTimes(updatedBreaks);
                        }}
                        isDisabled={!startTime.value || !endTime.value}
                      />
                      <span>to</span>
                      <Select
                        className="flex-1"
                        value={
                          breakTime.end
                            ? { value: breakTime.end, label: breakTime.end }
                            : null
                        }
                        options={getAvailableBreakTimes(index).filter(
                          (time) => time.value > (breakTime.start || "")
                        )}
                        formatOptionLabel={(
                          option: TimeProp,
                          { context }: { context: string }
                        ) => (
                          <CustomLabel
                            label={option.value}
                            startTimes={breakTime.startProp}
                            isOption={context === "menu"}
                          />
                        )}
                        onChange={(option) => {
                          const updatedBreaks = [...breakTimes];
                          updatedBreaks[index].end = option?.value || "";
                          setBreakTimes(updatedBreaks);
                        }}
                        isDisabled={!breakTime.start}
                      />
                      <button
                        onClick={() => removeBreakTime(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                <Button
                  el="button"
                  primary
                  onClick={addBreakTime}
                  className="mt-2"
                  disabled={!startTime.value || !endTime.value}
                >
                  Add Break
                </Button>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button el="button" primary onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  el="button"
                  primary
                  onClick={handleSave}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingHours;
