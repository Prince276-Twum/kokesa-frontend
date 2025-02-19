import { useAppSelector } from "@/store/hooks";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "../UI/Switch";
import Button from "../UI/Button";

function WorkingHours() {
  const { workingHours } = useAppSelector((store) => store.businessSetup);
  const [editingDay, setEditingDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [breakTimes, setBreakTimes] = useState([{ start: "", end: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addBreakTime = () => {
    setBreakTimes([...breakTimes, { start: startTime, end: startTime }]);
  };

  const handleBreakStartChange = (index, time) => {
    const newBreakTimes = [...breakTimes];
    newBreakTimes[index].start = time;
    setBreakTimes(newBreakTimes);
  };

  const handleBreakEndChange = (index, time) => {
    const newBreakTimes = [...breakTimes];
    newBreakTimes[index].end = time;
    setBreakTimes(newBreakTimes);
  };

  const handleEdit = (day) => {
    setEditingDay(day);
    setStartTime(workingHours[day].start);
    setEndTime(workingHours[day].end);
    setBreakTimes(
      workingHours[day].breaks?.map((b) => ({
        start: b.start,
        end: b.end,
      })) || [{ start: workingHours[day].start, end: workingHours[day].start }]
    );
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingDay) {
      console.log("Saving for", editingDay, startTime, endTime, breakTimes);

      setEditingDay(null);
      setIsModalOpen(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingDay(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Working Hours Setup</h2>
      {Object.entries(workingHours).map(([day, hours]) => (
        <div key={day} className="mb-4">
          <div className="flex justify-between items-center">
            <span>{day}</span>
            <Switch checked={hours.enabled} />
            <Button onClick={() => handleEdit(day)}>Edit</Button>
          </div>
          {hours.enabled && (
            <div className="ml-4 text-sm text-gray-600">
              {hours.start} - {hours.end}
            </div>
          )}
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Edit {editingDay}</h3>
            <div className="flex items-center mb-4">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-32 mr-2"
              />
              <span className="mx-2">to</span>
              <input
                type="time"
                min="09:00"
                max="18:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-32"
              />
            </div>

            <h4 className="text-md font-medium mb-2">Breaks</h4>
            {breakTimes.map((breakTime, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="time"
                  value={breakTime.start}
                  onChange={(e) =>
                    handleBreakStartChange(index, e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-32 mr-2"
                  min={startTime}
                  max={endTime}
                />
                <span className="mx-2">to</span>
                <input
                  type="time"
                  value={breakTime.end}
                  onChange={(e) => handleBreakEndChange(index, e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-32"
                  min={breakTime.start}
                  max={endTime}
                />
              </div>
            ))}
            <Button onClick={addBreakTime} className="mb-4">
              Add Break
            </Button>

            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} className="mr-2">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-200"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkingHours;
