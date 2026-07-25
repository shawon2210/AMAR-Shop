const { proxy } = require('../proxy');
const { NextRequest } = require('next/server');

jest.mock('../lib/auth/jwt', () => ({
  verifyToken: jest.fn(),
}));

const { verifyToken } = jest.requireMock('../lib/auth/jwt');

describe('proxy auth gate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows ADMIN through /admin when a valid token exists', async () => {
    verifyToken.mockResolvedValue({ sub: '1', role: 'ADMIN', phone: '123' });

    const req = new NextRequest('http://localhost:3000/admin');
    req.cookies.set('accessToken', 'valid-token');

    const res = await proxy(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('x-user-role')).toBe('ADMIN');
  });

  it('redirects to /unauthorized for a CUSTOMER on /admin', async () => {
    verifyToken.mockResolvedValue({ sub: '1', role: 'CUSTOMER', phone: '123' });

    const req = new NextRequest('http://localhost:3000/admin');
    req.cookies.set('accessToken', 'valid-token');

    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/unauthorized');
  });
});
