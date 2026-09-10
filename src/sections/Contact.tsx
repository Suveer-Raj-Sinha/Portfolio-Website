import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { Magnetic } from '../components/Magnetic';
import { profile } from '../data/profile';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      id="contact"
      className="min-h-screen min-h-svh flex flex-col justify-between px-6 lg:pl-40 lg:pr-24 pt-20 pb-6 relative"
    >
      <div className="my-auto max-w-6xl w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Direct Actions */}
          <div>
            <Reveal>
              <p className="mono-label text-accent text-xs mb-1">CONNECT // 10</p>
              <h2 className="font-semibold tracking-tight text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] mb-5">
                Have something worth building? Let's talk.
              </h2>
              <p className="text-text-muted text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
                Whether you're hiring for a high-impact engineering role, need a real-time system or
                3D web application, or just want to connect — my inbox is always open.
              </p>

              {/* Email Copy + Open Client Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-5 py-3 rounded-xl border border-line bg-panel/70 hover:border-accent hover:bg-panel transition-all duration-300 flex items-center gap-3 group text-left cursor-pointer"
                  aria-label="Copy email address to clipboard"
                >
                  <span className="font-mono text-xs sm:text-sm text-text group-hover:text-accent transition-colors font-medium">
                    {profile.email}
                  </span>
                  <span className="p-1 rounded bg-ink border border-line text-text-dim group-hover:text-accent transition-colors">
                    {copied ? (
                      <svg aria-hidden="true" className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </span>
                </button>

                <Magnetic
                  href={`mailto:${profile.email}`}
                  className="bg-accent text-ink font-medium px-5 py-3 rounded-xl text-xs sm:text-sm hover:bg-accent-dim transition-colors inline-flex items-center gap-2"
                >
                  Send Email
                  <span aria-hidden="true">&rarr;</span>
                </Magnetic>
              </div>

              {/* Copy Feedback Micro-Toast */}
              <div className={`h-5 transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
                <span className="mono-label text-[10px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  COPIED TO CLIPBOARD // READY TO COMPOSE
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-5 mt-4 pt-4 border-t border-line/50">
                <span className="mono-label text-[10px] text-text-dim">PROFILES //</span>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline mono-label text-xs hover:text-accent transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline mono-label text-xs hover:text-accent transition-colors"
                >
                  GitHub
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Live Dispatch & Availability Card */}
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-line bg-panel/40 backdrop-blur-md p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-line/60 pb-3 mb-5">
                <span className="mono-label text-[10px] text-accent font-semibold tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  DISPATCH // STATUS
                </span>
                <span className="font-mono text-[10px] text-text-dim">IST // UTC+5:30</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex flex-col items-start gap-1 py-1.5 border-b border-line/30 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-text-dim">AVAILABILITY</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_currentColor]" />
                    OPEN FOR ROLES
                  </span>
                </div>

                <div className="flex flex-col items-start gap-1 py-1.5 border-b border-line/30 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-text-dim">RESPONSE TIME</span>
                  <span className="text-text font-medium">&lt; 24 HOURS</span>
                </div>

                <div className="flex flex-col items-start gap-1 py-1.5 border-b border-line/30 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-text-dim">WORK PREFERENCE</span>
                  <span className="text-accent font-medium">REMOTE / HYBRID</span>
                </div>

                <div className="flex flex-col items-start gap-1 py-1.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-text-dim">FOCUS AREAS</span>
                  <span className="text-text font-medium text-right">3D WEB • REAL-TIME • FULL-STACK</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                <span className="mono-label text-[9px] text-text-dim">DIRECT INBOX</span>
                <span className="mono-label text-[10px] text-accent">OPEN 24/7</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </section>
  );
}
