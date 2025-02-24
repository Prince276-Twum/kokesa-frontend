import React from "react";
import {
  BiStore,
  BiCalendar,
  BiChart,
  BiCreditCard,
  BiHeadphone,
  BiSupport,
} from "react-icons/bi";

const features = [
  {
    icon: BiStore,
    title: "Effortless Setup",
    description:
      "Get your business online in minutes with our intuitive platform designed to match your brand effortlessly",
  },
  {
    icon: BiCalendar,
    title: "Appointment Scheduling",
    description:
      "A simple platform for seamless scheduling and management of appointments at your service, anytime, anywhere",
  },
  {
    icon: BiChart,
    title: "Insightful Analytics",
    description:
      "Unlock valuable business insights with detailed analytics that help you understand customer sharing growth",
  },
  {
    icon: BiCreditCard,
    title: "Secure Payment Integration",
    description:
      "Offer your clients a safe and seamless payment experience while securely processing with smooth transactions",
  },
  {
    icon: BiHeadphone,
    title: "Powerful Marketing Tools",
    description:
      "Boost your visibility with our suite of marketing tools that help attract new clients and keep booking more program",
  },
  {
    icon: BiSupport,
    title: "Dedicated Support & Training",
    description:
      "Our expert support team is available around the clock to help you navigate every feature for your business success",
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            A full solution to manage and scale your business
          </h2>
          <p className="text-gray-600 text-lg">
            Kokesa has the needed tools to get clients, schedule appointments,
            collect sales and retain clients
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl flex flex-col items-start gap-4"
            >
              <div className="w-12 h-12 bg-[#EB5017]/10 rounded-xl flex items-center justify-center">
                <Icon className="text-2xl text-[#EB5017]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
