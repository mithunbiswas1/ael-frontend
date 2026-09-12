import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Lock,
} from "lucide-react";
import { H1, H3, P } from "@/components/ui/Typography";
import BlogSocialShare from "../_client/BlogSocialShare";
import BlogVideoPlayer from "../_client/BlogVideoPlayer";

export default function BlogArticleContent({ currentPost }) {
  return (
    <article className="space-y-6 lg:col-span-8">
      {/* Header: Title & Meta & Social Share */}
      <div>
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          {currentPost.category}
        </span>

        <H1 className="text-2xl sm:text-3xl md:text-4xl">
          {currentPost.title}
        </H1>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200/80 py-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-semibold text-slate-800">
              By {currentPost.author}
            </span>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{currentPost.date}</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{currentPost.readTime}</span>
            </div>
          </div>

          {/* Share Icons */}
          <BlogSocialShare title={currentPost.title} />
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-xs">
        <Image
          src={currentPost.imageUrl}
          alt={currentPost.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 text-slate-700 shadow-xs space-y-6 text-sm leading-relaxed">
        <P weight="semibold" color="dark" size="lg">
          Liquefied Petroleum Gas (LPG) is a clean, cost-efficient, and versatile fuel when handled in accordance with established regulatory protocols. However, inadvertent negligence can lead to avoidable hazard scenarios. Adhere to these certified procedures to guarantee safety in your home or commercial establishment.
        </P>

        <div>
          <H3 className="text-base">
            1. Conduct Periodic Soap Solution Leak Tests
          </H3>
          <P color="gray" className="mt-2">
            Always inspect regulator o-rings and hose connections by dabbing a mild soap-water mixture around all joints. Formation of expanding bubbles signals an active gas escape. Never use open flames or matches to detect leaks. Should a leak occur, immediately disengage the regulator valve and ensure cross-ventilation.
          </P>
        </div>

        {/* Embedded Video Mockup with Play Button */}
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
          <Image
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"
            alt="Video demonstration of cylinder check"
            fill
            className="object-cover opacity-80"
          />
          <BlogVideoPlayer />
          <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            Safety Demonstration Video (3:45)
          </div>
        </div>

        <div>
          <H3 className="text-base">
            2. Ensure Constant Low-Level Kitchen Ventilation
          </H3>
          <P color="gray" className="mt-2">
            Because LPG vapors are denser than ambient air, escaped gas tends to settle along floor levels and corners rather than rising toward ceiling vents. Keep lower kitchen windows cracked and ensure baseboards allow airflow.
          </P>
        </div>

        <div>
          <H3 className="text-base">
            3. Maintain Cylinders in an Upright Vertical Position
          </H3>
          <P color="gray" className="mt-2">
            Never tilt, invert, or store LPG cylinders horizontally. Cylinders must always rest vertically on dry, even ground. Storing cylinders on their side allows liquid LPG to bypass internal safety vapor spaces and enter burners, provoking catastrophic flash fires.
          </P>
        </div>

        <div>
          <H3 className="text-base">
            4. Disengage Cylinder Regulator When Not in Use
          </H3>
          <P color="gray" className="mt-2">
            Do not rely exclusively on the stove knob. Turn off the main cylinder regulator switch every night before sleeping and prior to departing the residence.
          </P>
        </div>

        {/* Emergency Alert Box */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <span className="font-bold">⚠️ Critical Emergency Protocol:</span> If you detect distinct ethyl mercaptan odor, DO NOT operate any electrical switches, exhaust fans, or open flames. Immediately turn off the cylinder valve, evacuate all occupants to open air, and dial the 24/7 National Emergency Hotline <strong>16137</strong>.
        </div>
      </div>

      {/* Subscriber Comments Section */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <H3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              SUBSCRIBER COMMENTS
            </H3>
            <span className="text-[11px] text-slate-400">
              (Verified members only)
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>0 Comments</span>
            <span>•</span>
            <span>Sort by: Newest</span>
          </div>
        </div>

        {/* Login Prompt Box */}
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <P size="xs" color="gray" weight="medium" className="mb-3">
            Please log in with your registered account to participate in the safety discussion.
          </P>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            Login to Account
          </Link>
        </div>
      </div>
    </article>
  );
}
