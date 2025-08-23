# WhatsApp QR Code Integration

This document describes the WhatsApp QR code generation feature implemented in onboarding step 3.

## Overview

The WhatsApp QR code integration allows users to connect their WhatsApp Business account to the ViuWi chatbot system during the onboarding process. The QR code is generated dynamically using the n8n webhook service.

## Architecture

### Components

1. **Supabase Edge Function** (`supabase/functions/generate-whatsapp-qr/index.ts`)
   - Handles QR code generation requests
   - Validates user authentication and business profile ownership
   - Calls n8n webhook service
   - Returns base64 image data

2. **WhatsApp Service** (`src/services/supabaseWhatsApp.ts`)
   - Client-side service for calling the edge function
   - Handles response validation and error handling
   - Provides utility methods for base64 data conversion

3. **QRCodeDisplay Component** (`src/components/onboarding/QRCodeDisplay.tsx`)
   - Enhanced to support both URL and base64 image data
   - Includes loading states, error handling, and retry functionality
   - Uses conditional rendering for different image sources

4. **OnboardingStep3 Component** (`src/components/onboarding/OnboardingStep3.tsx`)
   - Integrates with WhatsApp service
   - Manages QR generation state and error handling
   - Auto-generates QR code on component mount

### Data Flow

```
User → OnboardingStep3 → WhatsAppService → Edge Function → n8n Webhook → WhatsApp API
                                                                              ↓
User ← QRCodeDisplay ← OnboardingStep3 ← WhatsAppService ← Edge Function ← Base64 QR Data
```

## API Integration

### n8n Webhook Endpoint

**URL:** `https://n8nrailway.prasai.my.id/webhook/generate-wa-session`

**Request:**
```json
{
  "businessId": "business-profile-uuid"
}
```

**Response:**
```json
{
  "mimetype": "image/png",
  "data": "iVBORw0KGgoAAAANSUhEUgAA..." // Base64 encoded PNG data
}
```

### Environment Variables

Required environment variables for the edge function:

- `N8N_WEBHOOK_BASE_URL`: Base URL for n8n webhooks (default: configured in .env.local)
- `N8N_TIMEOUT_MS`: Timeout for webhook calls in milliseconds (default: 30000)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key

## Error Handling

### Edge Function Errors

1. **Configuration Errors** (500)
   - Missing N8N_WEBHOOK_BASE_URL
   - Invalid Supabase configuration

2. **Authentication Errors** (401)
   - Missing authorization header
   - Invalid user token

3. **Authorization Errors** (404)
   - Business profile not found
   - User doesn't own the business profile

4. **Service Errors** (503/408)
   - n8n webhook timeout
   - n8n service unavailable

5. **Data Validation Errors** (500)
   - Invalid response format
   - Invalid base64 data

### Client-Side Error Handling

- **Loading States**: Shows spinner while generating QR
- **Error Display**: Shows error message with retry button
- **Toast Notifications**: Success/error feedback
- **Graceful Degradation**: Falls back to placeholder if generation fails

## Security Considerations

1. **Authentication**: All requests require valid user authentication
2. **Authorization**: Users can only generate QR codes for their own business profiles
3. **Data Validation**: All inputs and responses are validated
4. **Rate Limiting**: Implemented at the edge function level
5. **Timeout Protection**: Prevents hanging requests

## Usage

### Basic Usage

The QR code generation is automatic when users reach onboarding step 3:

```typescript
// Component automatically generates QR on mount
<OnboardingStep3
  onQRScanned={handleQRScanned}
  onBack={handleBack}
  isLoading={isLoading}
/>
```

### Manual QR Generation

```typescript
import { supabaseWhatsAppAPI } from '@/services/supabaseWhatsApp';

const generateQR = async (businessProfileId: string) => {
  const result = await supabaseWhatsAppAPI.generateWhatsAppQR(businessProfileId);
  
  if (result.success && result.data) {
    const dataUrl = supabaseWhatsAppAPI.convertToDataUrl(
      result.data.qrCodeData, 
      result.data.mimetype
    );
    // Use dataUrl in img tag
  }
};
```

## Testing

### Local Development

1. Ensure n8n webhook service is running
2. Configure environment variables
3. Test with valid business profile ID
4. Verify QR code generation and display

### Error Scenarios

1. **Network Timeout**: Test with slow network conditions
2. **Invalid Business ID**: Test with non-existent business profile
3. **Service Unavailable**: Test when n8n service is down
4. **Invalid Response**: Test with malformed webhook responses

## Monitoring

### Logs

- Edge function logs QR generation requests and responses
- Client-side logs errors and successful generations
- n8n webhook logs (external service)

### Metrics

- QR generation success rate
- Average generation time
- Error frequency by type
- User completion rate for step 3

## Future Enhancements

1. **QR Code Caching**: Cache generated QR codes to reduce API calls
2. **Real-time Status**: Check WhatsApp connection status after QR scan
3. **Multiple Sessions**: Support multiple WhatsApp sessions per business
4. **QR Expiration**: Handle QR code expiration and regeneration
5. **Analytics**: Track QR scan success rates and user behavior

## Troubleshooting

### Common Issues

1. **QR Not Generating**
   - Check business profile exists
   - Verify user authentication
   - Check n8n service status

2. **Invalid QR Code**
   - Verify base64 data format
   - Check image mimetype
   - Validate webhook response

3. **Timeout Errors**
   - Increase N8N_TIMEOUT_MS
   - Check network connectivity
   - Verify n8n service performance

### Debug Steps

1. Check browser console for client-side errors
2. Check Supabase edge function logs
3. Verify n8n webhook logs
4. Test with different business profiles
5. Validate environment variables
