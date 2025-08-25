import { Request } from 'express';

import { User } from '@modules/user/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
