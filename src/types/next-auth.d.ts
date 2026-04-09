import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    token: string;
    phone: string;
    role: "owner" | "customer";
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: "owner" | "customer";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    role: "owner" | "customer";
    username: string;
    userId: string;
    phone: string;
  }
}
