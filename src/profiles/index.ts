// @index(['./**/*.ts','!./*.spec.ts'], f => `export * from '${f.path}'`)
export * from './profiles.schema';
export * from './dto/profile.input';
export * from './profiles.repository';
export * from './profiles.service';
export * from './profiles.gateway';
export * from './profiles.processor';
export * from './profiles.resolver';
export * from './profiles.module';
// @endindex
