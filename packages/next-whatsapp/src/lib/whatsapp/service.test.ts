import { describe, it, expect, beforeEach, vi, MockedFunction } from 'vitest';
import { WhatsAppService } from './service';
import { getClient, initializeClient, startTracking, stopTracking, getStatus } from './client';
import qrcode from 'qrcode';

// Mock the client functions
vi.mock('./client', () => ({
    getClient: vi.fn(),
    initializeClient: vi.fn(),
    startTracking: vi.fn(),
    stopTracking: vi.fn(),
    getStatus: vi.fn(),
}));

// Mock qrcode
vi.mock('qrcode', () => ({
    __esModule: true,
    default: {
        toDataURL: vi.fn(),
    },
}));

const mockGetClient = getClient as MockedFunction<typeof getClient>;
const mockInitializeClient = initializeClient as MockedFunction<typeof initializeClient>;
const mockStartTracking = startTracking as MockedFunction<typeof startTracking>;
const mockStopTracking = stopTracking as MockedFunction<typeof stopTracking>;
const mockGetStatus = getStatus as MockedFunction<typeof getStatus>;
const mockQrToDataURL = qrcode.toDataURL as any;

describe('WhatsAppService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('connect', () => {
        it('should resolve with QR code data URL on qr event', async () => {
            const mockClient = {
                on: vi.fn(),
            };
            mockGetClient.mockReturnValue(mockClient as any);
            mockInitializeClient.mockResolvedValue(mockClient as any);
            mockQrToDataURL.mockResolvedValue('data:image/png;base64,...');

            const promise = WhatsAppService.connect();

            // Simulate qr event
            const qrCallback = mockClient.on.mock.calls.find(call => call[0] === 'qr')[1];
            qrCallback('qr-code-data');

            const result = await promise;
            expect(result).toBe('data:image/png;base64,...');
            expect(mockQrToDataURL).toHaveBeenCalledWith('qr-code-data');
        });

        it('should resolve with null on ready event', async () => {
            const mockClient = {
                on: vi.fn(),
            };
            mockGetClient.mockReturnValue(mockClient as any);
            mockInitializeClient.mockResolvedValue(mockClient as any);

            const promise = WhatsAppService.connect();

            // Simulate ready event
            const readyCallback = mockClient.on.mock.calls.find(call => call[0] === 'ready')[1];
            readyCallback();

            const result = await promise;
            expect(result).toBeNull();
        });

        it('should reject on auth_failure event', async () => {
            const mockClient = {
                on: vi.fn(),
            };
            mockGetClient.mockReturnValue(mockClient as any);
            mockInitializeClient.mockResolvedValue(mockClient as any);

            const promise = WhatsAppService.connect();

            // Simulate auth_failure event
            const authFailureCallback = mockClient.on.mock.calls.find(call => call[0] === 'auth_failure')[1];
            authFailureCallback('Auth failed');

            await expect(promise).rejects.toThrow('Authentication failed: Auth failed');
        });

        it('should reject on initializeClient error', async () => {
            const mockClient = {
                on: vi.fn(),
            };
            mockGetClient.mockReturnValue(mockClient as any);
            mockInitializeClient.mockRejectedValue(new Error('Init failed'));

            await expect(WhatsAppService.connect()).rejects.toThrow('Init failed');
        });

        it('should reject on qrcode error', async () => {
            const mockClient = {
                on: vi.fn(),
            };
            mockGetClient.mockReturnValue(mockClient as any);
            mockInitializeClient.mockResolvedValue(mockClient as any);
            mockQrToDataURL.mockRejectedValue(new Error('QR failed'));

            const promise = WhatsAppService.connect();

            // Simulate qr event
            const qrCallback = mockClient.on.mock.calls.find(call => call[0] === 'qr')[1];
            qrCallback('qr-code-data');

            await expect(promise).rejects.toThrow('QR failed');
        });
    });

    describe('startTracking', () => {
        it('should call startTracking with default interval', async () => {
            await WhatsAppService.startTracking();

            expect(mockStartTracking).toHaveBeenCalledWith(15);
        });

        it('should call startTracking with custom interval', async () => {
            await WhatsAppService.startTracking(30);

            expect(mockStartTracking).toHaveBeenCalledWith(30);
        });
    });

    describe('stopTracking', () => {
        it('should call stopTracking', () => {
            WhatsAppService.stopTracking();

            expect(mockStopTracking).toHaveBeenCalled();
        });
    });

    describe('getStatus', () => {
        it('should return the status from client', () => {
            const mockStatus = { connected: true, tracking: false };
            mockGetStatus.mockReturnValue(mockStatus);

            const result = WhatsAppService.getStatus();

            expect(result).toEqual(mockStatus);
            expect(mockGetStatus).toHaveBeenCalled();
        });
    });
});