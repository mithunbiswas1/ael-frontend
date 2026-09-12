// src/app/(pages)/acts-and-rules/_components/ActsLibrarySection.jsx
import ActsLibraryInteractive, { STATUTES_DATA } from "../_client/ActsLibraryInteractive";

export { STATUTES_DATA };

export default function ActsLibrarySection() {
  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-5xl px-4 pb-20">
      <ActsLibraryInteractive />

      {/* Legal Disclaimer Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500 leading-relaxed">
        <strong className="text-slate-800 block mb-1">Official Disclaimer:</strong>
        The legal texts and gazette orders published on this portal are indexed for educational and compliance reference purposes only. For judicial or court proceedings, please refer to the official hardcopy Bangladesh Government Gazette published by the Department of Printing and Publications.
      </div>
    </section>
  );
}
