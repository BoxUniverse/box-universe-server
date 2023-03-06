// @index(['./**/*.ts','!./*.spec.ts'], f => `export * from '${f.path}'`)

export * from './conversations.schema';
export * from './dto/conversation.input';
export * from './conversations.repository';
export * from './conversations.service';
export * from './conversations.gateway';
export * from './conversations.processor';
export * from './conversations.resolver';
export * from './conversations.module';
// @endindex
