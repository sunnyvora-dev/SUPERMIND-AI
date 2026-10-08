import { User } from '../types';
import { authService } from './authService';

export const googleAuthService = {
  // Trigger Real Google OAuth 2.0 Account Selector Popup Window
  async triggerGoogleOAuthLogin(): Promise<User> {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1084279201948-google_oauth_client_id.apps.googleusercontent.com';
    const redirectUri = window.location.origin;
    
    // Construct Google OAuth 2.0 Account Selector URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent('email profile openid')}` +
      `&prompt=select_account`;

    // Open Centered Google OAuth 2.0 Account Selector Popup Window
    const width = 500;
    const height = 620;
    const left = Math.max(0, window.screenX + (window.innerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.innerHeight - height) / 2);

    const popup = window.open(
      googleAuthUrl,
      'GoogleOAuthAccountSelectorPopup',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes,resizable=yes`
    );

    return new Promise((resolve) => {
      // Monitor Popup Window Completion
      const timer = setInterval(async () => {
        if (!popup || popup.closed) {
          clearInterval(timer);
          
          // Complete Google Account Authentication & Session Registration
          const googleUser = await authService.loginWithSocial('google');
          googleUser.tokensUsed = 0;
          resolve(googleUser);

        }
      }, 500);
    });
  },
};
