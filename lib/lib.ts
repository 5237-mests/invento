import connectDB from '@/config/database';
import userModel from '@/models/userModel';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30 sec from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user
  const email = formData.get('email');
  const password = formData.get('password');
  // Check if the user exists from db and if the password is correct
  await connectDB();
  const user = await userModel.findOne({ email: `${email}` });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(`${password}`, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password');
  }

  // Create the session
  const expires = new Date(Date.now() + 60 * 60 * 24 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set('session', session, { expires, httpOnly: true });
  cookies().set('role', user.role, { expires, httpOnly: true });
  return { user, loged: true };
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires as number,
  });
  return res;
}
