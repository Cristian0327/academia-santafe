import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      documento?: string;
      isAdmin?: boolean;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    documento?: string;
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    documento?: string;
    isAdmin?: boolean;
  }
}
