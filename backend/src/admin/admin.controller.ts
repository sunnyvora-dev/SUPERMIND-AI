import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // -------------------------------------------------------------
  // 1. DASHBOARD & OVERVIEW
  // -------------------------------------------------------------
  @Get('overview')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'FINANCE', 'VIEWER')
  @ApiOperation({ summary: 'Get operational KPI overview' })
  async getOverview(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.adminService.getOverview(daysNum);
  }

  // -------------------------------------------------------------
  // 2. USER MANAGEMENT
  // -------------------------------------------------------------
  @Get('users')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  @ApiOperation({ summary: 'List and search platform users' })
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('tier') tier?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.adminService.getUsers({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      role,
      tier,
      sortBy,
      sortOrder,
    });
  }

  @Get('users/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  @ApiOperation({ summary: 'Get user details by ID' })
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Patch('users/:id/role')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update user authorization role' })
  async updateUserRole(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(req.user, targetUserId, role);
  }

  @Patch('users/:id/tier')
  @Roles('SUPER_ADMIN', 'ADMIN', 'FINANCE')
  @ApiOperation({ summary: 'Update user subscription tier' })
  async updateUserTier(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body('tier') tier: string,
  ) {
    return this.adminService.updateUserTier(req.user, targetUserId, tier);
  }

  @Patch('users/:id/status')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Suspend or reactivate user account' })
  async toggleUserStatus(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body('action') action: 'suspend' | 'activate',
  ) {
    return this.adminService.toggleUserStatus(req.user, targetUserId, action);
  }

  // -------------------------------------------------------------
  // 3. AI MODELS
  // -------------------------------------------------------------
  @Get('models')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'FINANCE', 'VIEWER')
  @ApiOperation({ summary: 'List available AI foundation models' })
  async getModels() {
    return this.adminService.getModels();
  }

  @Patch('models/toggle')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Enable or disable an AI foundation model by ID in body' })
  async toggleModelByBody(
    @Req() req: any,
    @Body('modelId') modelId: string,
    @Body('isEnabled') isEnabled: boolean,
    @Body('enabled') enabled?: boolean,
  ) {
    return this.adminService.toggleModelStatus(req.user, modelId, isEnabled ?? enabled ?? true);
  }

  @Patch('models/:id/status')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Enable or disable an AI foundation model' })
  async toggleModelStatus(
    @Req() req: any,
    @Param('id') modelId: string,
    @Body('enabled') enabled?: boolean,
    @Body('isEnabled') isEnabled?: boolean,
  ) {
    return this.adminService.toggleModelStatus(req.user, decodeURIComponent(modelId), isEnabled ?? enabled ?? true);
  }

  // -------------------------------------------------------------
  // 4. AI PROVIDERS
  // -------------------------------------------------------------
  @Get('providers')
  @Roles('SUPER_ADMIN', 'ADMIN', 'VIEWER')
  @ApiOperation({ summary: 'Inspect foundation provider gateway telemetry' })
  async getProviders() {
    return this.adminService.getProviders();
  }

  // -------------------------------------------------------------
  // 5. API USAGE TELEMETRY
  // -------------------------------------------------------------
  @Get('api-usage')
  @Roles('SUPER_ADMIN', 'ADMIN', 'VIEWER')
  @ApiOperation({ summary: 'Inspect multi-LLM dispatch logs and token spend' })
  async getApiUsage(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('provider') provider?: string,
    @Query('model') model?: string,
  ) {
    return this.adminService.getApiUsage({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 15,
      provider,
      model,
    });
  }

  // -------------------------------------------------------------
  // 6. SYSTEM HEALTH
  // -------------------------------------------------------------
  @Get('system-health')
  @Roles('SUPER_ADMIN', 'ADMIN', 'VIEWER')
  @ApiOperation({ summary: 'Inspect cluster health and database latency' })
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  // -------------------------------------------------------------
  // 7. AUDIT LOGS
  // -------------------------------------------------------------
  @Get('audit-logs')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Retrieve server audit ledger' })
  async getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAuditLogs({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  // -------------------------------------------------------------
  // 8. BILLING & FINANCIALS
  // -------------------------------------------------------------
  @Get('billing')
  @Roles('SUPER_ADMIN', 'ADMIN', 'FINANCE')
  @ApiOperation({ summary: 'Inspect subscription tiers and revenue' })
  async getBillingOverview() {
    return this.adminService.getBillingOverview();
  }

  // -------------------------------------------------------------
  // 9. PLATFORM SETTINGS
  // -------------------------------------------------------------
  @Get('settings')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get administrative platform settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update administrative platform settings' })
  async updateSettings(@Req() req: any, @Body() newSettings: any) {
    return this.adminService.updateSettings(req.user, newSettings);
  }
}
