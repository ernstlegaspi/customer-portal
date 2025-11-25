## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Run development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

The app will be available at `http://localhost:3000`

## Pages and Routes

### Public Routes

**/** - Login page
- Email and phone authentication
- Form validation
- Redirects to dashboard on success

### Protected Routes (require authentication)

**/dashboard** - Bookings list
- View all customer bookings
- Filter and search (coming soon)
- Status indicators
- Quick access to booking details

**/dashboard/bookings/[id]** - Booking details
- Full booking information
- View attachments
- Send and view messages
- Navigation back to list

## Authentication Flow

1. User enters email and phone on login page
2. Frontend calls `/api/auth/login`
3. Backend verifies credentials with ServiceM8
4. JWT token stored in localStorage
5. AuthContext manages authentication state
6. Protected routes check authentication
7. Token included in all API requests via axios interceptor

## Components

### AuthProvider
Manages authentication state across the app:
- Stores customer info and token
- Provides login/logout functions
- Checks authentication on mount
- Redirects based on auth status

### Dashboard Layout
Provides consistent navigation:
- Top navigation bar
- User info display
- Logout button
- Max-width content container

## API Integration

The frontend communicates with the Express backend through:

```typescript
// Authentication
authAPI.login(credentials)
authAPI.verify()

// Bookings
bookingsAPI.getAll()
bookingsAPI.getById(id)
bookingsAPI.getAttachments(id)

// Messages
messagesAPI.getByBookingId(bookingId)
messagesAPI.create(bookingId, message)
```

All requests automatically include JWT token via axios interceptor.

## Styling

Built with Tailwind CSS:
- Responsive design (mobile-first)
- Utility-first approach
- Custom primary color theme
- Consistent spacing and typography
- Accessible form inputs

## Form Handling

Using `react-hook-form` for:
- Form validation
- Error handling
- Submission state management
- Clean validation rules

## State Management

- **AuthContext** - Global authentication state
- **useState** - Local component state
- **useEffect** - Data fetching and side effects
- **localStorage** - Token and customer data persistence

## Error Handling

- API errors caught and displayed to users
- Loading states during async operations
- Graceful fallbacks for missing data
- Form validation errors inline

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL | Yes |

## Development Tips

**Hot reload:**
Changes to code automatically refresh the browser.

**Type checking:**
```bash
npm run type-check
```

**Linting:**
```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Authentication token expires after 7 days (configurable in backend)
- All routes except login require authentication
- Form validation provides immediate feedback
- Messages update in real-time when sent
- Responsive design works on mobile, tablet, and desktop