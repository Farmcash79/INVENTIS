import { storage } from '@/lib/storage';
import { hashPassword, generateToken, normalizeRole } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    const normalizedRole = normalizeRole(role);

    // Validation
    if (!name || !email || !password || !normalizedRole) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (normalizedRole !== 'owner' && normalizedRole !== 'sales') {
      return Response.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await storage.users.getByEmail(email);
    if (existingUser) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await storage.users.create({
      name,
      email,
      passwordHash,
      role: normalizedRole,
    });

    // Generate token
    const token = generateToken(user.id, normalizedRole);

    // Return user data (without password)
    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
    });
  } catch (error) {
    console.error('Signup route failed:', error);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
