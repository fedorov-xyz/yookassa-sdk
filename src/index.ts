import createClient, { Client } from 'openapi-fetch';
import type { paths, components, operations } from './openapi';

export type Schemas = components['schemas'];

export type CreatePaymentBody = components['schemas']['CreatePaymentRequest'];

export type GetPaymentListQuery = operations['get-payment-list']['parameters']['query'];

export type CreateInvoiceBody = components['schemas']['CreateInvoiceRequest'];

export type WebhookEvent = components['schemas']['WebhookEvent'];

interface SDKOptions {
  shopId: string;
  secretKey: string;
}

export class YooKassaSDK {
  constructor({ shopId, secretKey }: SDKOptions) {
    this.client = createClient<paths>({ baseUrl: 'https://api.yookassa.ru/v3/' });

    this.client.use({
      onRequest({ request }) {
        const credentials = btoa(`${shopId}:${secretKey}`);
        request.headers.set('Authorization', 'Basic ' + credentials);
      },
    });
  }

  private readonly client: Client<paths>;

  createPayment({ body, idempotenceKey }: { body: CreatePaymentBody; idempotenceKey: string }) {
    return this.client.POST('/payments', {
      params: {
        header: {
          ['Idempotence-Key']: idempotenceKey,
        },
      },
      body,
    });
  }

  getPaymentList({ query }: { query: GetPaymentListQuery }) {
    return this.client.GET('/payments', {
      params: { query },
    });
  }

  getPayment({ payment_id }: { payment_id: string }) {
    return this.client.GET('/payments/{payment_id}', {
      params: {
        path: { payment_id },
      },
    });
  }

  createInvoice({ body, idempotenceKey }: { body: CreateInvoiceBody; idempotenceKey: string }) {
    return this.client.POST('/invoices', {
      params: {
        header: {
          ['Idempotence-Key']: idempotenceKey,
        },
      },
      body,
    });
  }

  getInvoice({ invoice_id }: { invoice_id: string }) {
    return this.client.GET('/invoices/{invoice_id}', {
      params: {
        path: { invoice_id },
      },
    });
  }
}
