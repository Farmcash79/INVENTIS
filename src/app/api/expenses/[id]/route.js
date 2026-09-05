import { storage } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();
    if (updates.amount !== undefined) {
      updates.amount = Number(updates.amount);
    }

    const updated = await storage.expenses.update(id, updates);
    if (!updated) {
      return Response.json({ error: 'Expense not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: updated });
  } catch (error) {
    console.error('Expense update failed:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await storage.expenses.delete(id);

    if (!deleted) {
      return Response.json({ error: 'Expense not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Expense delete failed:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
