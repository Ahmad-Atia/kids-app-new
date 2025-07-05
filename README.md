# PartiZip Kids App

A React Native mobile application built with Expo for kids to participate in community events and activities.

## Features

- **Authentication**: User registration, login, and guest access
- **Events**: Browse, create, join, and manage events
- **Communities**: Create and join communities of interest
- **Profile Management**: Edit profile, view statistics, and manage settings
- **Feedback**: Rate and provide feedback for attended events
- **Maps**: View event locations (placeholder implementation)
- **Help & Support**: Comprehensive help system and FAQ

## Tech Stack

- **React Native** with Expo
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons
- **Maps**: React Native Maps (placeholder)

## Project Structure

```
kids-app-new/
├── App.js                 # Main app component
├── package.json           # Dependencies and scripts
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── EventCard.js
│   │   ├── CommunityCard.js
│   │   ├── LoadingSpinner.js
│   │   └── index.js
│   ├── context/           # React Context providers
│   │   └── AppContext.js
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.js
│   ├── screens/           # Screen components
│   │   ├── AuthScreen.js
│   │   ├── HomeScreen.js
│   │   ├── EventsScreen.js
│   │   ├── EventDetailsScreen.js
│   │   ├── CommunityScreen.js
│   │   ├── CommunityDetailsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── CreateEventScreen.js
│   │   ├── EditProfileScreen.js
│   │   ├── FeedbackScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── HelpScreen.js
│   │   └── MapScreen.js
│   ├── services/          # API and business logic
│   │   ├── ApiService.js
│   │   ├── AuthService.js
│   │   ├── EventService.js
│   │   ├── CommunityService.js
│   │   └── UserService.js
│   └── utils/             # Utility functions
│       ├── constants.js
│       ├── helpers.js
│       ├── storage.js
│       └── index.js
```

## Backend Integration

The app is designed to work with the PartiZip backend services:

- **API Gateway**: `http://localhost:8080` (default)
- **User Service**: User authentication and profile management
- **Event Service**: Event CRUD operations and participation
- **Community Service**: Community management and membership

### API Endpoints

- Authentication: `/auth/login`, `/auth/register`
- Users: `/users`, `/users/profile`
- Events: `/events`, `/events/{id}/join`, `/events/{id}/leave`
- Communities: `/communities`, `/communities/{id}/join`

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Backend URL**:
   - Update `API_CONFIG.BASE_URL` in `src/utils/constants.js`
   - Make sure the backend services are running

3. **Start the Development Server**:
   ```bash
   npm start
   ```

4. **Run on Device**:
   - Install Expo Go on your mobile device
   - Scan the QR code to run the app

## Configuration

### Backend URL
Update the backend URL in `src/utils/constants.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://your-backend-url:8080',
  // ... other config
};
```

### App Settings
Modify app constants in `src/utils/constants.js`:
- App name and version
- Color scheme
- Validation rules
- Error messages

## Key Features Implementation

### Authentication
- Login/Register forms with validation
- JWT token management
- Guest mode support
- Automatic token refresh

### Event Management
- Event listing with search and filters
- Event creation with form validation
- Join/Leave event functionality
- Event feedback system

### Community Features
- Community discovery
- Join/Leave communities
- Community-specific events
- Member management

### Profile Management
- User profile editing
- Statistics and activity tracking
- Settings and preferences
- Account management

## Error Handling

The app includes comprehensive error handling:
- Network error detection
- API error responses
- User-friendly error messages
- Retry mechanisms

## State Management

Using React Context API for global state:
- Authentication state
- User profile data
- App configuration
- Loading states

## Storage

AsyncStorage is used for:
- Authentication tokens
- User preferences
- Offline data caching
- App settings

## Testing

To test the app:
1. Start the backend services
2. Run the app with Expo Go
3. Test all major user flows:
   - Registration/Login
   - Event creation and joining
   - Community management
   - Profile editing

## Development Notes

- All API calls include proper error handling
- Loading states are implemented throughout
- Form validation follows best practices
- UI components are reusable and consistent
- Code is organized following React Native conventions

## Future Enhancements

- Push notifications
- Real-time chat
- Advanced map features
- Photo sharing
- Event reminders
- Social features
- Offline mode
- Internationalization

## Support

For help and support:
- Check the in-app Help section
- Contact: support@partizip.com
- Phone: +1-234-567-8900

## License

This project is part of the PartiZip platform for educational purposes.
