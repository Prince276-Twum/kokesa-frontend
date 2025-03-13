import React, { useState, useEffect } from "react";
import { Appointment } from "@/components/dashboard/apointments/AppointmentTable";
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  User,
  Scissors,
  MessageSquare,
} from "lucide-react";

interface EditAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (updatedAppointment: Appointment) => void;
  serviceProviders: string[];
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSave,
  serviceProviders,
}) => {
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Status options
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "reschedule", label: "Rescheduled" },
    { value: "cancel", label: "Cancelled" },
    { value: "complete", label: "Completed" },
    { value: "no-show", label: "No-Show" },
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: "unpaid", label: "Unpaid" },
    { value: "partially_paid", label: "Partially Paid" },
    { value: "paid", label: "Paid" },
    { value: "refunded", label: "Refunded" },
    { value: "charged", label: "Charged" },
  ];

  // Initialize form data when appointment changes
  useEffect(() => {
    if (appointment) {
      setFormData({ ...appointment });
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_name?.trim()) {
      newErrors.client_name = "Client name is required";
    }

    if (!formData.service_name?.trim()) {
      newErrors.service_name = "Service is required";
    }

    if (!formData.service_provider?.trim()) {
      newErrors.service_provider = "Service provider is required";
    }

    if (!formData.date?.trim()) {
      newErrors.date = "Date is required";
    }

    if (!formData.time?.trim()) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData as Appointment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Appointment</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-gray-700 flex items-center">
                <User size={18} className="mr-2" /> Client Information
              </h3>
              <div>
                <label
                  htmlFor="client_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Client Name
                </label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.client_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.client_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.client_name}
                  </p>
                )}
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-gray-700 flex items-center">
                <Scissors size={18} className="mr-2" /> Service Information
              </h3>
              <div>
                <label
                  htmlFor="service_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service
                </label>
                <input
                  type="text"
                  id="service_name"
                  name="service_name"
                  value={formData.service_name || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.service_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.service_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.service_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="service_provider"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service Provider
                </label>
                <select
                  id="service_provider"
                  name="service_provider"
                  value={formData.service_provider || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.service_provider
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Provider</option>
                  {serviceProviders.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
                {errors.service_provider && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.service_provider}
                  </p>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <Calendar size={16} className="mr-1" /> Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <Clock size={16} className="mr-1" /> Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.time ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            {/* Duration and Price */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration || ""}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <DollarSign size={16} className="mr-1" /> Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Appointment Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <MessageSquare size={16} className="mr-1" /> Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
