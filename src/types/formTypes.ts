export type FormDataType = {
    name: string;
    email: string;
    password: string;
    phone: string;
    department: string;
    gradYear: string;
    gigPreference: string;
    college: string;
    otherCollege?: string;
    type: "student" | "other";
  };