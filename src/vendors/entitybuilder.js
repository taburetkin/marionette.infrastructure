import { build, addKnownCtor, invokeValue, normalizeBuildOptions } from 'yaff-entitybuilder';
import { BbView } from './backbone';

// adding backbone view to known ctros store
addKnownCtor(BbView);

export {
    build as buildEntity,
    invokeValue,
    normalizeBuildOptions
}