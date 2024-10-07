# YooKassa SDK ⚠️ DRAFT ⚠️

Этот модуль предоставляет интерфейс для интеграции с YooKassa, позволяя выполнять различные операции, такие как создание платежей, возвратов и управление ими. Написан на TypeScript.

Интерфейс SDK генерируется на основе openapi.yaml спецификации для API.

## Установка

Для установки используйте npm или yarn:

```bash
npm install yookassa-sdk-node
# или
yarn add yookassa-sdk-node
```

## Инициализация SDK

Передайте идентификатор магазина и секретный ключ для API.

```ts
const sdk = new YooKassaSDK({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_SECRET_KEY,
});
```

## Использование

TODO

### Работа с платежами

TODO

### Работа со счетами

#### Создание счёта

```ts
import { addHours } from 'date-fns';

const { error, data: invoice } = await sdk.createInvoice({
  body: {
    payment_data: {
      amount: {
        value: '100.00',
        currency: 'RUB',
      },
    },
    cart: [
      {
        description: 'Модная шапка',
        price: { value: '100.00', currency: 'RUB' },
        quantity: 1,
      },
    ],
    expires_at: addHours(new Date(), 1).toISOString(),
  },
  idempotenceKey: '10a3cc09-e1d7-4cd4-ba24-01fcef6522bf',
});

if (error) {
  throw new Error('Failed to create invoice');
}

console.log(invoice.status);
```

#### Получение счёта

```ts
const { error, data: invoice } = await sdk.getInvoice({
  invoice_id: '10a3cc09-e1d7-4cd4-ba24-01fcef6522bf',
});

if (error) {
  throw new Error('Failed to get invoice');
}

console.log(invoice.status);
```
