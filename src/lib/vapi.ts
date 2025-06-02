import axios from 'axios';

const VAPI_BASE_URL = 'https://api.vapi.ai';
const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY || '';
const MAILGUN_API_KEY = import.meta.env.VITE_MAILGUN_API_KEY || '';
const MAILGUN_DOMAIN = import.meta.env.VITE_MAILGUN_DOMAIN || '';

const sendAssistantEmail = async (assistantId: string, recipientEmail: string) => {
  const formLink = `${window.location.origin}/outreach-form?assistant_id=${assistantId}`;
  
  try {
    const formData = new FormData();
    formData.append('from', `Mailgun Sandbox <postmaster@${MAILGUN_DOMAIN}>`);
    formData.append('to', recipientEmail);
    formData.append('subject', 'Start Your AI Outreach Call');
    formData.append('text', `Your VAPI assistant is ready to make calls!\n\nClick here to start: ${formLink}\n\nThis link will take you to a form where you can enter the recipient's details for the AI outreach call.`);
    formData.append('html', `
      <h2>Hi Looking for collaboration</h2>
      <p>get on call and discuss the details</p>
      <p><strong>Assistant ID:</strong> ${assistantId}</p>
      <div style="margin: 30px 0;">
        <a href="${formLink}" style="display: inline-block; padding: 14px 28px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Start Your Outreach Call
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        Click the button above to access a form where you can enter the recipient's details for the AI outreach call.
      </p>
    `);

    await axios.post(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      formData,
      {
        auth: {
          username: 'api',
          password: MAILGUN_API_KEY
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw the error as this is a non-critical operation
  }
};

// Create or get assistant
export const createAssistant = async (recipientEmail: string) => {
  try {
    const response = await axios.post(
      `${VAPI_BASE_URL}/assistant`,
      {
        name: "Riley",
        voice: {
          voiceId: "Elliot",
          provider: "vapi"
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          temperature: 0.5,
          messages: [
            {
              role: "system",
              content: `You are a professional and friendly brand manager from Opraahfx, an influencer marketing agency.

                Your job is to explain that you're running a health-focused campaign and found the creator's Instagram profile impressive. You want to discuss a potential collaboration.

                The campaign involves creating 7 reels per week, and the budget offered is between Ten to twenty thousand rupees, depending on scope and engagement. You're allowed to negotiate between Five to Twenty Five thousand rupees. All deals must include a brand tag.

                Your tone should be confident, friendly, and human.

                If the creator seems unsure or hesitant, create urgency by mentioning that you're contacting a few more creators soon and would love a quick confirmation.

                If they're interested, confirm that and thank them. If they say maybe or are unavailable, end politely — no follow-up needed.`
            }
          ]
        },
        firstMessage: "Hi, this is Bijay from Influencer-Flow. I'm reaching out about a collaboration opportunity on Instagram — do you have a quick minute?",
        voicemailMessage: "Hi, this is Bijay from Influencer-Flow. I'm reaching out about a collaboration opportunity on Instagram — do you have a quick minute?",
        endCallMessage: "Thanks so much for your time.Since we're moving fast on this campaign, we may reach out to other creators shortly if we don't get a confirmation. Feel free to reach out to Opraahfx if you're interested later. Have a great day!",
        endCallPhrases: [
          "goodbye",
          "talk to you soon"
        ],
        clientMessages: [
          "conversation-update",
          "function-call",
          "hang",
          "model-output",
          "speech-update",
          "status-update",
          "transfer-update",
          "transcript",
          "tool-calls",
          "user-interrupted",
          "voice-input",
          "workflow.node.started"
        ],
        serverMessages: [
          "conversation-update",
          "end-of-call-report",
          "function-call",
          "hang",
          "speech-update",
          "status-update",
          "tool-calls",
          "transfer-destination-request",
          "user-interrupted"
        ],
        transcriber: {
          model: "nova-3",
          language: "en",
          provider: "deepgram",
          endpointing: 150
        },
        startSpeakingPlan: {
          waitSeconds: 0.4,
          smartEndpointingEnabled: "livekit"
        },
        voicemailDetection: {
          provider: "google"
        },
        backgroundDenoisingEnabled: false,
        hipaaEnabled: false
      },
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantId = response.data.id;
    
    // Send email with assistant ID and dashboard link
    await sendAssistantEmail(assistantId, recipientEmail);

    return assistantId;
  } catch (error) {
    console.error('Failed to create assistant:', error);
    throw error;
  }
};

// Helper function to make outreach calls
export const makeOutreachCall = async (phoneNumber: string, requirements: string, assistant_id: string) => {
  try {
    const response = await axios.post(
      `${VAPI_BASE_URL}/call`,
      {
        customers: [
          {
            numberE164CheckEnabled: true,
            number: phoneNumber
          }
        ],
        assistantId: assistant_id,
        phoneNumberId: "2d827489-e9bd-4803-b450-f6566968b434"
      },
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      callId: response.data.id,
      status: response.data.status
    };
  } catch (error) {
    console.error('VAPI call failed:', error);
    throw error;
  }
}; 

