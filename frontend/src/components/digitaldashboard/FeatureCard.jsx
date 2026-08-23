import { ArrowRight } from "lucide-react";

export default function FeatureCard({
  icon,
  iconBg,
  title,
  description,
  stat,
  statLabel,
  onOpen,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl

        border border-gray-200/70
        bg-white/90
        backdrop-blur-xl

        p-4 sm:p-5

        transition-all
        duration-500

        hover:-translate-y-1.5
        hover:scale-[1.01]
        hover:border-violet-300
        hover:shadow-[0_15px_40px_rgba(124,58,237,0.12)]

        dark:border-white/10
        dark:bg-[#0B1224]
        dark:hover:border-violet-500/40
        dark:hover:shadow-[0_15px_40px_rgba(124,58,237,0.08)]
      "
    >
      {/* Animated Glow */}
      <div
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-violet-400/10
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-150
        "
      />

      {/* Shimmer */}
      <div
        className="
          absolute
          inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/25
          to-transparent

          transition-transform
          duration-1000

          group-hover:translate-x-full
        "
      />

      <div className="relative z-10 flex flex-col justify-between h-full">

        {/* ICON */}
        <div>

          <div
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-white

              ${iconBg}

              transition-all
              duration-500

              group-hover:rotate-6
              group-hover:scale-110
            `}
          >
            {icon}
          </div>

          {/* TITLE */}
          <h3
            className="
              mt-3

              text-base
              font-bold

              text-gray-900

              transition-all
              duration-300

              group-hover:text-violet-700

              dark:text-white
              dark:group-hover:text-violet-300
            "
          >
            {title}
          </h3>

          {/* DESCRIPTION */}
          <p
            className="
              mt-1

              text-xs
              leading-normal

              text-gray-500

              transition-colors
              duration-300

              group-hover:text-gray-700

              dark:text-gray-400
              dark:group-hover:text-gray-300
            "
          >
            {description}
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {statLabel}
            </p>

            <p
              className="
                mt-0.5

                text-lg
                sm:text-xl
                font-extrabold

                text-gray-900

                transition-all
                duration-300

                group-hover:scale-105

                dark:text-white
              "
            >
              {stat}
            </p>

          </div>

          <button
            onClick={onOpen}
            className="
              flex
              items-center
              gap-1.5

              rounded-xl

              border
              border-gray-200

              bg-white

              px-3
              py-1.5

              text-xs
              font-semibold

              text-gray-700

              transition-all
              duration-300

              hover:border-violet-300
              hover:bg-violet-50
              hover:text-violet-700
              hover:shadow-lg
              hover:shadow-violet-500/20

              dark:border-white/10
              dark:bg-white/5
              dark:text-gray-200
              dark:hover:bg-violet-500/10
              dark:hover:border-violet-500/40
            "
          >
            Open

            <ArrowRight
              size={13}
              className="
                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            />
          </button>

        </div>
      </div>
    </div>
  );
}