import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaTimes,
  FaSave,
  FaBriefcase,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaLink,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H4, P } from "@/components/ui/Typography";

export default function ProfileForm({
  formData,
  handleInputChange,
  handleUpdateProfile,
  handleCancelEdit,
  isEditing,
  isUpdatingProfile,
  isBn,
}) {
  return (
    <form id="profileForm" onSubmit={handleUpdateProfile} className="space-y-6">
      {/* Section 1: Personal Details */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FaUser className="h-3.5 w-3.5" />
          </div>
          <div>
            <H4 className="text-sm font-bold text-slate-900">
              {isBn ? "ব্যক্তিগত ও পেশাগত তথ্য" : "Personal & Professional Information"}
            </H4>
            <P className="text-xs text-slate-500">
              {isBn
                ? "আপনার নাম, পেশাগত পদবি ও পরিচিতি বিবরণ"
                : "Your personal details, professional designation, and author bio"}
            </P>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isBn ? "পূর্ণ নাম" : "Full Name"}
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            placeholder={isBn ? "আপনার পূর্ণ নাম" : "Enter your full name"}
          />

          <Input
            label={isBn ? "ব্যবহারকারী নাম" : "Username"}
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            placeholder="username"
          />

          <div className="sm:col-span-2">
            <Input
              label={isBn ? "পেশাগত পদবি / পরিচিতি" : "Professional Designation / Headline"}
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder={
                isBn
                  ? "যেমন: সিনিয়র এলপিজি সেফটি রিসার্চার ও টেকনিক্যাল স্পেশালিস্ট"
                  : "e.g. Senior LPG Safety Researcher & Technical Specialist"
              }
              prefix={<FaBriefcase className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="sm:col-span-2">
            <Textarea
              label={isBn ? "সংক্ষিপ্ত পরিচিতি ও বায়ো (Author Bio / Description)" : "Author Bio & Description"}
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              placeholder={
                isBn
                  ? "আপনার পেশাগত অভিজ্ঞতা, দক্ষতা বা গবেষণার সংক্ষিপ্ত পরিচিতি..."
                  : "Brief professional background, expertise, or research focus..."
              }
            />
          </div>
        </div>
      </div>

      {/* Section 2: Contact Details */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FaEnvelope className="h-3.5 w-3.5" />
          </div>
          <div>
            <H4 className="text-sm font-bold text-slate-900">
              {isBn ? "যোগাযোগের বিবরণ" : "Contact Information"}
            </H4>
            <P className="text-xs text-slate-500">
              {isBn
                ? "বিজ্ঞপ্তি ও যোগাযোগের তথ্য"
                : "Direct contact and communication details"}
            </P>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isBn ? "ইমেইল ঠিকানা" : "Email Address"}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="name@example.com"
            prefix={<FaEnvelope className="h-3.5 w-3.5" />}
          />

          <Input
            label={isBn ? "মোবাইল নম্বর" : "Mobile Phone"}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            placeholder="+8801XXXXXXXXX"
            prefix={<FaPhone className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Section 3: Address & Location */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FaMapMarkerAlt className="h-3.5 w-3.5" />
          </div>
          <div>
            <H4 className="text-sm font-bold text-slate-900">
              {isBn ? "ঠিকানা ও অবস্থান" : "Address & Location"}
            </H4>
            <P className="text-xs text-slate-500">
              {isBn
                ? "আপনার বর্তমান ঠিকানা ও পোস্টাল বিবরণ"
                : "Your residential or commercial address details"}
            </P>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label={isBn ? "ঠিকানা" : "Street Address"}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder={
                isBn
                  ? "বাড়ি, সড়ক, এলাকা..."
                  : "House, Street, Area..."
              }
            />
          </div>

          <Input
            label={isBn ? "শহর" : "City"}
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={isBn ? "যেমন: ঢাকা" : "e.g. Dhaka"}
          />

          <Input
            label={isBn ? "জেলা" : "District"}
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={isBn ? "যেমন: ঢাকা" : "e.g. Dhaka"}
          />

          <Input
            label={isBn ? "বিভাগ" : "Division / State"}
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={isBn ? "যেমন: ঢাকা বিভাগ" : "e.g. Dhaka Division"}
          />

          <Input
            label={isBn ? "পোস্টাল কোড" : "Postal Code"}
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="1205"
          />

          <div className="sm:col-span-2">
            <Input
              label={isBn ? "দেশ" : "Country"}
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Bangladesh"
              prefix={<FaGlobe className="h-3.5 w-3.5" />}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Author & Social Profiles */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FaLink className="h-3.5 w-3.5" />
          </div>
          <div>
            <H4 className="text-sm font-bold text-slate-900">
              {isBn ? "লেখক প্রোফাইল ও সোশ্যাল লিংক" : "Author Profile & Social Links"}
            </H4>
            <P className="text-xs text-slate-500">
              {isBn
                ? "ওয়েবসাইট, লিঙ্কডইন ও সোশ্যাল মিডিয়ার লিংক যা আপনার লেখক পেজে প্রদর্শিত হবে"
                : "Personal website, LinkedIn, and social profiles shown on your public author page"}
            </P>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isBn ? "ওয়েবসাইট / পোর্টফোলিও" : "Website / Portfolio URL"}
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="https://example.com"
            prefix={<FaGlobe className="h-3.5 w-3.5" />}
          />

          <Input
            label={isBn ? "লিঙ্কডইন প্রোফাইল" : "LinkedIn Profile URL"}
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="https://linkedin.com/in/username"
            prefix={<FaLinkedin className="h-3.5 w-3.5" />}
          />

          <Input
            label={isBn ? "টুইটার / এক্স প্রোফাইল" : "Twitter / X Profile URL"}
            name="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="https://x.com/username"
            prefix={<FaTwitter className="h-3.5 w-3.5" />}
          />

          <Input
            label={isBn ? "ফেসবুক প্রোফাইল" : "Facebook Profile URL"}
            name="facebook"
            value={formData.facebook}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="https://facebook.com/username"
            prefix={<FaFacebook className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Bottom Actions when in Edit Mode */}
      {isEditing && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleCancelEdit}
            icon={FaTimes}
          >
            <span>{isBn ? "বাতিল" : "Cancel"}</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isUpdatingProfile}
            isLoading={isUpdatingProfile}
            icon={FaSave}
          >
            <span>
              {isUpdatingProfile
                ? isBn
                  ? "সংরক্ষণ হচ্ছে..."
                  : "Saving..."
                : isBn
                  ? "পরিবর্তন সংরক্ষণ করুন"
                  : "Save Changes"}
            </span>
          </Button>
        </div>
      )}
    </form>
  );
}
