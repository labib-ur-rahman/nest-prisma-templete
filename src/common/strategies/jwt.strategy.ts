import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: (configService.get<string>('jwt.accessSecret')) as string,
        });
    }

    async validate(payload: any) {
        const logoutTime = await this.redisService.get(`user_logout:${payload.sub}`);
        if (logoutTime && payload.iat * 1000 < parseInt(logoutTime)) {
            throw new UnauthorizedException('Token has been revoked');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}