export const homePath = () => "/";

export const signUpPath = () => "/sign-up";
export const signInPath = () => "/sign-in";
export const passwordForgotPath = () => "/password-forgot";

export const accountProfilePath = () => "/account/profile";
export const accountPasswordPath = () => "/account/password";

export const ticketsPath = () => "/tickets";
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}`;
export const ticketEditPath = (ticketId: string) => `/tickets/${ticketId}/edit`;
