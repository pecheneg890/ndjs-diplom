import { SetMetadata } from '@nestjs/common';
import { Role } from '../user/schemas/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (role: Role[]) => SetMetadata(ROLES_KEY, role);
