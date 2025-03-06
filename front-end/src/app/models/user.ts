export interface User {
  username: string;
  name: string;
  email: string;
  userInformation: {
    name?: string;
    about?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    imageUrl?: string;
  };
}
