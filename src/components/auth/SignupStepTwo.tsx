/* eslint-disable */

'use client';

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface RoleOption {
  label: string;
  value: string;
}

interface SignupStepTwoProps {
  formData: {
    department: string;
    gradYear: string;
    aim: string;
    skills: string;
    bio: string;
    role: string;
    college: string;
    otherCollege?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const roles: RoleOption[] = [
  { label: "Looking & Posting", value: "both" },
  { label: "Looking for Gigs", value: "finder" },
  { label: "Posting Gigs", value: "poster" },
];

const colleges = ["MIT Manipal", "MIT Bangalore", "Others"];

const inputClass =
  "w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] text-[#4B3BB3] placeholder-gray-400 bg-white";

const dropdownBtnClass =
  "w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-[#4B3BB3] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] sm:text-sm";

const dropdownOptionClass = (active: boolean) =>
  `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
    active ? "bg-[#EEF0FF] text-[#4B3BB3]" : "text-[#1a1a1a]"
  }`;

export default function SignupStepTwo({
  formData,
  handleChange,
  setFormData,
}: SignupStepTwoProps) {
  const selectedRole = roles.find((r) => r.value === formData.role) || roles[0];

  const handleRoleChange = (role: RoleOption) => {
    setFormData((prev: any) => ({
      ...prev,
      role: role.value,
    }));
  };

  const handleCollegeChange = (college: string) => {
    setFormData((prev: any) => ({
      ...prev,
      college,
      ...(college !== "Others" ? { otherCollege: "" } : {}),
    }));
  };

  return (
    <div className="space-y-4 text-[#1a1a1a]">
      <input
        type="text"
        name="department"
        placeholder="Department"
        className={inputClass}
        value={formData.department}
        onChange={handleChange}
      />

      <input
        type="text"
        name="gradYear"
        placeholder="Graduation Year"
        className={inputClass}
        value={formData.gradYear}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Short bio (optional)"
        className={inputClass}
        value={formData.bio}
        onChange={handleChange}
        rows={3}
      />

      {/* Role Dropdown */}
      <div className="w-full">
        <Listbox value={selectedRole} onChange={handleRoleChange}>
          <div className="relative">
            <Listbox.Button className={dropdownBtnClass}>
              {selectedRole.label}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon className="h-5 w-5 text-[#4B3BB3]" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
              {roles.map((role, idx) => (
                <Listbox.Option
                  key={idx}
                  value={role}
                  className={({ active }) => dropdownOptionClass(active)}
                >
                  {role.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* College Dropdown */}
      <div className="w-full">
        <Listbox value={formData.college} onChange={handleCollegeChange}>
          <div className="relative">
            <Listbox.Button className={dropdownBtnClass}>
              {formData.college || "Select College"}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon className="h-5 w-5 text-[#4B3BB3]" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
              {colleges.map((college, idx) => (
                <Listbox.Option
                  key={idx}
                  value={college}
                  className={({ active }) => dropdownOptionClass(active)}
                >
                  {college}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {formData.college === "Others" && (
        <input
          type="text"
          name="otherCollege"
          placeholder="Enter your college name"
          className={`${inputClass} mt-2`}
          value={formData.otherCollege || ""}
          onChange={handleChange}
          required
        />
      )}
    </div>
  );
}
