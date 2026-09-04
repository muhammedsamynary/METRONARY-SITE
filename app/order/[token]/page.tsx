import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrismaClient } from "@/lib/db/prisma";
import { formatCurrency } from "@/lib/cart/cart-utils";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";

export const metadata: Metadata = {
  title: "Order Confirmation | METRONARY",
  description: "Official confirmation and receipt for your METRONARY Cash on Delivery order.",
};

interface OrderConfirmationPageProps {
  params: Promise<{ token: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { token } = await params;

  if (!token || typeof token !== "string" || token.trim().length === 0) {
    notFound();
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { confirmationToken: token.trim() },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const subtotalFormatted = formatCurrency(order.subtotalMinor / 100);
  const deliveryFormatted =
    order.deliveryFeeMinor > 0 ? formatCurrency(order.deliveryFeeMinor / 100) : "0 EGP";
  const totalFormatted = formatCurrency(order.totalMinor / 100);

  return (
    <MetronaryBackground>
      <div className="w-full max-w-[840px] mx-auto px-4 sm:px-8 pt-24 sm:pt-28 pb-20">
        {/* ── Breadcrumb ── */}
        <div className="mb-6 flex items-center gap-2 text-[10px] font-mono tracking-[0.24em] uppercase text-[rgba(245,244,238,0.4)]">
          <Link href="/" className="hover:text-[var(--m-gold)] transition-colors">
            SHOP
          </Link>
          <span>/</span>
          <span className="text-[var(--m-gold)]">CONFIRMATION</span>
        </div>

        {/* ── Main Confirmation Card ── */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[rgba(17,14,9,0.78)] backdrop-blur-2xl border border-[rgba(245,244,238,0.14)] shadow-[0_24px_56px_rgba(0,0,0,0.7)] flex flex-col gap-8 animate-fadeIn">
          {/* ── Status Header ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(245,244,238,0.1)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(251,133,0,0.12)] border border-[rgba(251,133,0,0.3)] flex items-center justify-center text-[var(--m-gold)] shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[var(--m-gold)] uppercase font-semibold">
                  ORDER RECEIVED
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-[0.16em] uppercase text-[var(--m-cream)]">
                  ORDER CONFIRMED
                </h1>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-0.5 pl-16 sm:pl-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.5)]">
                REFERENCE NUMBER
              </span>
              <span className="text-sm font-mono font-bold tracking-[0.16em] text-[var(--m-gold)] select-all">
                {order.orderNumber}
              </span>
            </div>
          </div>

          {/* ── Key Metadata Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[rgba(245,244,238,0.03)] border border-[rgba(245,244,238,0.08)]">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[rgba(245,244,238,0.45)]">
                PAYMENT METHOD
              </span>
              <span className="text-xs font-mono font-bold text-[var(--m-cream)]">
                CASH ON DELIVERY
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[rgba(245,244,238,0.45)]">
                DESTINATION AREA
              </span>
              <span className="text-xs font-mono font-bold text-[var(--m-cream)] truncate">
                {order.cityOrArea}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[rgba(245,244,238,0.45)]">
                ORDER STATUS
              </span>
              <span className="text-xs font-mono font-bold text-[var(--m-gold)]">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* ── Items Breakdown ── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[rgba(245,244,238,0.6)]">
              PURCHASED ITEMS ({order.items.reduce((acc, curr) => acc + curr.quantity, 0)})
            </h2>

            <div className="flex flex-col divide-y divide-[rgba(245,244,238,0.06)] rounded-2xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.06)] px-4">
              {order.items.map((item) => {
                const lineTotalFormatted = formatCurrency(
                  (item.unitPriceMinor * item.quantity) / 100
                );

                return (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 text-xs font-mono"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[var(--m-cream)] tracking-wider uppercase">
                        {item.productName}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-[rgba(245,244,238,0.5)]">
                        {item.size && (
                          <>
                            <span>SIZE: {item.size}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>QTY: {item.quantity}</span>
                      </div>
                    </div>

                    <span className="font-bold text-[var(--m-cream)] shrink-0">
                      {lineTotalFormatted}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Financial Breakdown ── */}
          <div className="pt-2 border-t border-[rgba(245,244,238,0.08)] flex flex-col gap-2 font-mono uppercase text-xs tracking-wider">
            <div className="flex items-center justify-between">
              <span className="text-[rgba(245,244,238,0.55)]">SUBTOTAL</span>
              <span className="text-[var(--m-cream)]">{subtotalFormatted}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[rgba(245,244,238,0.55)]">DELIVERY</span>
              <span className="text-[var(--m-cream)]">{deliveryFormatted}</span>
            </div>

            <div className="pt-3 border-t border-[rgba(245,244,238,0.08)] flex items-center justify-between text-sm font-bold">
              <span className="text-[var(--m-cream)]">TOTAL TO PAY (COD)</span>
              <span className="text-[var(--m-gold)]">{totalFormatted}</span>
            </div>
          </div>

          {/* ── Notice & Return Link ── */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[rgba(245,244,238,0.08)]">
            <p className="text-[11px] font-mono text-[rgba(245,244,238,0.5)] text-center sm:text-left">
              Please prepare the exact cash amount upon package delivery.
            </p>

            <Link
              href="/"
              className="py-3 px-6 rounded-xl bg-[var(--m-gold)] text-[var(--m-dark)] text-[10px] tracking-[0.24em] font-bold uppercase shadow-[0_4px_20px_rgba(251,133,0,0.35)] hover:bg-[var(--m-yellow)] transition-all hover:scale-[1.01] active:scale-[0.99] text-center shrink-0"
            >
              RETURN TO SHOP
            </Link>
          </div>
        </div>
      </div>
    </MetronaryBackground>
  );
}
