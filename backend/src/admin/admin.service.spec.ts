import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { AIProviderRegistryService } from '../ai/providers/provider-registry.service';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;

  const mockPrisma = {
    $executeRawUnsafe: jest.fn().mockResolvedValue(1),
    $queryRawUnsafe: jest.fn().mockResolvedValue([]),
    user: {
      count: jest.fn().mockResolvedValue(10),
      findMany: jest.fn().mockResolvedValue([
        { id: 'u1', email: 'admin@supermind.ai', name: 'Admin', role: 'ADMIN', plan: 'PRO', isSuspended: false },
      ]),
      findUnique: jest.fn().mockResolvedValue({ id: 'u1', email: 'admin@supermind.ai', role: 'ADMIN' }),
      update: jest.fn().mockResolvedValue({ id: 'u1', role: 'SUPER_ADMIN' }),
      groupBy: jest.fn().mockResolvedValue([
        { tier: 'PRO', _count: { id: 5 } },
        { tier: 'FREE_TRIAL', _count: { id: 5 } },
        { role: 'ADMIN', _count: { id: 2 } },
        { role: 'USER', _count: { id: 8 } },
      ]),
    },
    conversation: {
      count: jest.fn().mockResolvedValue(25),
    },
    message: {
      count: jest.fn().mockResolvedValue(100),
    },
    usageRecord: {
      count: jest.fn().mockResolvedValue(50),
      aggregate: jest.fn().mockResolvedValue({
        _sum: { totalTokens: 10000, inputTokens: 4000, outputTokens: 6000, costUsd: 0.15 },
        _avg: { latencyMs: 250 },
      }),
      groupBy: jest.fn().mockResolvedValue([
        { model: 'anthropic/claude-3-7-sonnet', _count: { id: 20 }, _sum: { totalTokens: 5000, costUsd: 0.08 } },
      ]),
      findMany: jest.fn().mockResolvedValue([]),
    },
    subscription: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockProviderRegistry = {
    getProviders: jest.fn().mockReturnValue([
      { id: 'anthropic', name: 'Anthropic', isConfigured: true, models: [] },
      { id: 'openai', name: 'OpenAI', isConfigured: true, models: [] },
    ]),
  };

  const mockRedisService = {
    rateLimit: jest.fn().mockResolvedValue({ allowed: true, remaining: 3 }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_admin_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AIProviderRegistryService, useValue: mockProviderRegistry },
        { provide: RedisService, useValue: mockRedisService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return overview metrics', async () => {
    const overview = await service.getOverview(30);
    expect(overview).toBeDefined();
    expect(overview.users.total).toBe(10);
    expect(overview.aiUsage.totalTokens).toBe(10000);
  });

  it('should return users list with pagination', async () => {
    const result = await service.getUsers({ page: 1, limit: 10 });
    expect(result.users).toHaveLength(1);
    expect(result.pagination.total).toBe(10);
  });

  it('should return models list', async () => {
    const models = await service.getModels();
    expect(Array.isArray(models)).toBe(true);
  });

  it('should return providers list', async () => {
    const providers = await service.getProviders();
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should return system health', async () => {
    const health = await service.getSystemHealth();
    expect(health).toHaveProperty('status');
  });
});
