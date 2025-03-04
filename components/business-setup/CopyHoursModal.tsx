// components/business-setup/CopyHoursModal.tsx
import React, { useState } from "react";
import Modal from "@/components/UI/Modal";
import {
  MdContentCopy,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
} from "react-icons/md";
import Button from "../UI/Button";

interface Day {
  day_of_week: string;
  enabled: boolean;
}

interface CopyHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: string;
  availableDays: Day[];
  onCopy: (selectedDays: string[]) => void;
}

const CopyHoursModal: React.FC<CopyHoursModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  availableDays,
  onCopy,
}) => {
  const otherDays = availableDays.filter(
    (day) => day.day_of_week !== currentDay
  );

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleAll = () => {
    if (selectedDays.length === otherDays.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(otherDays.map((day) => day.day_of_week));
    }
  };

  const handleCopy = () => {
    onCopy(selectedDays);
    onClose();
  };

  const getDayDisplay = (day: string) => {
    const firstLetter = day.charAt(0);
    const restOfDay = day.slice(1).toLowerCase();
    return (
      <>
        <span className="text-primary font-bold">{firstLetter}</span>
        {restOfDay}
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Copy Working Hours"
      icon={<MdContentCopy />}
      size="md"
    >
      <div className="p-5 space-y-5">
        <div className="bg-primary/5 p-4 rounded-xl">
          <p className="text-gray-700">
            Would you like to copy the working hours from{" "}
            <span className="font-medium">{currentDay}</span> to other days?
          </p>
        </div>

        <div className="space-y-3">
          <div className="pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={toggleAll}
              className="flex items-center w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {selectedDays.length === otherDays.length ? (
                <MdCheckBox className="text-primary text-xl mr-3" />
              ) : (
                <MdCheckBoxOutlineBlank className="text-gray-400 text-xl mr-3" />
              )}
              <span className="font-medium text-gray-900">Select All Days</span>
            </button>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {otherDays.map((day) => (
              <button
                key={day.day_of_week}
                type="button"
                onClick={() => toggleDay(day.day_of_week)}
                className={`flex items-center w-full text-left p-2 rounded-lg transition-colors ${
                  selectedDays.includes(day.day_of_week)
                    ? "bg-primary/5"
                    : "hover:bg-gray-50"
                }`}
                disabled={!day.enabled}
              >
                {selectedDays.includes(day.day_of_week) ? (
                  <MdCheckBox className="text-primary text-xl mr-3" />
                ) : (
                  <MdCheckBoxOutlineBlank
                    className={`text-xl mr-3 ${
                      day.enabled ? "text-gray-400" : "text-gray-200"
                    }`}
                  />
                )}
                <span
                  className={`font-medium ${
                    day.enabled ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {getDayDisplay(day.day_of_week)}
                  {!day.enabled && " (disabled)"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <Button el="button" secondary onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            el="button"
            primary
            onClick={handleCopy}
            disabled={selectedDays.length === 0}
            className="flex-1"
          >
            Copy Hours
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CopyHoursModal;
