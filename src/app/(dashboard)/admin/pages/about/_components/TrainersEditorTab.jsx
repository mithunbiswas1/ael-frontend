// src/app/(dashboard)/admin/pages/about/_components/TrainersEditorTab.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { H3, H4, P } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";
import { useUploadPageImageMutation } from "@/redux/api/pageApi";

export default function TrainersEditorTab({
  data = {},
  onChange = () => { },
}) {
  const [previewLang, setPreviewLang] = useState("en");
  const [uploadImage, { isLoading: isUploading }] = useUploadPageImageMutation();
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const isBn = previewLang === "bn";

  const trainersList = data?.trainers || [];

  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateTrainer = (index, field, value) => {
    const updated = [...trainersList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...data,
      trainers: updated,
    });
  };

  const addTrainer = () => {
    const updated = [
      ...trainersList,
      {
        name: "",
        nameBn: "",
        role: "",
        roleBn: "",
        bio: "",
        bioBn: "",
        imageUrl: "",
      },
    ];
    onChange({
      ...data,
      trainers: updated,
    });
    toast.success("Added new trainer card");
  };

  const removeTrainer = (index) => {
    const updated = trainersList.filter((_, i) => i !== index);
    onChange({
      ...data,
      trainers: updated,
    });
    toast.success("Trainer card removed");
  };

  const handleImageUpload = async (index, files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please drop a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await uploadImage(formData).unwrap();
      const uploadedItem = Array.isArray(response?.data)
        ? response.data[0]
        : response?.data;
      const uploadedUrl =
        uploadedItem?.image || uploadedItem?.url || (typeof uploadedItem === "string" ? uploadedItem : null);

      if (uploadedUrl) {
        updateTrainer(index, "imageUrl", uploadedUrl);
        toast.success("Trainer photo uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingIndex(null);
    }
  };

  // Preview values - strictly dynamic
  const displayedTag = isBn ? data?.tagBn : data?.tag;
  const displayedTitle = isBn ? data?.titleBn : data?.title;
  const displayedSubtitle = isBn ? data?.subtitleBn : data?.subtitle;

  const hasHeader = displayedTag || displayedTitle || displayedSubtitle;
  const hasContent = hasHeader || trainersList.length > 0;

  return (
    <div className="space-y-8">
      {/* 1. Real-Time Front-Panel Matched Live Storefront Preview */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Front Panel Storefront Preview (Expert Trainers)
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">
              Real-time Sync
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Preview Language:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLang("en")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLang === "en"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                English
              </Button>
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLang("bn")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLang === "bn"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                বাংলা
              </Button>
            </div>
          </div>
        </div>

        {/* Live Storefront Component Preview Container */}
        <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-6 sm:p-10 shadow-xs">
          {!hasContent ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No trainer profiles configured yet.</p>
              <p className="text-xs text-slate-400 mt-1">Add trainers using the button below to preview.</p>
            </div>
          ) : (
            <>
              {hasHeader && (
                <SectionHeader
                  align="center"
                  tag={displayedTag || ""}
                  title={displayedTitle || ""}
                  subtitle={displayedSubtitle || ""}
                />
              )}

              {trainersList.length > 0 && (
                <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${hasHeader ? "mt-8" : ""}`}>
                  {trainersList.map((trainer, idx) => {
                    const name = (isBn ? trainer.nameBn : trainer.name) || trainer.name;
                    const role = (isBn ? trainer.roleBn : trainer.role) || trainer.role;
                    const bio = (isBn ? trainer.bioBn : trainer.bio) || trainer.bio;
                    const imageSrc = trainer.imageUrl;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200"
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={name || "Trainer"}
                              fill
                              unoptimized
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300 text-xs font-semibold">
                              No Photo
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-3.5 text-center">
                          {name && (
                            <H4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                              {name}
                            </H4>
                          )}
                          {role && (
                            <span className="mt-0.5 text-[10px] font-bold text-primary">
                              {role}
                            </span>
                          )}
                          {bio && (
                            <P color="muted" size="xs" className="mt-2 leading-relaxed line-clamp-3">
                              {bio}
                            </P>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. Form Configuration */}
      <div className="space-y-6">
        {/* Step 1: Section Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              1
            </span>
            <div>
              <H3 className="text-sm font-bold text-slate-900">Section Header & Subtitle</H3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tag (Small Upper Label)"
              value={data?.tag || ""}
              onChange={(e) => updateField("tag", e.target.value)}
              placeholder="e.g. CONSULTATION POOL"
            />
            <Input
              label="ট্যাগ (বাংলা)"
              value={data?.tagBn || ""}
              onChange={(e) => updateField("tagBn", e.target.value)}
              placeholder="যেমন: পরামর্শক প্যানেল"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Main Title"
              value={data?.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. EXPERT TRAINERS"
            />
            <Input
              label="প্রধান শিরোনাম (বাংলা)"
              value={data?.titleBn || ""}
              onChange={(e) => updateField("titleBn", e.target.value)}
              placeholder="যেমন: প্রশিক্ষকবৃন্দ"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Section Subtitle"
              rows={2}
              value={data?.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Enter section subtitle..."
            />
            <Textarea
              label="সেকশন সাবটাইটেল (বাংলা)"
              rows={2}
              value={data?.subtitleBn || ""}
              onChange={(e) => updateField("subtitleBn", e.target.value)}
              placeholder="বাংলা সাবটাইটেল লিখুন..."
            />
          </div>
        </div>

        {/* Step 2: Trainers Cards Management */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                2
              </span>
              <div>
                <H3 className="text-sm font-bold text-slate-900">Trainer Faculty Profiles ({trainersList.length})</H3>
              </div>
            </div>

            <Button
              type="button"
              onClick={addTrainer}
              size="sm"
              className="gap-1.5 cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add Trainer</span>
            </Button>
          </div>

          {trainersList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500">No trainer profiles added yet.</p>
              <Button
                type="button"
                onClick={addTrainer}
                variant="outline"
                size="xs"
                className="mt-2.5 cursor-pointer"
              >
                <Plus className="h-3 w-3 mr-1" /> Add First Trainer Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {trainersList.map((trainer, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {trainer.name || `Trainer ${idx + 1}`}
                      </span>
                    </div>

                    <Button
                      type="button"
                      onClick={() => removeTrainer(idx)}
                      variant="ghost"
                      size="xs"
                      className="text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      title="Remove trainer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="ml-1 text-xs">Remove</span>
                    </Button>
                  </div>

                  {/* Photo Upload & Preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Trainer Photo
                    </span>

                    {trainer.imageUrl ? (
                      <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3">
                        <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={trainer.imageUrl}
                            alt={trainer.name || "Trainer"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">
                            {trainer.imageUrl}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Click change to replace photo
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => updateTrainer(idx, "imageUrl", "")}
                          variant="ghost"
                          size="xs"
                          className="text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="ml-1">Change</span>
                        </Button>
                      </div>
                    ) : (
                      <DragDropUploadZone
                        onFilesSelected={(files) => handleImageUpload(idx, files)}
                        isUploading={uploadingIndex === idx}
                        multiple={false}
                        title={
                          <>
                            Drop trainer portrait, or <span className="text-primary underline">browse</span>
                          </>
                        }
                        subtitle="Aspect ratio 1:1 recommended (PNG, JPG, WEBP)"
                        uploadingText="Uploading photo..."
                      />
                    )}
                  </div>

                  {/* Name & Role Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Trainer Name"
                      value={trainer.name || ""}
                      onChange={(e) => updateTrainer(idx, "name", e.target.value)}
                      placeholder="e.g. Engr. Md. Shafiqul Islam"
                    />
                    <Input
                      label="প্রশিক্ষকের নাম (বাংলা)"
                      value={trainer.nameBn || ""}
                      onChange={(e) => updateTrainer(idx, "nameBn", e.target.value)}
                      placeholder="যেমন: ইঞ্জি. মোঃ শফিকুল ইসলাম"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Role / Designation"
                      value={trainer.role || ""}
                      onChange={(e) => updateTrainer(idx, "role", e.target.value)}
                      placeholder="e.g. Safety & Risk Management"
                    />
                    <Input
                      label="পদবি / বিশেষজ্ঞ ক্ষেত্র (বাংলা)"
                      value={trainer.roleBn || ""}
                      onChange={(e) => updateTrainer(idx, "roleBn", e.target.value)}
                      placeholder="যেমন: নিরাপত্তা ও ঝুঁকি ব্যবস্থাপনা"
                    />
                  </div>

                  {/* Bio Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Textarea
                      label="Short Biography / Credentials"
                      rows={2}
                      value={trainer.bio || ""}
                      onChange={(e) => updateTrainer(idx, "bio", e.target.value)}
                      placeholder="Enter short biography..."
                    />
                    <Textarea
                      label="সংক্ষিপ্ত জীবনী / পরিচিতি (বাংলা)"
                      rows={2}
                      value={trainer.bioBn || ""}
                      onChange={(e) => updateTrainer(idx, "bioBn", e.target.value)}
                      placeholder="বাংলা পরিচিতি লিখুন..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
