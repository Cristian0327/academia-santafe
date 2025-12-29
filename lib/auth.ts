import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseHelpers } from './supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        documento: { label: 'Documento', type: 'text' },
        nombre: { label: 'Nombre', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.documento || !credentials?.nombre) {
          return null;
        }

        try {
          // Buscar o crear estudiante en Supabase
          let estudiante = await supabaseHelpers.obtenerEstudiante(credentials.documento);
          
          if (!estudiante) {
            // Crear nuevo estudiante
            estudiante = await supabaseHelpers.crearEstudiante({
              documento: credentials.documento,
              nombre: credentials.nombre,
            });
          }

          return {
            id: estudiante.documento,
            name: estudiante.nombre,
            email: `${estudiante.documento}@estudiante.local`,
          };
        } catch (error) {
          console.error('Error en autorización:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.documento = user.id;
        
        // Verificar si es admin
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
        token.isAdmin = user.email ? adminEmails.includes(user.email) : false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.documento = token.documento as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'academia-santafe-secret-key-2025',
};
