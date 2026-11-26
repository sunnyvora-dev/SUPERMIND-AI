const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'FINANCE', 'VIEWER', 'USER'];

async function main() {
  const emailArg = process.argv[2];
  const roleArg = (process.argv[3] || 'ADMIN').toUpperCase();

  if (!emailArg || emailArg === '--help' || emailArg === '-h') {
    console.log(`
=====================================================
 SUPERMIND AI - ADMINISTRATIVE USER ROLE ASSIGNMENT
=====================================================
Usage:
  node scripts/make-admin.js <email> [role]

Supported Roles:
  SUPER_ADMIN  - Complete platform governance & root controls
  ADMIN        - Platform operations, model routing & user mgmt
  SUPPORT      - Help desk, user account assistance
  FINANCE      - Billing, subscriptions, revenue metrics
  VIEWER       - Read-only analytics & system health
  USER         - Standard subscriber account

Examples:
  node scripts/make-admin.js owner@company.com SUPER_ADMIN
  node scripts/make-admin.js ops@company.com ADMIN
=====================================================
`);
    process.exit(0);
  }

  const cleanEmail = emailArg.trim().toLowerCase();

  if (!VALID_ROLES.includes(roleArg)) {
    console.error(`\n[ERROR] Invalid role "${roleArg}".`);
    console.error(`Permitted roles: ${VALID_ROLES.join(', ')}\n`);
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      console.error(`\n[ERROR] User with email "${cleanEmail}" was not found in the database.`);
      console.error('Please ensure the user has registered first, or create their account.\n');

      // List recent users to be helpful
      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { email: true, name: true, role: true },
      });

      console.log('Recent registered users:');
      recentUsers.forEach(u => console.log(`  - ${u.email} (Role: ${u.role})`));
      console.log('');
      process.exit(1);
    }

    const previousRole = user.role;

    const updatedUser = await prisma.user.update({
      where: { email: cleanEmail },
      data: { role: roleArg },
      select: { id: true, email: true, name: true, role: true, tier: true, createdAt: true },
    });

    // Record in audit log
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO audit_logs (id, user_id, user_email, action, resource, resource_id, details, ip_address, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, NOW())`,
        `aud_${Date.now()}_cli`,
        'CLI_CONSOLE',
        'cli_root',
        'ROLE_CHANGE_CLI',
        'user_account',
        updatedUser.id,
        JSON.stringify({ previousRole, newRole: roleArg, promotedBy: 'server_terminal' }),
        '127.0.0.1'
      );
    } catch (e) {
      // Audit log table might be optional
    }

    console.log(`
=====================================================
 [SUCCESS] USER ROLE UPDATED SUCCESSFULLY
=====================================================
  User ID   : ${updatedUser.id}
  Name      : ${updatedUser.name || 'N/A'}
  Email     : ${updatedUser.email}
  Old Role  : ${previousRole}
  New Role  : ${updatedUser.role}
  Tier      : ${updatedUser.tier}
=====================================================
Access Credentials:
  - Gateway  : http://localhost:5173/admin/login
  - Identity : ${updatedUser.email}
=====================================================
`);
  } catch (error) {
    console.error('\n[ERROR] Failed to update role:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
