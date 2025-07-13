"use client";

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

const roles = [
  { label: "Looking & Posting", value: "both" },
  { label: "Looking for Gigs", value: "finder" },
  { label: "Posting Gigs", value: "poster" },
];

const colleges = ["MIT Manipal", "MIT Bangalore", "Others"];

export default function SignupStepTwo({ formData, handleChange }: any) {
  const selectedRole = roles.find((r) => r.value === formData.role) || roles[0];

  const handleRoleChange = (role: any) => {
    handleChange({ target: { name: "role", value: role.value } });
  };

  const handleCollegeChange = (college: string) => {
    handleChange({ target: { name: "college", value: college } });
  };

  return (
    <>
      <input
        type="text"
        name="department"
        placeholder="Department"
        className="input w-full text-[#1a1a1a]"
        value={formData.department}
        onChange={handleChange}
      />
      <input
        type="text"
        name="gradYear"
        placeholder="Graduation Year"
        className="input w-full text-[#1a1a1a]"
        value={formData.gradYear}
        onChange={handleChange}
      />
      <input
        type="text"
        name="aim"
        placeholder="Your Aim"
        className="input w-full text-[#1a1a1a]"
        value={formData.aim}
        onChange={handleChange}
      />
      <input
        type="text"
        name="skills"
        placeholder="Skills you're interested in"
        className="input w-full text-[#1a1a1a]"
        value={formData.skills}
        onChange={handleChange}
      />
      <textarea
        name="bio"
        placeholder="Short bio (optional)"
        className="input w-full text-[#1a1a1a]"
        value={formData.bio}
        onChange={handleChange}
      />

      {/* Role Dropdown */}
      <div className="w-full mt-2 text-[#1a1a1a]">
        <Listbox value={selectedRole} onChange={handleRoleChange}>
          <div className="relative">
            <Listbox.Button className="w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-[#1a1a1a] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] sm:text-sm">
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
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                      active ? "bg-[#EEF0FF] text-[#4B3BB3]" : "text-[#1a1a1a]"
                    }`
                  }
                >
                  {role.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* College Dropdown */}
      <div className="w-full mt-2 text-[#1a1a1a]">
        <Listbox value={formData.college} onChange={handleCollegeChange}>
          <div className="relative">
            <Listbox.Button className="w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-[#1a1a1a] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] sm:text-sm">
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
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                      active ? "bg-[#EEF0FF] text-[#4B3BB3]" : "text-[#1a1a1a]"
                    }`
                  }
                >
                  {college}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Conditional "Other College" input */}
      {formData.college === "Others" && (
        <input
          type="text"
          name="otherCollege"
          placeholder="Enter your college name"
          className="input w-full mt-2 text-[#1a1a1a]"
          value={formData.otherCollege}
          onChange={handleChange}
          required
        />
      )}
    </>
  );
}
