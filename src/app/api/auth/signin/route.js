import { storage } from '@/lib/storage';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    // Validation
    if (!email || !password || !role) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = storage.users.getByEmail(email);
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check role
    if (user.role !== role) {
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
    const token = generateToken(user.id, user.role);

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
