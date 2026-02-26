import Link from "next/link";
import { Settings as SettingsIcon, MessageSquare, BarChart3, Sliders, Zap } from "lucide-react";

export default function Settings() {
  const settingsCards = [
    {
      icon: <MessageSquare className="w-4 h-4" />,
      title: "Response preferences",
      description: "Choose tones and styles for suggested replies.",
      status: "Coming soon"
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      title: "Analysis sensitivity",
      description: "Adjust how sensitive analysis is to tone and context.",
      status: "Coming soon"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Quick actions",
      description: "Save shortcuts for common scenarios.",
      status: "Coming soon"
    },
    {
      icon: <Sliders className="w-4 h-4" />,
      title: "Interface preferences",
      description: "Customize layout and accessibility options.",
      status: "Coming soon"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950" style={{ backgroundImage: 'url("/assets/gradient-BZl8jpii.png")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
      <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none" />
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-zinc-400 mb-6">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-[15px] text-zinc-400 leading-relaxed">
            Personalize Kairoo to match how you practice. More options coming soon.
          </p>
        </div>

        <div className="space-y-3 mb-12">
          {settingsCards.map((card) => (
            <div
              key={card.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl"
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 flex-shrink-0 mt-0.5">
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white text-[15px]">{card.title}</h3>
                  <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">
                    {card.status}
                  </span>
                </div>
                <p className="text-[13px] text-zinc-400 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl text-center">
          <p className="text-[15px] text-zinc-300 mb-4">
            The core experience is ready while we build out preferences.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 font-semibold text-[13px] rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Go to practice
          </Link>
        </div>
      </main>
    </div>
  );
} 