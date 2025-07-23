import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = {
  formData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const inputClass =
  'w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] text-[#4B3BB3] placeholder-gray-400 bg-white';

const iconClass =
  'absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]';

const toggleIconClass =
  'absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3] cursor-pointer';

export default function NotStudentSignup({ formData, handleChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="space-y-4">
      {/* Email Field */}
      <div className="relative">
        <Mail className={iconClass} size={20} />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email"
          type="email"
          className={inputClass}
        />
      </div>

      {/* Password Field with toggle */}
      <div className="relative">
        <Lock className={iconClass} size={20} />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          className={inputClass}
        />
        {showPassword ? (
          <EyeOff className={toggleIconClass} size={20} onClick={togglePassword} />
        ) : (
          <Eye className={toggleIconClass} size={20} onClick={togglePassword} />
        )}
      </div>
    </div>
  );
}
