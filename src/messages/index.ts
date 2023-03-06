// @index(['./**/*.ts','!./*.spec.ts'], f => `export * from '${f.path}'`)

export * from './messages.schema';
export * from './dto/messages.input';
export * from './messages.gateway';
export * from './messages.repository';
export * from './messages.service';
export * from './messages.resolver';
export * from './messages.module';
// @endindex
