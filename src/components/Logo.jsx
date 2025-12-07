const Logo = ({ className = "w-32 h-32" }) => {
  return (
    <div className={className}>
      <svg className="w-full h-full" viewBox="0 0 120 120">
        {/* 5 concentric C-shaped arcs, open on the right with staggered endpoints */}
        {/* Outer arc - extends furthest right */}
        <path
          d="M 20 20 A 40 40 0 0 1 85 25"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 40 40 0 0 0 85 95"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Second arc */}
        <path
          d="M 25 25 A 35 35 0 0 1 80 30"
          fill="none"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 25 95 A 35 35 0 0 0 80 90"
          fill="none"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Third arc */}
        <path
          d="M 30 30 A 30 30 0 0 1 75 35"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 30 90 A 30 30 0 0 0 75 85"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Fourth arc */}
        <path
          d="M 35 35 A 25 25 0 0 1 70 40"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M 35 85 A 25 25 0 0 0 70 80"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Innermost arc - shortest on right */}
        <path
          d="M 40 40 A 20 20 0 0 1 65 45"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M 40 80 A 20 20 0 0 0 65 75"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

export default Logo;

