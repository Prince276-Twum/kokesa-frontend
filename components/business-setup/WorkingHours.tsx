import React, { useState } from "react";
import Select from "react-select";
import Button from "../UI/Button";
import Switch from "../UI/Switch";
import { timeIntervals } from "@/utils/times";
import {
  toggleDay,
  updateWorkingHour,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CustomLabel } from "../common/CustomLable";
import { FaChevronRight } from "react-icons/fa6";
import { useAddBusinessWorkingHoursMutation } from "@/store/features/businessApiSetupSlice";
import { useRouter } from "next/navigation";

export interface TimeProp {
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

const BusinessWorkingHours = () => {
  const dispatch = useAppDispatch();
  const { workingHours } = useAppSelector((store) => store.businessSetup);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<TimeProp>({
    value: "",
    label: "",
  });
  const [endTime, setEndTime] = useState<TimeProp>({ value: "", label: "" });
  const [breakTimes, setBreakTimes] = useState<BreakTime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBreakInput, setShowBreakInput] = useState(false);
  const [addWorkingDay, { isLoading }] = useAddBusinessWorkingHoursMutation();
  const router = useRouter();

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

  const handleEdit = (day: string): void => {
    const dayData = workingHours.find((h) => h.day_of_week === day);
    if (!dayData) return;

    setStartTime({
      value: dayData.start_time,
      label: dayData.start_time,
    });
    setEndTime({
      value: dayData.end_time,
      label: dayData.end_time,
    });

    const initialBreaks: BreakTime[] =
      dayData.breaks?.map((break_) => ({
        start: break_.start,
        end: break_.end,
        startProp: { value: break_.start, label: break_.start },
      })) || [];
    setBreakTimes(initialBreaks);
    setEditingDay(day);
    setIsModalOpen(true);
    setShowBreakInput(false);
  };

  const handleToggle = (day: string): void => {
    console.log("WOW");
    dispatch(toggleDay(day));
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

    dispatch(
      updateWorkingHour({
        day: editingDay,
        start: startTime.value,
        end: endTime.value,
        breaks: validBreakTimes,
      })
    );
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
    console.log("Working Hours Configuration:", workingHours);
    addWorkingDay({ workingDays: workingHours })
      .unwrap()
      .then(() => {
        router.push("business-goals");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Working Hours Setup</h2>
      <>
        {workingHours.map((hours) => (
          <div
            key={hours.day_of_week}
            className="mb-4 p-4 border rounded flex justify-between items-center"
          >
            <div className="flex gap-6">
              <Switch
                checked={hours.enabled}
                onClick={() => handleToggle(hours.day_of_week)}
              />
              <span className="font-medium">{hours.day_of_week}</span>
            </div>

            {hours.enabled && (
              <div className="mt-2 text-sm text-gray-600 flex flex-col">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="flex gap-2 items-center">
                      <span className="px-3 py-1 border rounded-md focus:ring-1 focus:ring-blue-500">
                        {hours.start_time}
                      </span>
                      <span className="text-gray-500">to</span>

                      <span className="px-3 py-1 border rounded-md focus:ring-1 focus:ring-blue-500">
                        {hours.end_time}
                      </span>
                    </p>
                    <FaChevronRight
                      size={20}
                      onClick={() => handleEdit(hours.day_of_week)}
                    />
                  </div>
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

        <Button
          loading={isLoading}
          onClick={handleNext}
          el="button"
          primary
          rounded
        >
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

export default BusinessWorkingHours;
