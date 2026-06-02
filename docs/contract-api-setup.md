# Contract API instance setup

Server-side contract auto-fill uses the same outbound REST message as Doc Intel.

## Outbound REST

| Item | Value |
|------|-------|
| REST message | `x_2058901_demo TSC APIM` |
| Method | `get_contract` |
| URL | `https://tsc-api.azure-api.net/rms/v1/UWFData/contracts` |
| Query param | `id` = ticket contract number (`external_id`) |
| Header | `Ocp-Apim-Subscription-Key` (paste on instance after deploy) |

## Flow

1. Ticket insert creates an approval row (`ticket-create-approval` BR, order 200).
2. `ticket-fetch-contract` **async** BR (order 300) calls Contract Details and maps fields onto the approval row. Must be async — scoped apps cannot perform outbound HTTP from synchronous business rules.
3. PDF attachment still triggers Doc Intel separately.

## Test UI page

Open **`/x_2058901_demo_contract_test.do`** (also linked from the portal home page). Enter a contract number and submit to call the proxy below.

## Test scripted REST

`POST /api/x_2058901_demo/contract_test/details`

Body: `{ "contract_id": "CDH0144105" }`

Returns raw `contracts` array and `mapped_values` for mapper verification.

## Sample response

See [`contract-response-sample.json`](contract-response-sample.json).
