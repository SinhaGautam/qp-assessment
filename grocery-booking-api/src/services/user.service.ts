import { AppDataSource } from '../config/db';
import { Users } from '../entities/User.entity';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

export class UserService {
  private userRepository = AppDataSource.getRepository(Users);

  async createUser(email: string, password: string, role: string = 'user') {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role
    });
    logger.info(`Creating user: ${email} with role: ${role}`);

    return await this.userRepository.save(user);
  }

  async authenticateUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user){
        logger.error('User not found: '+ email);
        return null;
      } 
     
      const isPasswordValid = user.password ? await bcrypt.compare(password, user.password) : false;
      if (!isPasswordValid){
        logger.error('Invalid password for user: '+ email);
        return null;
      }
      logger.info('User authenticated successfully: '+ email);
      return user;

    } catch (error) {
      logger.error('Error during authentication: ' + error);
      return null;
    }
  }
}
