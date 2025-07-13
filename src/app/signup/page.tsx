import AuthSlider from "@/components/auth/AuthSlider";

export const metadata = {
  title: "Sign Up | GigsWall",
  description: "Create an account on GigsWall and join the student gig network.",
};

export default function SignUpPage() {
  return <AuthSlider defaultLoginMode={false} />;
}
