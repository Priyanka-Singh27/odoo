import Link from "next/link";

export default function Home() {
  const portals = [
    {
      title: "Customer Portal",
      description: "Book appointments, reschedule slots, and track upcoming visits.",
      href: "/login",
      badge: "Customer",
      accent: "from-[#3852B4] to-[#5E7AC4]",
    },
    {
      title: "Organiser Portal",
      description: "Manage appointments, providers, slot rules, and booking operations.",
      href: "/organiser/dashboard",
      badge: "Organiser",
      accent: "from-[#0F766E] to-[#14B8A6]",
    },
    {
      title: "Admin Portal",
      description: "Monitor platform health, users, providers, and system-wide metrics.",
      href: "/admin/dashboard",
      badge: "Admin",
      accent: "from-[#9A3412] to-[#F08D39]",
    },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,122,196,0.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(240,141,57,0.22),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(56,82,180,0.32),transparent_35%)]" />
      <main className="relative w-full max-w-6xl rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-12">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
            Appointment Platform
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Role Based Access Portals
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            Choose the portal based on RBAC role. Each entrypoint routes to its dedicated workspace.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {portals.map((portal) => (
            <Link
              key={portal.title}
              href={portal.href}
              className="group rounded-2xl border border-white/20 bg-slate-900/50 p-5 transition hover:-translate-y-1 hover:border-white/35 hover:bg-slate-900/75"
            >
              <span className={`mb-3 inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold text-white ${portal.accent}`}>
                {portal.badge}
              </span>
              <h2 className="text-xl font-bold text-white">{portal.title}</h2>
              <p className="mt-2 text-sm text-slate-200">{portal.description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#F3BE7A] group-hover:text-white">
                Enter portal →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
