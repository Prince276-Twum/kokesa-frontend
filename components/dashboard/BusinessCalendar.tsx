import React, { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
  View,
  NavigateAction,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Clock,
  User,
  Info,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Set up the localizer for dates
const localizer = momentLocalizer(moment);

interface Customer {
  name: string;
  phone: string;
  email: string;
}

interface AppointmentEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  service: string;
  duration: number;
  price: number;
  customer: Customer;
  notes?: string;
}

// Custom appointment event component
const AppointmentEvent = ({ event }: { event: AppointmentEvent }) => {
  const statusColors = {
    confirmed: "bg-green-100 border-l-4 border-green-500",
    pending: "bg-yellow-100 border-l-4 border-yellow-500",
    cancelled: "bg-red-100 border-l-4 border-red-500",
    completed: "bg-blue-100 border-l-4 border-blue-500",
  };

  return (
    <div className={`${statusColors[event.status]} p-1 overflow-hidden h-full`}>
      <div className="font-medium text-gray-800 truncate">{event.title}</div>
      <div className="flex items-center text-xs text-gray-600">
        <Clock className="mr-1" size={12} />
        {moment(event.start).format("h:mm A")} -{" "}
        {moment(event.end).format("h:mm A")}
      </div>
      <div className="flex items-center text-xs text-gray-600 truncate">
        <User className="mr-1" size={12} />
        {event.customer.name}
      </div>
    </div>
  );
};

// Custom toolbar component
const CustomToolbar = ({
  date,
  onNavigate,
  onView,
  view,
  views,
}: {
  date: Date;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
  onView: (view: View) => void;
  view: View;
  views: View[];
}) => {
  const navigate = (action: NavigateAction) => {
    onNavigate(action);
  };

  const viewNames: { [key in keyof typeof Views]: string } = {
    MONTH: "Month",
    WEEK: "Week",
    WORK_WEEK: "Work Week",
    DAY: "Day",
    AGENDA: "Agenda",
  };

  const goToToday = () => {
    navigate("TODAY");
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => navigate("PREV")}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="mx-4 font-semibold text-lg">
          {moment(date).format("MMMM YYYY")}
        </h2>
        <button
          type="button"
          onClick={() => navigate("NEXT")}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex space-x-2">
        <div className="flex border rounded-md overflow-hidden">
          {views.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onView(name)}
              className={`px-3 py-1 text-sm ${
                view === name
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {viewNames[name as keyof typeof viewNames]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={goToToday}
          className="bg-primary text-white px-3 py-1 rounded text-sm"
        >
          Today
        </button>
      </div>
    </div>
  );
};

// Event details modal component
const AppointmentModal = ({
  event,
  onClose,
  onStatusChange,
}: {
  event: AppointmentEvent;
  onClose: () => void;
  onStatusChange: (id: number, status: AppointmentEvent["status"]) => void;
}) => {
  if (!event) return null;

  const statusBadge = {
    confirmed: (
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
        <CheckCircle className="mr-1" size={12} /> Confirmed
      </span>
    ),
    pending: (
      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
        <Info className="mr-1" size={12} /> Pending
      </span>
    ),
    cancelled: (
      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
        <XCircle className="mr-1" size={12} /> Cancelled
      </span>
    ),
    completed: (
      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
        <CheckCircle className="mr-1" size={12} /> Completed
      </span>
    ),
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-primary p-4 text-white">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <p className="text-white/90">
            {moment(event.start).format("dddd, MMMM D, YYYY")}
          </p>
          <p className="text-white/90">
            {moment(event.start).format("h:mm A")} -{" "}
            {moment(event.end).format("h:mm A")}
          </p>
        </div>

        <div className="p-4">
          <div className="mb-4">{statusBadge[event.status]}</div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-gray-500 mb-1">
                Customer Information
              </h4>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">{event.customer.name}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Phone className="mr-2" size={14} /> {event.customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Mail className="mr-2" size={14} /> {event.customer.email}
                </div>
              </div>
            </div>

            {event.notes && (
              <div>
                <h4 className="text-sm text-gray-500 mb-1">Notes</h4>
                <p className="bg-gray-50 p-3 rounded text-sm">{event.notes}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm text-gray-500 mb-1">Service Details</h4>
              <div className="bg-gray-50 p-3 rounded">
                <p>
                  <span className="text-gray-600">Service:</span>{" "}
                  {event.service}
                </p>
                <p>
                  <span className="text-gray-600">Duration:</span>{" "}
                  {event.duration} minutes
                </p>
                <p>
                  <span className="text-gray-600">Price:</span> $
                  {event.price.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-500 mb-1">Update Status</h4>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => onStatusChange(event.id, "confirmed")}
                  className={`py-1 px-2 rounded text-xs flex items-center justify-center ${
                    event.status === "confirmed"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  <CheckCircle className="mr-1" size={12} /> Confirm
                </button>
                <button
                  onClick={() => onStatusChange(event.id, "completed")}
                  className={`py-1 px-2 rounded text-xs flex items-center justify-center ${
                    event.status === "completed"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <CheckCircle className="mr-1" size={12} /> Complete
                </button>
                <button
                  onClick={() => onStatusChange(event.id, "pending")}
                  className={`py-1 px-2 rounded text-xs flex items-center justify-center ${
                    event.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <Info className="mr-1" size={12} /> Pending
                </button>
                <button
                  onClick={() => onStatusChange(event.id, "cancelled")}
                  className={`py-1 px-2 rounded text-xs flex items-center justify-center ${
                    event.status === "cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <XCircle className="mr-1" size={12} /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface BusinessCalendarProps {
  viewMode?: View;
  onViewModeChange?: (mode: string) => void;
  className?: string;
}

const BusinessCalendar: React.FC<BusinessCalendarProps> = ({
  viewMode = "week",
  onViewModeChange,
  className = "",
}) => {
  const [selectedView, setSelectedView] = useState<View>(
    viewMode || Views.WEEK
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (viewMode !== selectedView) {
      setSelectedView(viewMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Sample data - in a real app, you would fetch this from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const today = new Date();
      const sampleAppointments: AppointmentEvent[] = [
        {
          id: 1,
          title: "Haircut",
          start: moment(today).hour(10).minute(0).toDate(),
          end: moment(today).hour(11).minute(0).toDate(),
          status: "confirmed",
          service: "Men's Haircut",
          duration: 60,
          price: 35,
          customer: {
            name: "John Doe",
            phone: "(555) 123-4567",
            email: "john@example.com",
          },
          notes: "Regular client, prefers scissors cut.",
        },
        {
          id: 2,
          title: "Manicure",
          start: moment(today).hour(13).minute(30).toDate(),
          end: moment(today).hour(14).minute(30).toDate(),
          status: "pending",
          service: "Classic Manicure",
          duration: 60,
          price: 45,
          customer: {
            name: "Sara Johnson",
            phone: "(555) 987-6543",
            email: "sara@example.com",
          },
        },
        {
          id: 3,
          title: "Massage",
          start: moment(today).add(1, "days").hour(15).minute(0).toDate(),
          end: moment(today).add(1, "days").hour(16).minute(0).toDate(),
          status: "confirmed",
          service: "Swedish Massage",
          duration: 60,
          price: 80,
          customer: {
            name: "Robert Smith",
            phone: "(555) 456-7890",
            email: "robert@example.com",
          },
          notes: "First-time client. Focus on shoulder tension.",
        },
        {
          id: 4,
          title: "Haircut & Color",
          start: moment(today).add(1, "days").hour(11).minute(0).toDate(),
          end: moment(today).add(1, "days").hour(13).minute(30).toDate(),
          status: "confirmed",
          service: "Women's Cut & Color",
          duration: 150,
          price: 120,
          customer: {
            name: "Emily Davis",
            phone: "(555) 234-5678",
            email: "emily@example.com",
          },
          notes: "Wants to go from brown to blonde.",
        },
        {
          id: 5,
          title: "Facial",
          start: moment(today).subtract(1, "days").hour(14).minute(0).toDate(),
          end: moment(today).subtract(1, "days").hour(15).minute(0).toDate(),
          status: "completed",
          service: "Deep Cleansing Facial",
          duration: 60,
          price: 75,
          customer: {
            name: "Michael Brown",
            phone: "(555) 876-5432",
            email: "michael@example.com",
          },
        },
        {
          id: 6,
          title: "Beard Trim",
          start: moment(today).add(2, "days").hour(16).minute(30).toDate(),
          end: moment(today).add(2, "days").hour(17).minute(0).toDate(),
          status: "confirmed",
          service: "Beard Trim & Shape",
          duration: 30,
          price: 25,
          customer: {
            name: "James Wilson",
            phone: "(555) 345-6789",
            email: "james@example.com",
          },
        },
      ];

      setAppointments(sampleAppointments);
      setIsLoading(false);
    }, 800);
  }, []);

  // Handle view change
  const handleViewChange = (newView: View) => {
    setSelectedView(newView);
    if (onViewModeChange) {
      onViewModeChange(newView);
    }
  };

  // Handle event selection
  const handleSelectEvent = (event: AppointmentEvent) => {
    setSelectedEvent(event);
  };

  // Handle status change
  const handleStatusChange = (
    eventId: number,
    newStatus: AppointmentEvent["status"]
  ) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === eventId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );

    // Update the selected event state too
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        status: newStatus,
      });
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Calendar event styles
  const eventStyleGetter = (event: AppointmentEvent) => {
    const style = {
      borderRadius: "0",
      opacity: 1,
      color: "black",
      border: "0",
      display: "block",
      width: "100%",
    };
    return { style };
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              defaultView={Views.WEEK}
              view={selectedView}
              views={["month", "week", "day", "agenda"]}
              onView={handleViewChange}
              onNavigate={(date) => setSelectedDate(date)}
              date={selectedDate}
              step={30}
              timeslots={2}
              components={{
                event: AppointmentEvent as any,
                toolbar: CustomToolbar as any,
              }}
              popup
              selectable
              eventPropGetter={eventStyleGetter as any}
              onSelectEvent={handleSelectEvent}
              style={{ height: "100%" }}
              className="calendar-container"
            />
          </div>

          {selectedEvent && (
            <AppointmentModal
              event={selectedEvent}
              onClose={handleCloseModal}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BusinessCalendar;
