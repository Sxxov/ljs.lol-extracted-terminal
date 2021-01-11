/* eslint-disable import/no-extraneous-dependencies */
import { createFilter } from 'rollup-pluginutils';
import path from 'path';
import marked from 'marked';
import { readFileSync } from 'fs';
const STYLE = readFileSync('./build/rollup-plugin-mdx/github-markdown.css').toString()
    + readFileSync('./build/rollup-plugin-mdx/theme.css').toString();
class MDX {
    static postprocess(string) {
        return MDX.process(string, MDX.POSTPROCESSORS);
    }
    static preprocess(string) {
        return MDX.process(string, MDX.PREPROCESSORS);
    }
    static process(string, processors) {
        let processedString = string;
        Object.keys(processors).forEach((key) => {
            const preprocessor = processors[key];
            processedString = preprocessor(processedString);
        });
        return processedString;
    }
    static getImageSrcImports(string) {
        const imports = [];
        // console.log(imports);
        const processedString = string.split('src="').map((stringPart, i) => {
            if (i === 0) {
                return stringPart;
            }
            const srcMatches = stringPart.match(/.+?.jpg(?=")/g);
            if (!srcMatches) {
                return stringPart;
            }
            const src = srcMatches[0];
            const importName = `img${i}`;
            imports.push({ name: importName, src });
            const stringPartWithoutSrc = stringPart.substr(stringPart.indexOf('"') + 1);
            // console.log(stringPart, i, imports[imports.length - 1]);
            return `src="\${${importName}}"${stringPartWithoutSrc}`;
        }).join('');
        const importStatements = imports.map((importPart) => `import ${importPart
            .name} from '${importPart
            .src
            .replace(/'/g, '\\\'')}';`);
        return {
            processedString,
            importStatements,
        };
    }
    static plugin(options = {}) {
        const filter = createFilter(options.include, options.exclude);
        return {
            name: 'rollup-plugin-mdx',
            transform(code, id) {
                if (!filter(id)) {
                    return null;
                }
                const extension = path.extname(id);
                if (extension !== '.mdx') {
                    return null;
                }
                const html = MDX.postprocess(marked(MDX.preprocess(code)));
                const returnCodeString = (() => {
                    const { processedString, importStatements } = MDX.getImageSrcImports(html);
                    return `${importStatements.join('\n')} export default \`<mdx>${processedString}</mdx><style>${STYLE.replace(/[\n\t]/g, '')}</style>\``;
                })();
                // const exportFromModule = JSON.stringify({
                // 	html,
                // 	filename: path.basename(id),
                // 	path: id,
                // });
                // console.log(returnCodeString);
                return {
                    // code: `export default \`<mdx>${
                    // 	html
                    // }</mdx><style>${
                    // 	STYLE.replace(/[\n\t]/g, '')
                    // }</style>\``,
                    code: returnCodeString,
                    map: { mappings: '' },
                };
            },
        };
    }
}
MDX.PREPROCESSORS = {
    x(md) {
        const parts = md
            .trim()
            .split('\n');
        const processedParts = parts.filter((part) => {
            if (part[0] !== '/') {
                return false;
            }
            return true;
        });
        const tag = 'x';
        if (processedParts.length === 1) {
            return md;
        }
        let parsed = '';
        parts.forEach((part, i) => {
            let processedTag = tag;
            let processedPart = part;
            if (processedPart[0] === '!'
                && processedPart[1] === '/') {
                parsed += `\n</${tag}>`;
                parsed += '\n';
                return;
            }
            if (processedPart[0] !== '/') {
                parsed += part;
                parsed += '\n';
                return;
            }
            if (processedPart[1] === '{') {
                const classes = processedPart
                    .split('}')[0]
                    .substr(2);
                processedTag += ` class="${classes}"`;
                processedPart = processedPart.substr(processedPart.indexOf('}') + 1);
            }
            switch (true) {
                case parsed === '': {
                    parsed += `<${processedTag}>\n`;
                    break;
                }
                case i === parts.length - 1: {
                    parsed += `\n</${tag}>`;
                    break;
                }
                default: {
                    parsed += `\n</${tag}>\n<${processedTag}>\n`;
                    break;
                }
            }
            parsed += '\n';
        });
        return parsed;
    },
    br(md) {
        const parts = md
            .trim()
            .split('\n');
        const processedParts = parts.filter((part) => {
            if (part[0] !== '_') {
                return false;
            }
            return true;
        });
        const tag = 'bruh';
        if (processedParts.length === 1) {
            return md;
        }
        let parsed = '';
        parts.forEach((part) => {
            const processedTag = tag;
            const processedPart = part;
            if (processedPart[0] !== '_') {
                parsed += part;
                parsed += '\n';
                return;
            }
            parsed += `<${processedTag}></${tag}>`;
            parsed += '\n';
        });
        return parsed;
    },
};
MDX.POSTPROCESSORS = {
    heading(md) {
        return md.replace(/h1/g, 'heading');
    },
    string(md) {
        return md
            .replace(/<p>/g, '<string>')
            .replace(/<\/p>/g, '</string>');
    },
    liString(md) {
        return md
            .replace(/<li>/g, '<li><string>')
            .replace(/<\/li>/g, '</string></li>');
    },
    tab(md) {
        return md.replace(/ {4}/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    },
};
export default MDX.plugin;
//# sourceMappingURL=rollup-plugin-mdx.js.map