import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue({ accessToken: 'token', user: { id: '1' } }),
      login: jest.fn().mockResolvedValue({ accessToken: 'token', user: { id: '1' } }),
      sendOtp: jest.fn().mockResolvedValue({ success: true, code: '123456', message: 'Sent' }),
      verifyOtp: jest.fn().mockResolvedValue({ valid: true }),
      resetPassword: jest.fn().mockResolvedValue({ success: true }),
      logout: jest.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call register on service', async () => {
    const dto = { email: 'a@b.com', password: 'pass', name: 'A B' };
    const res = await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(res.accessToken).toBe('token');
  });

  it('should call login on service', async () => {
    const dto = { email: 'a@b.com', password: 'pass' };
    const res = await controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(res.accessToken).toBe('token');
  });

  it('should call sendOtp', async () => {
    await controller.sendOtp({ email: 'a@b.com', purpose: 'login' });
    expect(authService.sendOtp).toHaveBeenCalledWith('a@b.com', 'login');
  });

  it('should call verifyOtp', async () => {
    await controller.verifyOtp({ email: 'a@b.com', code: '123456' });
    expect(authService.verifyOtp).toHaveBeenCalledWith('a@b.com', '123456');
  });

  it('should call resetPassword', async () => {
    await controller.resetPassword({ email: 'a@b.com', code: '123456', newPassword: 'new' });
    expect(authService.resetPassword).toHaveBeenCalledWith('a@b.com', '123456', 'new');
  });

  it('should extract Bearer token and call logout', async () => {
    await controller.logout('Bearer my-jwt-token');
    expect(authService.logout).toHaveBeenCalledWith('my-jwt-token');
  });
});
