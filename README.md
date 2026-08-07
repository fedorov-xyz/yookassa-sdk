# YooKassa SDK

TypeScript-клиент для [API ЮKassa](https://yookassa.ru/developers/api).

Позволяет создавать и получать платежи и счета, подтверждать двухстадийные платежи (`capture`) и работать с ответами API в типобезопасном виде. Под капотом — `openapi-fetch` и типы из локальной OpenAPI-спецификации `src/openapi.yaml`.

## OpenAPI

- Документация API: https://yookassa.ru/developers/api
- Страница спецификации: https://yookassa.ru/developers/using-api/openapi-specification
- Оригинальный YAML: https://yookassa.ru/developers/api/yookassa-openapi-specification.yaml

В репозитории лежит **модифицированная** версия спеки (`src/openapi.yaml`), а не копия оригинала один в один. Так удобнее для SDK:

- осмысленные `operationId` (`create-payment`, `capture-payment`, …);
- именованные `$ref` на схемы запросов/ответов вместо больших inline-объектов;
- покрыт в первую очередь платёжный контур (платежи, счета, capture), без всего API ЮKassa целиком.

### Как обновлять

1. Сверь изменения с [справочником API](https://yookassa.ru/developers/api) и [оригинальным OpenAPI](https://yookassa.ru/developers/api/yookassa-openapi-specification.yaml).
2. Внеси правки в `src/openapi.yaml` (сохраняя локальные `operationId` и структуру `$ref`).
3. Перегенерируй типы: `npm run generate-openapi` → обновится `src/openapi.d.ts`.
4. Если появился новый эндпоинт в спеке — добавь метод в `src/index.ts` и пример в этот README.

## Установка

```bash
npm install yookassa-sdk-node
# или
yarn add yookassa-sdk-node
```

## Инициализация

```ts
import { YooKassaSDK } from 'yookassa-sdk-node';

const sdk = new YooKassaSDK({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});
```

Все методы возвращают результат `openapi-fetch`: `{ data, error, response }`.

## Платежи

### Создание платежа

```ts
const { data: payment, error } = await sdk.createPayment({
  body: {
    amount: { value: '100.00', currency: 'RUB' },
    confirmation: {
      type: 'redirect',
      return_url: 'https://example.com/return',
    },
    capture: true,
    description: 'Заказ №72',
  },
  idempotenceKey: crypto.randomUUID(),
});

if (error) {
  throw error;
}

console.log(payment.id, payment.status, payment.confirmation);
```

### Список платежей

```ts
const { data, error } = await sdk.getPaymentList({
  query: {
    status: 'succeeded',
    limit: 10,
  },
});

if (error) {
  throw error;
}

console.log(data.items, data.next_cursor);
```

### Информация о платеже

```ts
const { data: payment, error } = await sdk.getPayment({
  payment_id: '2d78da6d-000f-5000-8000-1edbcc82210d',
});

if (error) {
  throw error;
}

console.log(payment.status);
```

### Подтверждение платежа (capture)

Для двухстадийных платежей (`capture: false` при создании). Без `body` списывается полная сумма.

```ts
const { data: payment, error } = await sdk.capturePayment({
  payment_id: '2d78da6d-000f-5000-8000-1edbcc82210d',
  idempotenceKey: crypto.randomUUID(),
  // опционально — частичное списание:
  // body: { amount: { value: '50.00', currency: 'RUB' } },
});

if (error) {
  throw error;
}

console.log(payment.status); // succeeded
```

## Счета

### Создание счёта

```ts
const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

const { data: invoice, error } = await sdk.createInvoice({
  body: {
    payment_data: {
      amount: { value: '100.00', currency: 'RUB' },
    },
    cart: [
      {
        description: 'Модная шапка',
        price: { value: '100.00', currency: 'RUB' },
        quantity: 1,
      },
    ],
    expires_at: expiresAt,
  },
  idempotenceKey: crypto.randomUUID(),
});

if (error) {
  throw error;
}

console.log(invoice.status, invoice.delivery_method);
```

### Информация о счёте

```ts
const { data: invoice, error } = await sdk.getInvoice({
  invoice_id: 'in-2d78da6d-000f-5000-8000-1edbcc82210d',
});

if (error) {
  throw error;
}

console.log(invoice.status);
```

## Типы

Экспортируются типы тел запросов и webhook-событий:

```ts
import type {
  CreatePaymentBody,
  CapturePaymentBody,
  GetPaymentListQuery,
  CreateInvoiceBody,
  WebhookEvent,
  Schemas,
} from 'yookassa-sdk-node';
```
