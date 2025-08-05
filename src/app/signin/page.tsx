export const dynamic = "force-dynamic";
import AuthSlider from "@/components/auth/AuthSlider";

export const metadata = {
  title: "Sign In | GigsWall",
  description: "Login to GigsWall and manage your student gigs.",
};

export default function SignInPage() {
  return <AuthSlider defaultLoginMode={true} />;
}
