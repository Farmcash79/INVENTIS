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

    const receipts = storage.eReceipts.getAll();
    return Response.json({
      success: true,
      data: receipts,
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

    // Both owners and sales reps can create receipts
    if (user.role !== 'owner' && user.role !== 'sales_rep') {
      return Response.json(
        { error: 'Unauthorized role' },
        { status: 403 }
      );
    }

    const receiptData = await request.json();

    // Validate receipt data
    if (!receiptData.customerName || !receiptData.customerPhone || !receiptData.items || receiptData.items.length === 0) {
      return Response.json(
        { error: 'Invalid receipt data' },
        { status: 400 }
      );
    }

    // For sales reps, validate category restrictions
    if (user.role === 'sales_rep') {
      const allowedCategories = ['Computing', 'Accessories', 'Electronics'];
      const hasInvalidCategory = receiptData.items.some(
        item => !allowedCategories.includes(item.category)
      );

      if (hasInvalidCategory) {
        return Response.json(
          { error: 'Sales rep can only use: Computing, Accessories, Electronics' },
          { status: 403 }
        );
      }
    }

    const receipt = storage.eReceipts.create({
      ...receiptData,
      createdBy: user.userId,
      createdByRole: user.role,
    });

    return Response.json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
