import Input from "@/components/ui/Input";

export default function AcademyBulletinsSection({
  newsletterEmail,
  setNewsletterEmail,
  handleNewsletter,
}) {
  return (
    <section className="py-8 bg-white border-t border-slate-200/80">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Newsletter */}
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              ACADEMY BULLETINS
            </span>
            <p className="text-xs text-slate-500">
              Subscribe to receive fresh training modules &amp; safety protocols.
            </p>
            <form onSubmit={handleNewsletter} className="mt-2 flex max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
            <div>
              <div className="text-xl font-black text-slate-900">1,250+</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Trainings Held</div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">25,340+</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Learners</div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">98%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Pass Rate</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
