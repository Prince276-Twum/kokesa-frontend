import React from "react";

function CompleteIlustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      className="w-full h-full"
    >
      {/* Background Elements */}
      <circle cx="400" cy="300" r="200" fill="#FFF1EC" opacity="0.6" />
      <circle cx="200" cy="150" r="20" fill="#FFE4D9" opacity="0.5" />
      <circle cx="600" cy="450" r="15" fill="#FFE4D9" opacity="0.5" />
      <circle cx="700" cy="200" r="10" fill="#FFE4D9" opacity="0.5" />
      <circle cx="150" cy="400" r="12" fill="#FFE4D9" opacity="0.5" />

      {/* Device Frame */}
      <rect
        x="250"
        y="100"
        width="300"
        height="220"
        rx="10"
        ry="10"
        fill="#1A1A1A"
      />
      <rect
        x="260"
        y="110"
        width="280"
        height="190"
        rx="5"
        ry="5"
        fill="white"
      />

      {/* Calendar Icons on Screen */}
      <rect
        x="280"
        y="140"
        width="60"
        height="60"
        rx="5"
        ry="5"
        fill="#FFE4D9"
      />
      <rect
        x="285"
        y="145"
        width="50"
        height="15"
        rx="2"
        ry="2"
        fill="#EB5017"
      />
      <rect
        x="290"
        y="165"
        width="10"
        height="10"
        rx="1"
        ry="1"
        fill="#1A1A1A"
        opacity="0.7"
      />
      <rect
        x="305"
        y="165"
        width="10"
        height="10"
        rx="1"
        ry="1"
        fill="#1A1A1A"
        opacity="0.7"
      />
      <rect
        x="320"
        y="165"
        width="10"
        height="10"
        rx="1"
        ry="1"
        fill="#1A1A1A"
        opacity="0.7"
      />
      <rect
        x="290"
        y="180"
        width="10"
        height="10"
        rx="1"
        ry="1"
        fill="#1A1A1A"
        opacity="0.7"
      />
      <rect
        x="305"
        y="180"
        width="10"
        height="10"
        rx="1"
        ry="1"
        fill="#EB5017"
      />
      <rect
        x="320"
        y="180"
        width="10"
        height="10"
        rx="1"
        ry="1"
        fill="#1A1A1A"
        opacity="0.7"
      />

      {/* Business Graph Icon */}
      <rect
        x="370"
        y="140"
        width="60"
        height="60"
        rx="5"
        ry="5"
        fill="#FFE4D9"
      />
      <polyline
        points="380,190 390,170 400,180 410,150 420,160"
        stroke="#EB5017"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="390" cy="170" r="3" fill="#EB5017" />
      <circle cx="400" cy="180" r="3" fill="#EB5017" />
      <circle cx="410" cy="150" r="3" fill="#EB5017" />

      {/* Customer Icon */}
      <rect
        x="460"
        y="140"
        width="60"
        height="60"
        rx="5"
        ry="5"
        fill="#FFE4D9"
      />
      <circle cx="490" cy="155" r="10" fill="#EB5017" />
      <path
        d="M475,185 C475,175 485,170 490,170 C495,170 505,175 505,185"
        fill="#EB5017"
      />

      {/* Loading Bar */}
      <rect
        x="290"
        y="220"
        width="220"
        height="10"
        rx="5"
        ry="5"
        fill="#E5E7EB"
      />
      <rect
        x="290"
        y="220"
        width="220"
        height="10"
        rx="5"
        ry="5"
        fill="#EB5017"
      />

      {/* Success Check Mark */}
      <circle cx="400" cy="320" r="40" fill="#EB5017" />
      <polyline
        points="380,320 395,335 420,305"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Business Person */}
      <circle cx="560" cy="360" r="25" fill="#FFD3C0" />
      <path
        d="M560,385 C560,385 540,400 540,430 C540,450 550,470 560,470 C570,470 580,450 580,430 C580,400 560,385 560,385"
        fill="#EB5017"
      />
      <path
        d="M540,400 C530,405 520,415 515,440"
        stroke="#EB5017"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M580,400 C590,405 600,415 605,440"
        stroke="#EB5017"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="550" cy="355" r="3" fill="#1A1A1A" />
      <circle cx="570" cy="355" r="3" fill="#1A1A1A" />
      <path
        d="M550,370 C555,375 565,375 570,370"
        stroke="#1A1A1A"
        strokeWidth="2"
        fill="none"
      />

      {/* Client Person */}
      <circle cx="240" cy="360" r="25" fill="#FFD3C0" />
      <path
        d="M240,385 C240,385 220,400 220,430 C220,450 230,470 240,470 C250,470 260,450 260,430 C260,400 240,385 240,385"
        fill="#6B7280"
      />
      <path
        d="M220,400 C210,415 215,435 220,440"
        stroke="#6B7280"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M260,400 C280,410 260,450 250,460"
        stroke="#6B7280"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect
        x="235"
        y="425"
        width="30"
        height="40"
        fill="white"
        stroke="#1A1A1A"
        strokeWidth="1"
      />
      <line
        x1="245"
        y1="435"
        x2="260"
        y2="435"
        stroke="#1A1A1A"
        strokeWidth="1"
      />
      <line
        x1="245"
        y1="445"
        x2="260"
        y2="445"
        stroke="#1A1A1A"
        strokeWidth="1"
      />
      <line
        x1="245"
        y1="455"
        x2="260"
        y2="455"
        stroke="#1A1A1A"
        strokeWidth="1"
      />
      <circle cx="230" cy="355" r="3" fill="#1A1A1A" />
      <circle cx="250" cy="355" r="3" fill="#1A1A1A" />
      <path
        d="M230,370 C235,375 245,375 250,370"
        stroke="#1A1A1A"
        strokeWidth="2"
        fill="none"
      />

      {/* Calendar Meeting */}
      <rect
        x="330"
        y="380"
        width="140"
        height="110"
        rx="5"
        ry="5"
        fill="white"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <rect
        x="340"
        y="390"
        width="120"
        height="20"
        rx="2"
        ry="2"
        fill="#EB5017"
        opacity="0.2"
      />
      <text x="360" y="405" fontFamily="Arial" fontSize="12" fill="#1A1A1A">
        APPOINTMENT
      </text>
      <line
        x1="340"
        y1="420"
        x2="460"
        y2="420"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      <text x="340" y="440" fontFamily="Arial" fontSize="12" fill="#6B7280">
        Date:{" "}
      </text>
      <text x="375" y="440" fontFamily="Arial" fontSize="12" fill="#1A1A1A">
        Mar 5, 2025
      </text>
      <text x="340" y="460" fontFamily="Arial" fontSize="12" fill="#6B7280">
        Time:{" "}
      </text>
      <text x="375" y="460" fontFamily="Arial" fontSize="12" fill="#1A1A1A">
        10:00 AM
      </text>
      <text x="340" y="480" fontFamily="Arial" fontSize="12" fill="#6B7280">
        Status:{" "}
      </text>
      <text x="375" y="480" fontFamily="Arial" fontSize="12" fill="#EB5017">
        Confirmed
      </text>

      {/* Confetti */}
      <circle cx="200" cy="200" r="5" fill="#EB5017" />
      <circle cx="600" cy="250" r="8" fill="#FF6B3D" />
      <circle cx="500" cy="150" r="6" fill="#FFE4D9" />
      <circle cx="650" cy="350" r="7" fill="#EB5017" />
      <circle cx="300" cy="450" r="9" fill="#FF6B3D" />
      <rect
        x="220"
        y="250"
        width="10"
        height="10"
        transform="rotate(45,225,255)"
        fill="#EB5017"
      />
      <rect
        x="620"
        y="300"
        width="15"
        height="15"
        transform="rotate(30,627,307)"
        fill="#FF6B3D"
      />
      <rect
        x="500"
        y="450"
        width="12"
        height="12"
        transform="rotate(60,506,456)"
        fill="#EB5017"
      />
    </svg>
  );
}

export default CompleteIlustration;
