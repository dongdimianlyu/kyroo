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
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 mb-6">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Settings</h1>
          <p className="text-[15px] text-neutral-500 leading-relaxed">
            Personalize Kairoo to match how you practice. More options coming soon.
          </p>
        </div>

        <div className="space-y-3 mb-12">
          {settingsCards.map((card) => (
            <div
              key={card.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-white border border-neutral-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0 mt-0.5">
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-neutral-900 text-[15px]">{card.title}</h3>
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-full">
                    {card.status}
                  </span>
                </div>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200/40 text-center">
          <p className="text-[15px] text-neutral-600 mb-4">
            The core experience is ready while we build out preferences.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white font-medium text-[13px] rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200"
          >
            Go to practice
          </Link>
        </div>
      </main>
    </div>
  );
} 