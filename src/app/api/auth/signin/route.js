import { storage } from '@/lib/storage';
import { comparePassword, generateToken, normalizeRole } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    const normalizedRole = normalizeRole(role);

    // Validation
    if (!email || !password || !normalizedRole) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await storage.users.getByEmail(email);
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userRole = normalizeRole(user.role);

    // Check role
    if (userRole !== normalizedRole) {
      return Response.json(
        { error: 'Invalid role for this account' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id, userRole);

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole,
      },
    });
  } catch (error) {
    console.error('Signin route failed:', error);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
