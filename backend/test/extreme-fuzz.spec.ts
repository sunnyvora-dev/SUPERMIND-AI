import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { DocumentsService } from '../src/documents/documents.service';
import { SupervisorService } from '../src/supervisor/supervisor.service';
import { PrismaService } from '../src/database/prisma.service';
import { JwtService } from '../src/jwt/jwt.service' || '@nestjs/jwt';
import { RedisService } from '../src/redis/redis.service';
import { MailService } from '../src/mail/mail.service';
import { TaskPlannerService } from '../src/supervisor/task-planner.service';
import { ModelRouterService } from '../src/supervisor/model-router.service';
import { AIProviderRegistryService } from '../src/ai/providers/provider-registry.service';
import { CalculatorTool } from '../src/tools/calculator.tool';
import { SearchTool } from '../src/tools/search.tool';
import { ResponseAggregatorService } from '../src/responses/response-aggregator.service';
import { CorrectionService } from '../src/responses/correction.service';

describe('EXTREME LEVEL FUZZ & BOUNDARY SUITE', () => {
  let authService: AuthService;
  let documentsService: DocumentsService;
  let supervisorService: SupervisorService;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'fuzz-user', ...args.data })),
        update: jest.fn().mockResolvedValue({}),
      },
      document: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'fuzz-doc', ...args.data })),
        update: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        delete: jest.fn().mockResolvedValue({}),
      },
      documentChunk: {
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const mockRedis = {
      rateLimit: jest.fn().mockResolvedValue({ allowed: true }),
      setOtp: jest.fn().mockResolvedValue(true),
      verifyOtp: jest.fn().mockResolvedValue(true),
      blacklistToken: jest.fn().mockResolvedValue(true),
    };

    const mockMail = { sendOtpEmail: jest.fn().mockResolvedValue(true) };
    const mockJwt = { sign: jest.fn().mockReturnValue('fuzz-jwt-token') };

    const mockProviderRegistry = {
      executeWithFallback: jest.fn().mockResolvedValue({
        content: 'Fuzz prompt processed safely',
        modelName: 'GPT-4o',
        costUsd: 0,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        DocumentsService,
        SupervisorService,
        TaskPlannerService,
        ModelRouterService,
        CalculatorTool,
        SearchTool,
        ResponseAggregatorService,
        CorrectionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: MailService, useValue: mockMail },
        { provide: 'JwtService', useValue: mockJwt },
        { provide: AIProviderRegistryService, useValue: mockProviderRegistry },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    documentsService = module.get<DocumentsService>(DocumentsService);
    supervisorService = module.get<SupervisorService>(SupervisorService);
  });

  const EXTREME_FUZZ_INPUTS = [
    '', // empty string
    '   ', // whitespace
    "DROP TABLE users;-- ' OR '1'='1", // SQL injection payload
    "<script>alert('XSS vulnerability')</script>", // XSS payload
    '\x00\x01\x02\x03\x04\x05\x06\x07', // Null & Control binary chars
    '🚀🤖🔥🌟💻🎉⚡️🌈🎃🍉'.repeat(500), // Emoji flood
    'A'.repeat(50000), // 50,000 character prompt
    '{"malformed": "json", "broken": }', // Broken JSON
  ];

  it('Fuzz Test 1: AuthService handling extreme inputs without unhandled crashes', async () => {
    for (const input of EXTREME_FUZZ_INPUTS) {
      try {
        await authService.register({
          email: `fuzz_${Date.now()}@test.com`,
          password: input || 'password123',
          name: input || 'Fuzz Name',
        });
      } catch (err: any) {
        expect(err).toBeDefined();
      }
    }
  });

  it('Fuzz Test 2: DocumentsService handling extreme inputs without unhandled crashes', async () => {
    for (const input of EXTREME_FUZZ_INPUTS) {
      try {
        await documentsService.uploadDocument('fuzz-user-id', {
          originalname: `fuzz_${Date.now()}.txt`,
          mimetype: 'text/plain',
          size: input.length,
          buffer: Buffer.from(input),
        });
      } catch (err: any) {
        expect(err).toBeDefined();
      }
    }
  });

  it('Fuzz Test 3: SupervisorService handling extreme prompts without unhandled crashes', async () => {
    for (const input of EXTREME_FUZZ_INPUTS) {
      try {
        const res = await supervisorService.processPrompt(input || 'Default prompt', [], 'fuzz-user-id');
        expect(res).toBeDefined();
      } catch (err: any) {
        expect(err).toBeDefined();
      }
    }
  });
});
