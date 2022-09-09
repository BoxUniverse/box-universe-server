import { User } from '../users.schema';

export type UserOAuth = User & { provider: string; id: string };
