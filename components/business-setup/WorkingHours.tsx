// components/business-setup/BusinessWorkingHours.tsx
import React, { useState } from "react";
import Select from "react-select";
import Button from "../UI/Button";
import Switch from "../UI/Switch";
import { timeIntervals } from "@/utils/times";
import {
  toggleDay,
  updateWorkingHour,
  updateMultipleWorkingHours,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CustomLabel } from "../common/CustomLable";
import { MdSchedule, MdAccessTime, MdClose, MdEdit } from "react-icons/md";
import { FaMugHot } from "react-icons/fa";
import { useAddBusinessWorkingHoursMutation } from "@/store/features/businessApiSetupSlice";
import { useRouter } from "next/navigation";
import CopyHoursModal from "./CopyHoursModal";
import { toast } from "react-toastify";

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
  const [showCopyModal, setShowCopyModal] = useState(false);
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
    setShowBreakInput(initialBreaks.length > 0);
  };

  const handleToggle = (day: string): void => {
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
    if (breakTimes.length === 1) {
      setShowBreakInput(false);
    }
  };

  const handleSave = (): void => {
    if (!editingDay) return;

    if (!startTime.value || !endTime.value) {
      toast.error("Please select both start and end times");
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
      toast.error("Break times cannot overlap");
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

    // Open copy modal after successful save
    setShowCopyModal(true);
  };

  const handleClose = (): void => {
    setIsModalOpen(false);
    setEditingDay(null);
    setBreakTimes([]);
    setShowBreakInput(false);
  };

  const handleCopyHours = (selectedDays: string[]): void => {
    if (!editingDay || selectedDays.length === 0) return;

    const dayData = workingHours.find((h) => h.day_of_week === editingDay);
    if (!dayData) return;

    // Create updates for all selected days
    const updates = selectedDays.map((day) => ({
      day,
      start: dayData.start_time,
      end: dayData.end_time,
      breaks: dayData.breaks || [],
    }));

    // Dispatch batch update
    dispatch(updateMultipleWorkingHours(updates));

    toast.success(`Working hours copied to ${selectedDays.length} day(s)`);

    // Close all modals
    setShowCopyModal(false);
    setIsModalOpen(false);
    setEditingDay(null);
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
    addWorkingDay({ workingDays: workingHours })
      .unwrap()
      .then(() => {
        router.push("business-goals");
      })
      .catch((error) => {
        console.error("Error saving working hours:", error);
        toast.error("Failed to save working hours. Please try again.");
      });
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: "#e2e8f0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e1",
      },
      borderRadius: "0.5rem",
      minHeight: "2.5rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#EB5017"
        : state.isFocused
        ? "rgba(235, 80, 23, 0.05)"
        : base.backgroundColor,
      color: state.isSelected ? "white" : base.color,
      "&:hover": {
        backgroundColor: state.isSelected
          ? "#EB5017"
          : "rgba(235, 80, 23, 0.05)",
      },
    }),
  };

  // Day names with styling
  // const getDayStyle = (day: string) => {
  //   const firstLetter = day.charAt(0);
  //   const restOfDay = day.slice(1).toLowerCase();
  //   return (
  //     <>
  //       <span className="text-primary font-bold">{firstLetter}</span>
  //       {restOfDay}
  //     </>
  //   );
  // };

  return (
    <div className="space-y-6">
      {workingHours.map((hours) => (
        <div
          key={hours.day_of_week}
          className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
            hours.enabled
              ? "border-gray-200 hover:border-gray-300"
              : "border-gray-100 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Switch
                checked={hours.enabled}
                onClick={() => handleToggle(hours.day_of_week)}
              />
              <span className="font-medium text-gray-900">
                {hours.day_of_week}
              </span>
            </div>
          </div>

          {hours.enabled && (
            <div className="mt-3 ml-12">
              <div className="flex items-center justify-between gap-2 text-gray-700">
                <MdAccessTime className="text-gray-400" size={16} />
                <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  {hours.start_time}
                </span>
                <span className="text-gray-400">to</span>
                <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  {hours.end_time}
                </span>

                {hours.enabled && (
                  <button
                    onClick={() => handleEdit(hours.day_of_week)}
                    className="text-primary hover:text-primary-light p-2 rounded-full hover:bg-primary-light/10 transition-colors"
                    aria-label="Edit working hours"
                    type="button"
                  >
                    <MdEdit size={18} />
                  </button>
                )}
              </div>

              {hours.breaks?.length > 0 && (
                <div className="mt-2 text-sm flex items-start gap-2">
                  <FaMugHot className="text-gray-400 mt-1" size={14} />
                  <div>
                    <span className="text-gray-500">Breaks:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {hours.breaks.map((b: Break, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs"
                        >
                          {b.start} - {b.end}
                        </span>
                      ))}
                    </div>
                  </div>
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
        className="w-full py-4 text-lg font-medium"
      >
        Continue
      </Button>

      {/* Edit Hours Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <MdSchedule className="text-primary text-xl mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingDay}'s Hours
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
                type="button"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      styles={selectStyles}
                      placeholder="Select start time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      styles={selectStyles}
                      placeholder="Select end time"
                      isDisabled={!startTime.value}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-700 flex items-center">
                      <FaMugHot className="mr-2 text-primary" size={14} />
                      Break Times
                    </h4>
                    {!showBreakInput && (
                      <Button
                        el="button"
                        primary
                        outline
                        rounded
                        onClick={addBreakTime}
                        className="text-sm py-1 px-3 w-40 bg-secondary-hover"
                        disabled={!startTime.value || !endTime.value}
                      >
                        Add Break
                      </Button>
                    )}
                  </div>

                  {!showBreakInput && breakTimes.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No breaks added
                    </p>
                  )}

                  {showBreakInput && (
                    <div className="space-y-3">
                      {breakTimes.map((breakTime, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              From
                            </label>
                            <Select
                              value={
                                breakTime.start
                                  ? {
                                      value: breakTime.start,
                                      label: breakTime.start,
                                    }
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
                              styles={selectStyles}
                              placeholder="Start of break"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              To
                            </label>
                            <Select
                              value={
                                breakTime.end
                                  ? {
                                      value: breakTime.end,
                                      label: breakTime.end,
                                    }
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
                              styles={selectStyles}
                              placeholder="End of break"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBreakTime(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors self-end"
                            aria-label="Remove break"
                          >
                            <MdClose size={18} />
                          </button>
                        </div>
                      ))}

                      <div className="flex justify-center">
                        <Button
                          el="button"
                          primary
                          outline
                          rounded
                          onClick={addBreakTime}
                          className="text-sm py-1 px-3"
                          disabled={!startTime.value || !endTime.value}
                        >
                          Add Another Break
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  el="button"
                  secondary
                  rounded
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  el="button"
                  primary
                  rounded
                  onClick={handleSave}
                  className="flex-1"
                  disabled={!startTime.value || !endTime.value}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Hours Modal */}
      {showCopyModal && editingDay && (
        <CopyHoursModal
          isOpen={showCopyModal}
          onClose={() => {
            setShowCopyModal(false);
            setIsModalOpen(false);
            setEditingDay(null);
          }}
          currentDay={editingDay}
          availableDays={workingHours}
          onCopy={handleCopyHours}
        />
      )}
    </div>
  );
};

export default BusinessWorkingHours;
