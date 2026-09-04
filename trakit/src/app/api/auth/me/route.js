import { storage } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getCurrentUser(request);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userData = await storage.users.getById(user.userId);
    if (!userData) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
