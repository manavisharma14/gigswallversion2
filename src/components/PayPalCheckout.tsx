"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    paypal: {
      Buttons: (options: {
        createOrder: (
          data: Record<string, unknown>,
          actions: {
            order: {
              create: (input: {
                purchase_units: { amount: { value: string } }[];
              }) => Promise<string> | string;
            };
          }
        ) => Promise<string> | string;

        onApprove: (
          data: Record<string, unknown>,
          actions: {
            order: {
              capture: () => Promise<{
                payer: {
                  name: {
                    given_name: string;
                  };
                };
              }>;
            };
          }
        ) => void;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

export default function PayPalCheckout() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.paypal) {
        clearInterval(interval);

        window.paypal
          .Buttons({
            createOrder: (_data, actions) =>
              actions.order.create({
                purchase_units: [{ amount: { value: "10.00" } }],
              }),

            onApprove: (_data, actions) =>
              actions.order.capture().then((details) => {
                alert("Payment completed by " + details.payer.name.given_name);
              }),
          })
          .render("#paypal-button-container");
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=AXMm_fFniPMgS60pnPv0emObY4zy6dSfDQXUGnIc-LxTzb3GzqInGoQucMtrioN_0hT8DdNtAMfxcn4x`}
        strategy="afterInteractive"
      />
      <div id="paypal-button-container" />
    </>
  );
}