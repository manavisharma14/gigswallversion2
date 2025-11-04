interface RazorpayOptions {
    key: string;
    order_id: string;
    name?: string;
    description?: string;
    image?: string;
    handler: (response: RazorpayVerifyResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
    modal?: {
      ondismiss?: () => void;
    };
  }
  
  interface RazorpayInstance {
    open: () => void;
  }
  
  declare global {
    interface Window {
      Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
  }
  
  export {};