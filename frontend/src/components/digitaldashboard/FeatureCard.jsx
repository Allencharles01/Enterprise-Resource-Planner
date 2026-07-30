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
        rounded-3xl

        border border-gray-200/70
        bg-white/90
        backdrop-blur-xl

        p-6

        transition-all
        duration-500

        hover:-translate-y-2
        hover:scale-[1.02]
        hover:border-violet-300
        hover:shadow-[0_20px_60px_rgba(124,58,237,0.18)]

        dark:border-white/10
        dark:bg-[#0B1224]
        dark:hover:border-violet-500/40
        dark:hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)]
      "
    >
      {/* Animated Glow */}
      <div
        className="
          absolute
          -right-10
          -top-10
          h-40
          w-40
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
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
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
              mt-5

              text-lg
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
              mt-2

              text-sm
              leading-6

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
        <div className="mt-8 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {statLabel}
            </p>

            <p
              className="
                mt-1

                text-2xl
                font-bold

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
              gap-2

              rounded-xl

              border
              border-gray-200

              bg-white

              px-4
              py-2

              text-sm
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
              size={15}
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