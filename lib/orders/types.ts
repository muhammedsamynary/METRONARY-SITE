import type {
  CheckoutCartItemInput,
  CustomerDetailsInput,
  CheckoutValidationError,
} from "@/lib/checkout/types";

export interface CreateOrderInput {
  customer: CustomerDetailsInput;
  items: CheckoutCartItemInput[];
}

export interface CreateOrderSuccessResult {
  success: true;
  orderNumber: string;
  confirmationToken: string;
  orderId: string;
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  currency: string;
}

export interface CreateOrderFailureResult {
  success: false;
  errors: CheckoutValidationError[];
}

export type CreateOrderResult = CreateOrderSuccessResult | CreateOrderFailureResult;

export interface DeliveryFeeResolution {
  configured: boolean;
  deliveryFeeMinor: number | null;
  currency: string;
  error?: string;
}
