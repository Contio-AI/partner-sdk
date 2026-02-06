# Contio Partner SDK

Official TypeScript/JavaScript SDK for integrating with the Contio Partner API.

📚 **Full Documentation**: [docs.contio.ai/partner-api](https://docs.contio.ai/partner-api/)

## Installation

```bash
npm install @contio/partner-sdk
```

### Requirements

- Node.js 22.0.0 or higher (LTS)
- TypeScript 4.5.0 or higher (for TypeScript users)

## Quick Start

### OAuth User Operations

```typescript
import { ContioPartnerSDK } from '@contio/partner-sdk';

const { oauth, user } = ContioPartnerSDK.forUser({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://your-app.com/callback'
});

// Generate authorization URL
const authUrl = oauth.getAuthorizationUrl('csrf-state');

// After user authorizes, exchange code for tokens
const tokens = await oauth.exchangeCodeForToken(authorizationCode);

// Access user data
const meetings = await user.getMeetings();
const actionItems = await user.getActionItems();
```

### API Key Admin Operations

```typescript
import { ContioPartnerSDK } from '@contio/partner-sdk';

const { admin } = ContioPartnerSDK.forAdmin({
  apiKey: 'your-api-key'
});

const workflows = await admin.getWorkflows();
const stats = await admin.getStats();
```

## Key Features

### Calendar Events

Access user calendar events and retrieve detailed event information:

```typescript
// List calendar events in a date range
const events = await user.getCalendarEvents({
  start: '2026-01-01T00:00:00Z',
  end: '2026-01-31T23:59:59Z'
});

// Get detailed information about a specific calendar event
const event = await user.getCalendarEvent('cal-event-123');
console.log(`Event: ${event.title}`);
console.log(`Organizer: ${event.organizer?.email}`);

// Create a meeting from a calendar event
const result = await user.createMeetingFromCalendarEvent('cal-event-123');
console.log(`Created: ${result.created}, Meeting ID: ${result.meeting?.id}`);
```

### Webhook Events

The SDK supports all Partner API webhook events with full TypeScript typing:

**Meeting Events:**
- `meeting.created` - New meeting created
- `meeting.updated` - Meeting properties changed (title, scheduled time, etc.)
- `meeting.completed` - Meeting ended with notes/summary available

**Calendar Events:**
- `calendar_event.created` - Calendar event synced from external calendar
- `calendar_event.updated` - Calendar event updated in external calendar
- `calendar_event.deleted` - Calendar event cancelled/deleted

**Agenda Items:**
- `agenda_item.created` - Agenda item created in meeting or backlog
- `agenda_item.updated` - Agenda item title, status, or properties changed
- `agenda_item.deleted` - Agenda item removed

**Action Items:**
- `action_item.created` - New action item created
- `action_item.updated` - Action item status or details changed
- `action_item.completed` - Action item marked as completed

**Other Events:**
- `workflow.assignment.created` - Action item assigned to your workflow
- `participant.added` - Participant(s) added to meeting
- `participant.removed` - Participant removed from meeting
- `user.connection.revoked` - User revoked connection to your app

## Webhook Verification

```typescript
import { verifyWebhookSignature, parseWebhook } from '@contio/partner-sdk';

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-contio-signature'] as string;

  try {
    const event = parseWebhook(req.body, signature, process.env.WEBHOOK_SECRET!);
    // Handle event...
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(401).json({ error: 'Invalid signature' });
  }
});
```

## Error Handling

All API errors are thrown as `ContioAPIError` instances with structured information:

```typescript
import { ContioAPIError } from '@contio/partner-sdk';

try {
  const meeting = await user.getMeeting('invalid-id');
} catch (error) {
  if (error instanceof ContioAPIError) {
    console.error('Code:', error.code);           // e.g., 'not_found', 'unauthorized'
    console.error('Message:', error.message);     // Human-readable description
    console.error('Status:', error.statusCode);   // HTTP status code (404, 401, etc.)
    console.error('Response:', error.response);   // Full error response body
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `unauthorized` | 401 | Invalid or expired access token |
| `forbidden` | 403 | Insufficient permissions for this resource |
| `not_found` | 404 | Resource does not exist |
| `validation_error` | 400 | Invalid request parameters |
| `rate_limited` | 429 | Too many requests; retry after backoff |
| `internal_error` | 500 | Server error; retry with exponential backoff |

The SDK automatically retries transient errors (5xx) with exponential backoff.

## Documentation

For complete documentation, visit:

- **[Quick Start](https://docs.contio.ai/partner-api/getting-started/quickstart/)** - Get up and running
- **[Authentication](https://docs.contio.ai/partner-api/getting-started/authentication/)** - OAuth 2.0 and API keys
- **[API Reference](https://docs.contio.ai/partner-api/api-reference/)** - Complete method reference
- **[OAuth Flow](https://docs.contio.ai/partner-api/guides/oauth-flow/)** - Detailed OAuth implementation
- **[Webhook Events](https://docs.contio.ai/partner-api/guides/webhook-events/)** - Real-time notifications
- **[Credential Management](https://docs.contio.ai/partner-api/guides/credential-management/)** - Secure credential rotation
- **[Troubleshooting](https://docs.contio.ai/partner-api/guides/troubleshooting/)** - Common issues and solutions

## Token Format

Contio uses opaque tokens for improved security. Access tokens (`cto_at_v1_...`) and refresh tokens (`cto_rt_v1_...`) contain no readable claims.

| Token | Format | Validity |
|-------|--------|----------|
| Authorization code | Opaque | 5 minutes |
| Access token | `cto_at_v1_...` | 24 hours |
| Refresh token | `cto_rt_v1_...` | 30 days |
| ID token | JWT | 24 hours |

**Important**: Do not attempt to decode or parse access/refresh tokens. Use introspection to get token metadata:

```typescript
const tokenInfo = await oauth.introspectToken(accessToken);
console.log('Scopes:', tokenInfo.scope);
console.log('Expires:', new Date(tokenInfo.exp * 1000));
```

## Security Best Practices

### Token Storage

- **Never store tokens in client-side code** (localStorage, cookies accessible to JS)
- **Use secure, server-side storage** (encrypted database, secure session store)
- **Refresh tokens are sensitive** — treat them like passwords
- **Set appropriate token lifetimes** — access tokens expire in 24 hours by default

```typescript
// Example: Storing tokens securely (server-side)
async function storeTokens(userId: string, tokens: AuthTokens) {
  await db.userTokens.upsert({
    where: { userId },
    data: {
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
      expiresAt: tokens.expiresAt,
    },
  });
}
```

### Webhook Security

- **Always verify signatures** using `parseWebhook()` or `verifyWebhookSignature()`
- **Use `express.raw()`** to preserve the raw request body for signature verification
- **Implement idempotency** — webhooks may be delivered more than once
- **Respond quickly** (< 5 seconds) to avoid timeout retries

```typescript
// Track processed webhook IDs to handle retries
const processedEvents = new Set<string>();

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const event = parseWebhook(req.body, signature, secret);

  if (processedEvents.has(event.event_id)) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  processedEvents.add(event.event_id);
  // Process event...
});
```

## Development

### Building from Source

```bash
git clone https://github.com/Contio-AI/partner-sdk.git
cd partner-sdk
npm install
npm run build
```

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
npm test -- oauth.test.ts   # Run specific test file
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm test` | Run the test suite |
| `npm run lint` | Run ESLint on source files |
| `npm run docs` | Generate TypeDoc documentation |
| `npm run gen-types` | Regenerate types from OpenAPI spec |

## Support

For support, contact [partner-support@contio.ai](mailto:partner-support@contio.ai)

## License

This SDK is licensed under the [MIT License](LICENSE). See the LICENSE file for details.

Note: This license applies to the SDK source code only. Use of the Contio Partner API is governed by your Partner Agreement with Contio, Inc.
