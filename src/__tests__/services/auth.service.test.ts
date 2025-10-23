import {AuthService} from '../../services/auth.service';
import {Usuario} from '../../models';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
    beforeEach(async () => {
        // Crear usuario de prueba
        await Usuario.create({
            nombre: 'Test User',
            email: 'test@example.com',
            passwordHash: await bcrypt.hash('password123', 10),
            rol: 'vendedor'
        });
    });

    afterEach(async () => {
        await Usuario.destroy({where: {}});
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const result = await AuthService.login({email: 'test@example.com', password: 'password123'});

            expect(result).toBeDefined();
            expect(result.user).toBeDefined();
            expect(result.user.email).toBe('test@example.com');
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });

        it('should throw error with invalid email', async () => {
            await expect(AuthService.login({email: 'invalid@example.com', password: 'password123'}))
                .rejects.toThrow('Credenciales inválidas');
        });

        it('should throw error with invalid password', async () => {
            await expect(AuthService.login({email: 'test@example.com', password: 'wrongpassword'}))
                .rejects.toThrow('Credenciales inválidas');
        });
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                nombre: 'New User',
                email: 'newuser@example.com',
                password: 'password123',
                rol: 'vendedor' as const
            };

            const result = await AuthService.register(userData);

            expect(result).toBeDefined();
            expect(result.user.email).toBe('newuser@example.com');
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });

        it('should throw error if email already exists', async () => {
            const userData = {
                nombre: 'Duplicate User',
                email: 'test@example.com',
                password: 'password123',
                rol: 'vendedor' as const
            };

            await expect(AuthService.register(userData))
                .rejects.toThrow('Email ya registrado');
        });
    });

    describe('refreshToken', () => {
        it('should refresh token successfully', async () => {
            const loginResult = await AuthService.login({email: 'test@example.com', password: 'password123'});
            const refreshResult = await AuthService.refreshToken(loginResult.refreshToken);

            expect(refreshResult).toBeDefined();
            expect(refreshResult.accessToken).toBeDefined();
            expect(refreshResult.refreshToken).toBeDefined();
        });

        it('should throw error with invalid refresh token', async () => {
            await expect(AuthService.refreshToken('invalid-token'))
                .rejects.toThrow('Token de renovación inválido');
        });
    });
});
