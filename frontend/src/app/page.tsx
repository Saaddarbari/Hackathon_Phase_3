import Link from 'next/link';
import { Sparkles, Zap, Shield, ArrowRight, Layout } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 selection:bg-indigo-500/30">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="mb-8 p-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  animate-gradient shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/90 text-xs font-bold text-white uppercase tracking-widest leading-none">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Phase III: Agent-First Architecture
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8"><span className='text-white'>Chat With Your</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Todo Assistant
          </span>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-400 font-medium sm:text-xl leading-relaxed">
          Manage tasks through natural conversation. No forms, no clicks - just tell your AI assistant what you need to do.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
          <Link
            href="/signup"
            className="group relative flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition hover:bg-indigo-700 hover:shadow-[0_0_50px_-5px_rgba(79,70,229,0.6)] active:scale-95"
          >
            Deploy My Workspace
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/signin"
            className="flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl px-10 py-5 text-lg font-bold text-slate-200 transition hover:bg-slate-800 hover:border-slate-700 active:scale-95"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
          {[
            { icon: Zap, title: "Natural Language", desc: "Just chat - no forms or complex interfaces needed." },
            { icon: Shield, title: "Agent-Driven", desc: "AI interprets your intent and executes via MCP tools." },
            { icon: Layout, title: "Stateless", desc: "Every request reconstructs context from database." }
          ].map((feature, i) => (
            <div key={i} className="group p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300">
              <div className="mb-4 inline-flex p-3 rounded-2xl bg-slate-800 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section id="features" className="py-24 bg-black/15">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl text-slate-300 font-bold text-center mb-6">
            Everything You Need to <span className="text-indigo-400">Succeed</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Powerful features designed to maximize your productivity
          </p>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

            {/* AI-Powered Insights */}
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
              <h3 className="text-xl font-bold mb-3 text-slate-300 hover:text-indigo-300 transition-colors">AI-Powered Insights</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Smart suggestions based on your habits &amp; patterns
              </p>
            </div>

            {/* Smart Organization */}
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧩</div>
              <h3 className="text-xl font-bold mb-3 text-slate-300 group-hover:text-indigo-300 transition-colors">Smart Organization</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Auto-categorization and intelligent prioritization
              </p>
            </div>

            {/* Focus Mode */}
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
              <h3 className="text-xl font-bold mb-3 text-slate-300 group-hover:text-indigo-300 transition-colors">Focus Mode</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Adaptive focus blocks that match your rhythm
              </p>
            </div>

            {/* Real-time Sync */}
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
              <h3 className="text-xl font-bold mb-3 text-slate-300 group-hover:text-indigo-300 transition-colors">Real-time Sync</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Seamless updates across every device
              </p>
            </div>

            {/* Advanced Analytics */}
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold mb-3 text-slate-300 group-hover:text-indigo-300 transition-colors">Advanced Analytics</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Deep visibility into your productivity trends
              </p>
            </div>

            {/* Team Collaboration */}
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-xl font-bold mb-3 text-slate-300 group-hover:text-indigo-300 transition-colors">Team Collaboration</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Real-time shared projects &amp; task assignment
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* Floating Footer */}
      <div className="mt-32 flex flex-col items-center gap-4 text-slate-500">
        <div className="w-px h-12 bg-gradient-to-b from-indigo-500 via-transparent to-transparent" />
        <p className="text-xs uppercase tracking-widest font-bold opacity-30">© 2026 SAADDARBARI. All rights reserved.</p>
      </div>
    </main>
  );
}

