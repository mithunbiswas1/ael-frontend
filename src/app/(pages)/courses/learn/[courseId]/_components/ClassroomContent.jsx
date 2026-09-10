"use client";

import { useState } from "react";
import { toast } from "sonner";
import ClassroomHeader from "./ClassroomHeader";
import ClassroomVideoPlayer from "./ClassroomVideoPlayer";
import ClassroomPlaylistSidebar from "./ClassroomPlaylistSidebar";

export const MOCK_LESSONS = [
  {
    id: 1,
    title: "1. Physical Properties & Hazardous Nature of LPG",
    duration: "10:15",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    description:
      "Understanding propane-butane vapor pressure, flammability limits (1.8% to 9.5% in air), and why LPG sinks to the ground because it is heavier than air.",
    notes:
      "Key Rule: Because LPG vapor is roughly 1.5 to 2.0 times denser than air, leaking gas pools in ground depressions, drains, and kitchen floor corners. Adequate low-level ventilation is mandatory.",
  },
  {
    id: 2,
    title: "2. Understanding Cylinder Construction, Tare Weight & Valves",
    duration: "12:40",
    description:
      "Anatomy of standard 12kg and 35kg welded steel cylinders, brass foot rings, shroud rings, and identifying statutory test validity dates.",
    notes:
      "All cylinders must bear an embossed statutory hydro-test stamp (e.g., 'Q3 2026'). Never accept a cylinder with a dented body or chipped valve threads.",
  },
  {
    id: 3,
    title: "3. Step-by-Step Regulator Connection Protocol",
    duration: "14:20",
    description:
      "How to inspect the O-ring gasket, depress the safety collar, and firmly engage the click-on regulator without mechanical cross-threading.",
    notes:
      "Listen for the distinctive mechanical 'click' when locking the regulator collar. Gently pull upward on the regulator body to confirm positive locking before turning the valve lever ON.",
  },
  {
    id: 4,
    title: "4. Conducting the 2-Minute Soap Water Leak Test",
    duration: "11:50",
    description:
      "Practical demonstration using non-corrosive soapy water to detect micro-fissures around the valve spindle, regulator neck, and clamp points.",
    notes:
      "NEVER use an open flame, matchstick, or lighter to check for gas leaks! Always use liquid dishwashing soap mixed with water and a soft sponge.",
  },
  {
    id: 5,
    title: "5. Safe Kitchen Ventilation & Distance Clearances",
    duration: "13:10",
    description:
      "Positioning requirements: maintaining 1 meter distance from cooktops, keeping cylinders strictly upright, and avoiding underground pit storage.",
    notes:
      "Keep LPG cylinders at least 1 meter away from heat sources and electrical outlets. Never store spare cylinders inside enclosed cabinets without floor-level louvers.",
  },
  {
    id: 6,
    title: "6. Emergency Action Sequence: Gas Leakage Response",
    duration: "15:00",
    description:
      "Immediate action sequence: shut off the regulator valve, open all doors and windows, and DO NOT touch electrical switches or ring doorbells.",
    notes:
      "If you smell gas: 1. Turn regulator OFF. 2. Open all doors & windows. 3. Do not turn ON or OFF any electrical switch. 4. Evacuate premises and call emergency hotline 16137 from outside.",
  },
];

export default function ClassroomContent({ courseId }) {
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState([1]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");

  const currentLesson = MOCK_LESSONS[currentLessonIdx];
  const progressPercent = Math.round(
    (completedLessonIds.length / MOCK_LESSONS.length) * 100
  );

  const handleNextLesson = () => {
    if (!completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    }

    if (currentLessonIdx < MOCK_LESSONS.length - 1) {
      setCurrentLessonIdx((prev) => prev + 1);
      toast.success("Progress saved. Starting next lesson!");
    } else {
      toast.success("Congratulations! All video lessons completed. You can now take the final assessment quiz!");
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* 1. Classroom Top Navigation Bar */}
      <ClassroomHeader
        courseId={courseId}
        currentLessonIdx={currentLessonIdx}
        totalLessons={MOCK_LESSONS.length}
        progressPercent={progressPercent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 2. Main Classroom Body (Video Player + Sidebar) */}
      <div className="flex flex-1 overflow-hidden">
        <ClassroomVideoPlayer
          currentLesson={currentLesson}
          currentLessonIdx={currentLessonIdx}
          totalLessons={MOCK_LESSONS.length}
          completedLessonIds={completedLessonIds}
          setCompletedLessonIds={setCompletedLessonIds}
          handlePrevLesson={handlePrevLesson}
          handleNextLesson={handleNextLesson}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <ClassroomPlaylistSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          lessons={MOCK_LESSONS}
          currentLessonIdx={currentLessonIdx}
          setCurrentLessonIdx={setCurrentLessonIdx}
          completedLessonIds={completedLessonIds}
          courseId={courseId}
        />
      </div>
    </div>
  );
}
