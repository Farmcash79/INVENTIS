import { storage } from '@/lib/storage';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validation
    if (!name || !email || !password || !role) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (role !== 'owner' && role !== 'sales_rep') {
      return Response.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = storage.users.getByEmail(email);
    if (existingUser) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = storage.users.create({
      name,
      email,
      passwordHash,
      role,
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    // Return user data (without password)
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
