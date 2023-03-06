// @index(['./**/*.ts','!./*.spec.ts'], f => `export * from '${f.path}'`)
export * from './posts.schema';
export * from './dto/posts.input';
export * from './posts.repository';
export * from './posts.service';
export * from './posts.gateway';
export * from './posts.resolver';
export * from './posts.module';
// @endindex
