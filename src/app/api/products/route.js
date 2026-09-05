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

    // Owners can create products with full pricing. Sales reps can also add
    // a new item to stock (per the app's design — reps record stock and
    // sales), but their price fields are ignored server-side; pricing is
    // the owner's job and defaults to $0 until the owner sets it.
    const productData = await request.json();
    if (user.role !== 'owner') {
      productData.buyPrice = '$0';
      productData.sellPrice = '$0';
    }

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
