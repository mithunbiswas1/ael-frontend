export default function TermsContentSection() {
  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
            Last Revised: May 2024
          </span>
          <h2 className="text-base font-bold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By accessing, browsing, or enrolling in any course provided on the Safe LPG platform, you agree to be legally bound by these Terms of Service, the Explosives Act 1884, Gas Cylinder Rules 1991 (amended 2004), and BERC statutory notifications. If you do not agree with any provision, you must discontinue platform use immediately.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            2. Certificate Validity & Ethical Conduct
          </h2>
          <p className="mt-2">
            Certificates of completion are issued strictly based on individual learner engagement and successful attainment of an 80% threshold in official assessment quizzes. The following behaviors constitute grounds for immediate certificate revocation and referral to regulatory authorities:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1.5 text-slate-700">
            <li>Submitting fraudulent identity documents during registration.</li>
            <li>Attempting to forge, falsify, or replicate digital verification QR codes.</li>
            <li>Unauthorized commercial redistribution or resale of LMS lecture videos and technical safety guides.</li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            3. Operational Safety & Emergency Disclaimer
          </h2>
          <p className="mt-2">
            While our guidelines reflect current best practices and national engineering codes, training completion does not substitute for on-site statutory inspections conducted by the Department of Explosives (DoE) or Fire Service & Civil Defense. In active gas leak emergencies, prioritize human life, evacuate immediately, and dial emergency telephone <strong>16137</strong>.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            4. Subscription Billing & Refunds
          </h2>
          <p className="mt-2">
            Subscriptions for commercial dealer portals or household plus features are billed in advance on a monthly or annual recurring basis. Unused periods are refundable within 7 days of initial purchase provided no formal certification has been generated or issued.
          </p>
        </div>
      </div>
    </section>
  );
}
