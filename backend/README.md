## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Edit `.env` file and add your ServiceM8 credentials:
```
SERVICEM8_API_KEY=smk-c0a5a5-3bb736bcce2624d5-b2379323a115ed26
SERVICEM8_API_SECRET=
```

3. **Run in development mode:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

**POST** `/api/auth/login`
```json
{
  "email": "customer@example.com",
  "phone": "+1234567890"
}
```
Returns JWT token for authenticated requests.

**POST** `/api/auth/verify`
Verify if current token is valid.

### Bookings

**GET** `/api/bookings`
Get all bookings for authenticated customer.

**GET** `/api/bookings/:id`
Get specific booking details.

**GET** `/api/bookings/:id/attachments`
Get all attachments for a booking.

### Messages

**GET** `/api/bookings/:bookingId/messages`
Get all messages for a booking.

**POST** `/api/bookings/:bookingId/messages`
```json
{
  "message": "Your message here"
}
```

### Utility

**GET** `/health`
Health check endpoint.

**GET** `/api/test-connection`
Test ServiceM8 API connection.

## Authentication Flow

1. Customer provides email and phone number
2. Backend verifies they exist in ServiceM8 (have jobs)
3. JWT token is generated and returned
4. Token must be included in subsequent requests:
   ```
   Authorization: Bearer <token>
   ```

## ServiceM8 Integration

The backend integrates with ServiceM8 API endpoints:
- `/job.json` - Fetch all jobs
- `/job/{uuid}.json` - Fetch specific job
- `/attachment.json` - Fetch attachments

Authentication uses Basic Auth with API key.

## Database Schema

**messages table:**
- `id` - Auto-increment primary key
- `booking_id` - ServiceM8 job UUID
- `customer_email` - Customer's email
- `message` - Message content
- `created_at` - Timestamp

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| SERVICEM8_API_KEY | ServiceM8 API key | - |
| SERVICEM8_API_SECRET | ServiceM8 API secret | - |
| SERVICEM8_API_BASE_URL | ServiceM8 base URL | https://api.servicem8.com/api_1.0 |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| DATABASE_PATH | SQLite database path | ./database.sqlite |

## Development

Run with auto-reload:
```bash
npm run dev
```

Test ServiceM8 connection:
```bash
curl http://localhost:5000/api/test-connection
```

## Notes

- ServiceM8 API key provided uses Basic Auth
- Customer authentication is based on matching email/phone with ServiceM8 jobs
- Messages are stored locally in SQLite
- All booking endpoints require valid JWT token