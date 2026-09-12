// src/app/(pages)/courses/_components/AcademyBulletinsSection.jsx
import AcademyBulletinForm from "../_client/AcademyBulletinForm";

export default function AcademyBulletinsSection() {
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
            <AcademyBulletinForm />
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
            <div>
              <div className="text-xl font-black text-slate-900">1,250+</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Trainings Held
              </div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">25,340+</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Learners
              </div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">98%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Pass Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
