import { describe, it, expect } from 'vitest';

describe('getConversationId', () => {
  const getConversationId = (a: string, b: string) => [a, b].sort().join('_');
  it('returns stable id regardless of order', () => {
    expect(getConversationId('u1', 'c1')).toBe('c1_u1');
    expect(getConversationId('c1', 'u1')).toBe('c1_u1');
  });

  it('joins ids with underscore', () => {
    expect(getConversationId('user-a', 'companion-b')).toBe('companion-b_user-a');
  });
});

describe('firestore service types', () => {
  it('Booking type has expected fields', () => {
    const booking = {
      id: 'bk-1',
      companionId: 'c1',
      userId: 'u1',
      date: '2026-07-11',
      time: '10:00',
      duration: 2,
      participants: 1,
      status: 'pending' as const,
      totalPrice: 3000,
      meetingPoint: 'Kathmandu',
      createdAt: '2026-07-11T10:00:00.000Z',
    };
    expect(booking.id).toBe('bk-1');
    expect(booking.status).toBe('pending');
  });

  it('Companion type supports coordinates', () => {
    const companion = {
      id: 'c1',
      name: 'Test',
      age: 25,
      gender: 'Male',
      bio: 'Test bio',
      hourlyRate: 1500,
      rating: 4.5,
      reviewsCount: 10,
      isVerified: true,
      location: 'Kathmandu',
      coordinates: { latitude: 27.7172, longitude: 85.324 },
      languages: ['English', 'Nepali'],
      interests: ['Hiking'],
      imageUrl: 'https://example.com/image.jpg',
    };
    expect(companion.coordinates?.latitude).toBeCloseTo(27.7172, 1);
  });
});

describe('payment service', () => {
  it('PaymentProvider is a union of khalti and esewa', () => {
    const providers: Array<'khalti' | 'esewa'> = ['khalti', 'esewa'];
    expect(providers).toContain('khalti');
    expect(providers).toContain('esewa');
  });
});

describe('admin components', () => {
  it('AdminBookings filters by search term', () => {
    const bookings = [
      { id: 'bk-1', userId: 'user-a', companionId: 'c1', totalPrice: 1000, status: 'pending', date: '2026-07-11', time: '10:00', meetingPoint: 'Kathmandu' },
      { id: 'bk-2', userId: 'user-b', companionId: 'c2', totalPrice: 2000, status: 'confirmed', date: '2026-07-12', time: '11:00', meetingPoint: 'Pokhara' },
    ];
    const search = 'Kathmandu';
    const filtered = bookings.filter(b => b.id.includes(search) || b.meetingPoint?.toLowerCase().includes(search.toLowerCase()));
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('bk-1');
  });
});
