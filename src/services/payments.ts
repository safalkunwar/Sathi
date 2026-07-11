export type PaymentProvider = 'khalti' | 'esewa';

export type PaymentRequest = {
  amount: number;
  currency: string;
  provider: PaymentProvider;
  companionId: string;
  bookingId: string;
  returnUrl?: string;
  webhookUrl?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
};

export type PaymentVerification = {
  success: boolean;
  transactionId?: string;
  amount?: number;
  provider: PaymentProvider;
  bookingId: string;
};

const KHALTI_SCRIPT_URL = 'https://khalti.com/api/v2/epayment/initiate/';
const ESEWA_SCRIPT_URL = 'https://rc.esewa.com.np/esepg/epi/verify?av=v2&';

export const paymentService = {
  initiatePayment: async (request: PaymentRequest): Promise<{ paymentUrl: string; token: string }> => {
    if (request.provider === 'khalti') {
      return paymentService.initiateKhalti(request);
    }
    if (request.provider === 'esewa') {
      return paymentService.initiateEsewa(request);
    }
    throw new Error('Unsupported payment provider');
  },

  initiateKhalti: async (request: PaymentRequest): Promise<{ paymentUrl: string; token: string }> => {
    const secretKey = import.meta.env.VITE_KHALTI_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Khalti secret key is not configured');
    }

    const payload = {
      return_url: request.returnUrl || `${window.location.origin}/payment/verify`,
      website_url: request.webhookUrl || window.location.origin,
      amount: request.amount,
      purchase_order_id: request.bookingId,
      purchase_order_name: `Booking with companion ${request.companionId}`,
      customer_info: request.customerInfo || {},
    };

    const response = await fetch('https://khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.detail || `Khalti payment initiation failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      paymentUrl: data.payment_url,
      token: data.pidx,
    };
  },

  initiateEsewa: async (request: PaymentRequest): Promise<{ paymentUrl: string; token: string }> => {
    const merchantId = import.meta.env.VITE_ESEWA_MERCHANT_ID;
    if (!merchantId) {
      throw new Error('eSewa merchant ID is not configured');
    }

    const amount = request.amount.toFixed(2);
    const taxAmount = '0';
    const totalAmount = amount;
    const transactionUuid = `txn-${request.bookingId}-${Date.now()}`;
    const productCode = import.meta.env.VITE_ESEWA_PRODUCT_CODE || merchantId;
    const returnUrl = request.returnUrl || `${window.location.origin}/payment/esewa-verify`;
    const failureUrl = `${window.location.origin}/payment/esewa-failure`;

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc.esewa.com.np/esepg/epi/verify?av=v2&';
    form.style.display = 'none';

    const fields: Record<string, string> = {
      amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: returnUrl,
      failure_url: failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
    };

    const secretKey = import.meta.env.VITE_ESEWA_SECRET_KEY;
    if (secretKey) {
      const signature = await generateEsewaSignature(secretKey, fields.signed_field_names, {
        total_amount,
        transaction_uuid,
        product_code,
      });
      fields.signature = signature;
    }

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    return {
      paymentUrl: form.action,
      token: transactionUuid,
    };
  },

  verifyPayment: async (_provider: PaymentProvider, _token: string): Promise<PaymentVerification> => {
    throw new Error('Payment verification must be handled by server-side Cloud Function or payment gateway webhook.');
  },
};

async function generateEsewaSignature(
  secretKey: string,
  signedFieldNames: string,
  data: Record<string, string>
): Promise<string> {
  const fields = signedFieldNames.split(',');
  const message = fields.map(f => data[f.trim()]).join(',');
  return await signMessage(secretKey, message);
}

async function signMessage(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
