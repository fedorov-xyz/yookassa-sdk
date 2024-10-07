import createClient, { Client } from 'openapi-fetch';
import type { paths, components } from './openapi';

export type Schemas = components['schemas'];

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

  createInvoice({
    body,
    idempotenceKey,
  }: {
    body: Schemas['CreateInvoiceRequest'];
    idempotenceKey: string;
  }) {
    return this.client.POST('/invoices', {
      params: {
        header: {
          ['Idempotence-Key']: idempotenceKey,
        },
      },
      body,
    });
  }

  getInvoice({
    body,
    idempotenceKey,
  }: {
    body: Schemas['CreateInvoiceRequest'];
    idempotenceKey: string;
  }) {
    return this.client.POST('/invoices', {
      params: {
        header: {
          ['Idempotence-Key']: idempotenceKey,
        },
      },
      body,
    });
  }
}
