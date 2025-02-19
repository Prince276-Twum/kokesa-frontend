import { useState } from "react";
import Switch from "../UI/Switch";
import DatePicker from "react-datepicker";

const TimeSlotPicker = ({ day, slots, onChange, onToggle, enabled }) => {
  const [startDate, setStartDate] = useState(new Date());

  console.log(day, slots, onChange, onToggle, enabled);
  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
        !enabled ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span
          className={`font-medium ${
            enabled ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {day}
        </span>
      </div>

      {enabled && (
        <div className="flex items-center space-x-2">
          <div
            className="px-3 py-1 border rounded-md focus:ring-1 focus:ring-blue-500"
            onChange={(e) => onChange(day, "start", e.target.value)}
          >
            <span>{slots.start}</span>
          </div>
          <span className="text-gray-500">to</span>
          <div
            className="px-3 py-1 border rounded-md focus:ring-1 focus:ring-blue-500"
            onChange={(e) => onChange(day, "end", e.target.value)}
          >
            <span>{slots.end}</span>
          </div>
          <button
            className="text-blue-500"
            // onClick={() => onToggle(day)}
            type="button"
          >
            edit{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
