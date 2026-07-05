import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sae-jwt-super-secret-key-123456';

export function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(req) {
  try {
    // Check Authorization header first
    const authHeader = req.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Check cookies
      const cookieHeader = req.headers.get('cookie') || '';
      const tokenCookie = cookieHeader
        .split(';')
        .find((c) => c.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }

    if (!token) return null;

    return verifyToken(token);
  } catch (e) {
    return null;
  }
}
