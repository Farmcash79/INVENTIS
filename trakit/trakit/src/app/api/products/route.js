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

    const products = await storage.products.getAll();
    return Response.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = getCurrentUser(request);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owners can create products
    if (user.role !== 'owner') {
      return Response.json(
        { error: 'Only owners can create products' },
        { status: 403 }
      );
    }

    const productData = await request.json();
    const product = await storage.products.create(productData);

    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
