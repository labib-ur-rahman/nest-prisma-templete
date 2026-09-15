import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    ThrottleLogin,
    ThrottleRefreshToken,
    ThrottleRegister,
} from '../../../common/decorators/throttle.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('(Auth) Account')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ThrottleRegister()
    @ApiOperation({ summary: 'Register user basic information' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ThrottleLogin()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verify login credentials and send login OTP or direct login',
    })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh-token')
    @ThrottleRefreshToken()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get new access token using refresh token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refreshToken(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user and invalidate refresh token' })
    @ApiResponse({ status: 200, description: 'User successfully logged out' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async logout(@CurrentUser() user: any) {
        return this.authService.logout(user.id);
    }
}