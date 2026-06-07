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

    const stockData = storage.stockControl.getAll();
    return Response.json({
      success: true,
      data: stockData,
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

    // Both owners and sales reps can add stock
    if (user.role !== 'owner' && user.role !== 'sales_rep') {
      return Response.json(
        { error: 'Unauthorized role' },
        { status: 403 }
      );
    }

    const stockData = await request.json();
    const newStock = storage.stockControl.create(stockData);

    return Response.json({
      success: true,
      data: newStock,
    });
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
