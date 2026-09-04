export async function POST(request) {
  try {
    return Response.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
