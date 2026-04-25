// src/services/calendar.js

/**
 * Initiates OAuth2 flow to get Google Calendar token
 */
async function getCalendarToken() {
  let token = sessionStorage.getItem('vp_calendar_token');
  const tokenExpiry = sessionStorage.getItem('vp_calendar_token_expiry');

  if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10)) {
    return token;
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId || clientId === 'REPLACE_WITH_YOUR_CLIENT_ID') {
    throw new Error('Google Client ID not configured.');
  }

  const redirectUri = window.location.origin;
  const scope = 'https://www.googleapis.com/auth/calendar.events';
  const state = Math.random().toString(36).substring(7);

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&state=${state}`;

  // Open popup for auth
  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'Google Auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    const checkPopup = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          reject(new Error('OAuth window closed by user.'));
          return;
        }

        const currentUrl = popup.location.href;
        if (currentUrl.includes(redirectUri)) {
          const hash = new URL(currentUrl).hash;
          const params = new URLSearchParams(hash.substring(1));
          
          if (params.has('access_token')) {
            const accessToken = params.get('access_token');
            const expiresIn = params.get('expires_in') || 3600;
            
            sessionStorage.setItem('vp_calendar_token', accessToken);
            sessionStorage.setItem('vp_calendar_token_expiry', Date.now() + (parseInt(expiresIn, 10) * 1000).toString());
            
            popup.close();
            clearInterval(checkPopup);
            resolve(accessToken);
          } else if (params.has('error')) {
            popup.close();
            clearInterval(checkPopup);
            reject(new Error('OAuth error: ' + params.get('error')));
          }
        }
      } catch (err) {
        // Ignore cross-origin frame errors while navigating
      }
    }, 500);
  });
}

/**
 * Adds an event to Google Calendar
 * @param {Object} eventDetails 
 * @param {string} eventDetails.title
 * @param {string} eventDetails.description
 * @param {string} eventDetails.date - YYYY-MM-DD
 */
export async function addToCalendar({ title, description, date }) {
  try {
    const token = await getCalendarToken();

    // Format date properly for full day event
    const start = { date };
    
    // End date should be the day after for an all-day event
    const endDateObj = new Date(date);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const end = { date: endDateObj.toISOString().split('T')[0] };

    const event = {
      summary: title,
      description: description,
      start: start,
      end: end,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 24 * 60 },
        ],
      },
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (response.status === 401) {
       // Token expired, clear it and retry once
       sessionStorage.removeItem('vp_calendar_token');
       sessionStorage.removeItem('vp_calendar_token_expiry');
       return addToCalendar({ title, description, date });
    }

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Add to calendar failed:', error);
    throw error;
  }
}
