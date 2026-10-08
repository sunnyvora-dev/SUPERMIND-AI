import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SuperMind AI development database...');

  // Hash demo user password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Create Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@supermind.ai' },
    update: {},
    create: {
      id: 'usr_supermind_101',
      name: 'Alex Developer',
      email: 'demo@supermind.ai',
      passwordHash,
      role: Role.USER,
      planTier: 'Pro',
      tokensUsed: 624000,
      tokenBudget: 5000000,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  // 2. Create Admin User
  await prisma.user.upsert({
    where: { email: 'admin@supermind.ai' },
    update: {},
    create: {
      id: 'usr_admin_102',
      name: 'SuperMind Administrator',
      email: 'admin@supermind.ai',
      passwordHash,
      role: Role.ADMIN,
      planTier: 'Enterprise',
      tokensUsed: 120000,
      tokenBudget: 100000000,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  // 3. Create Sample Conversation
  const conv = await prisma.conversation.create({
    data: {
      id: 'conv_1',
      userId: demoUser.id,
      title: 'Spring Boot 3 REST Authentication API',
      taskType: 'CODING',
      category: 'Coding',
      modelUsed: 'Claude 3.5 Sonnet',
      favorite: true,
      messages: {
        create: [
          {
            role: 'user',
            content: 'Write a clean Spring Boot 3 Security JWT configuration for user login.',
            messageType: 'TEXT',
          },
          {
            role: 'assistant',
            content: 'Here is the complete Spring Security 3 JWT configuration class adhering to stateless session policies:',
            messageType: 'CODE',
            model: 'Claude 3.5 Sonnet',
            latencyMs: 580,
            costUsd: 0.0024,
            qualityScore: 0.98,
            codeSnippet: JSON.stringify({
              language: 'java',
              code: `@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n  @Bean\n  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {\n    return http\n      .csrf(AbstractHttpConfigurer::disable)\n      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n      .authorizeHttpRequests(auth -> auth\n        .requestMatchers("/api/v1/auth/**").permitAll()\n        .anyRequest().authenticated()\n      )\n      .build();\n  }\n}`,
            }),
            supervisorTrace: JSON.stringify({
              intent: 'Coding',
              complexity: 'High',
              capabilities: ['Code Generation', 'Security Audit', 'Syntax Validation'],
              providers: ['Claude 3.5 Sonnet', 'GPT-4o'],
              status: 'Completed',
              latencyMs: 580,
              costUsd: 0.0024,
            }),
          },
        ],
      },
    },
  });

  console.log('Seeding complete! User created:', demoUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
