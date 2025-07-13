import { Mail, Lock, Phone, User } from "lucide-react";

const inputClass =
  "w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] text-[#4B3BB3] placeholder-gray-400 bg-white";

const iconClass =
  "absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]";

export default function SignupStepOne({ formData, handleChange }: any) {
  return (
    <>
      <div className="relative mb-4">
        <User className={iconClass} size={20} />
        <input
          type="text"
          name="name"
          placeholder="Name"
          className={inputClass}
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="relative mb-4">
        <Mail className={iconClass} size={20} />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={inputClass}
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="relative mb-4">
        <Lock className={iconClass} size={20} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={inputClass}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="relative mb-4">
        <Phone className={iconClass} size={20} />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className={inputClass}
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );
}
