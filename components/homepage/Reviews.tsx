"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaQuoteLeft } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Button from "../UI/Button";

interface ReviewData {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  review: string;
  rating: number;
}

const reviews: ReviewData[] = [
  {
    id: 1,
    name: "Stella Nelson",
    role: "Owner",
    company: "Stellar Beauty Salon",
    image: "/path-to-placeholder.jpg",
    review:
      "Using this booking system has been a game-changer for our salon. It has streamlined our scheduling process and improved our overall customer experience.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Manager",
    company: "Urban Cuts",
    image: "/path-to-placeholder.jpg",
    review:
      "Kokesa has revolutionized how we handle appointments. The automated reminders have reduced no-shows by 75%, and our clients love the easy booking process.",
    rating: 5,
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Founder",
    company: "Glow Beauty Spa",
    image: "/path-to-placeholder.jpg",
    review:
      "The analytics features have helped us understand our business better. We've optimized our scheduling and increased revenue by 40% in just three months.",
    rating: 5,
  },
];

const ReviewCard: React.FC<{ review: ReviewData }> = ({ review }) => (
  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mx-4 md:mx-0">
    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 mb-6">
      <div className="mx-auto md:mx-0">
        <Image
          src={review.image}
          alt={review.name}
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-semibold text-gray-900">{review.name}</h3>
        <p className="text-[#EB5017]">{review.role}</p>
        <p className="text-gray-600 text-sm">{review.company}</p>
      </div>
    </div>

    <div className="relative">
      <FaQuoteLeft className="text-[#EB5017]/10 text-4xl absolute -top-2 -left-2" />
      <p className="text-gray-700 text-base md:text-lg leading-relaxed pl-6">
        {review.review}
      </p>
    </div>

    <div className="mt-6 flex items-center justify-center md:justify-start">
      {[...Array(review.rating)].map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
);

const Reviews: React.FC = () => {
  return (
    <section className="section bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="heading-h2">Reviews from business owners on Kokesa</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied business owners who have transformed
            their booking experience
          </p>
        </div>

        <div className="review-slider">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            navigation={{
              enabled: true,
              hideOnClick: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: false,
              },
            }}
            className="!pb-14"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center flex justify-center mt-12 w-full">
          <Button
            el="anchor"
            primary
            rounded
            href="auth/registration"
            className=" hover:bg-[#FF6B3D] transition-colors w-[50%] md:w-[30%]"
          >
            Get Started Today
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .review-slider .swiper-button-next,
        .review-slider .swiper-button-prev {
          color: #eb5017;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .review-slider .swiper-button-next:after,
        .review-slider .swiper-button-prev:after {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .review-slider .swiper-button-next,
          .review-slider .swiper-button-prev {
            display: none;
          }
        }

        .review-slider .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #eb5017;
          opacity: 0.3;
        }

        .review-slider .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }

        .review-slider .swiper-wrapper {
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .review-slider .swiper-slide {
          height: auto;
          transition: transform 0.3s ease;
        }

        .review-slider .swiper-slide:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </section>
  );
};

export default Reviews;
