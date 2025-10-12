export const dynamic = 'force-static';
export default function TermsPage() {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 mt-20">
        <h1 className="text-3xl font-bold text-[#4B3BB3] mb-6">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">
          Welcome to GigsWall. By creating an account and using our platform, you agree to the
          following Terms & Conditions. Please read them carefully before signing up.
        </p>
  
        <h2 className="text-xl font-semibold text-[#4B3BB3] mt-6 mb-2">1. Eligibility</h2>
        <p className="text-gray-700 mb-4">
          You must be at least 16 years old and a verified student or individual to use the platform. 
          By registering, you confirm that the information you provide is accurate.
        </p>
  
        <h2 className="text-xl font-semibold text-[#4B3BB3] mt-6 mb-2">2. User Conduct</h2>
        <p className="text-gray-700 mb-4">
          Users are expected to respect each other, avoid fraudulent activity, and not use GigsWall 
          for illegal or harmful purposes. Any abuse may result in account suspension or termination.
        </p>
  
        <h2 className="text-xl font-semibold text-[#4B3BB3] mt-6 mb-2">3. Payments</h2>
        <p className="text-gray-700 mb-4">
        All payments for gigs must be made through GigsWall’s platform. Clients (those posting gigs) agree to submit payment to GigsWall before the commencement of work. Once the gig is completed and confirmed by the client, GigsWall will release the payment to the student (the service provider), minus any applicable service fees.
        </p>
  
        <h2 className="text-xl font-semibold text-[#4B3BB3] mt-6 mb-2">4. Liability</h2>
        <p className="text-gray-700 mb-4">
        GigsWall is a facilitator of connections between students and clients. While we provide the platform for posting and accepting gigs, we do not guarantee the quality, safety, or completion of any work. Users are solely responsible for their interactions and agreements.
        </p>
  
        <h2 className="text-xl font-semibold text-[#4B3BB3] mt-6 mb-2">5. Changes</h2>
        <p className="text-gray-700 mb-4">
          These Terms & Conditions may be updated from time to time. Continued use of the platform 
          constitutes acceptance of the updated terms.
        </p>
  
        <p className="text-gray-700 mt-8">
          If you have any questions about these terms, please contact us at 
          <span className="font-semibold"> info@gigswall.com</span>.
        </p>
      </div>
    );
  }