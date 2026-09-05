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
    const updated = await storage.products.update(id, updates);

    if (!updated) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: updated });
  } catch (error) {
    console.error('Product update failed:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'owner') {
      return Response.json({ error: 'Only owners can delete products' }, { status: 403 });
    }

    const { id } = await params;
    const deleted = await storage.products.delete(id);

    if (!deleted) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Product delete failed:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
