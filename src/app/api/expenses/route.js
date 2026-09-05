import { storage } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expenses = await storage.expenses.getAll();
    return Response.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Expenses list failed:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const amount = Number(body.amount);

    if (!body.description || !body.date || !Number.isFinite(amount) || amount <= 0) {
      return Response.json({ error: 'Invalid expense data' }, { status: 400 });
    }

    const expense = await storage.expenses.create({
      description: body.description,
      category: body.category || 'Operations',
      amount,
      date: body.date,
      addedByRole: user.role,
    });

    return Response.json({ success: true, data: expense });
  } catch (error) {
    console.error('Expense create failed:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
