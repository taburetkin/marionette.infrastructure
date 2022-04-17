import { _, BbView, buildEntity, normalizeBuildOptions } from '../vendors/index.js';


export function buildView(arg, context, options, defOptions, defClass)
{
    if (arg instanceof BbView || arg == null)
        return arg;

    arg = normalizeBuildOptions(arg, context, context);

    if (arg == null) {
        return;
    }

    let buildOptions = _.extend({ class: defClass }, defOptions, arg, options);

    if (!buildOptions.class) {
        throw new Error('class not defined');
    }

    return buildEntity(buildOptions);

}