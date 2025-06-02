# Influence Seeker Hub

A modern web application for managing AI-powered outreach calls to influencers using VAPI.ai integration. This platform streamlines the process of connecting brands with influencers through automated, intelligent phone calls.

## Features

- AI-powered outreach calls using VAPI.ai
- Automated email notifications
- Custom voice assistant configuration
- Real-time call management
- Secure handling of sensitive information

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **API Integration**: 
  - VAPI.ai for AI voice calls
  - Mailgun for email notifications
- **Environment Management**: dotenv
- **HTTP Client**: Axios
- **Voice AI Features**:
  - GPT-4 for conversation intelligence
  - Deepgram for transcription
  - Custom voice models (VAPI)

## Environment Variables

The following environment variables are required:

```env
VITE_VAPI_API_KEY=your_vapi_api_key
VITE_MAILGUN_API_KEY=your_mailgun_api_key
VITE_MAILGUN_DOMAIN=your_mailgun_domain
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/lib/vapi.ts` - VAPI.ai integration and assistant configuration
- `src/components/` - React components
- `src/pages/` - Application pages and routes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

Copyright (c) 2024 Influence Seeker Hub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
