import React from "react";

const BusinessStats = () => {
  const stats = [
    { number: "100,000+", label: "Appointments booked on Kokesa" },
    { number: "1,000+", label: "Partner Businesses" },
    { number: "100+", label: "Countries" },
    { number: "50,000+", label: "Stylists & Professionals" },
  ];

  return (
    <section className="py-20 px-6 lg:px-8 bg-[#FFECE5]">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            The top-rated destination for business owners
          </h2>
          <p className="text-gray-600 text-lg">
            We are trusted by the best in the business
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-[#EB5017] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessStats;
