import {readdirSync, removeSync} from 'fs-extra'
import path from 'path'
import {Project} from 'ts-morph';

const targetPath = path.resolve(__dirname, '../output/index.ts')
const sourcePaths = readdirSync(path.resolve(__dirname, './source'))

const main = async () => {
    removeSync(targetPath);

    const project = new Project({
        tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
        skipAddingFilesFromTsConfig: true,
    });

    project.addSourceFilesAtPaths('src/source/*.ts');

    const indexFile = project.createSourceFile(targetPath, {
        statements: [],
    });

    project.getSourceFiles().forEach((sourceFile, index) => {
        const fileName = path.basename(sourceFile.getBaseName(), '.ts')
        const routerParamsInterface = sourceFile.getInterface('RouterParams');
        if (!routerParamsInterface) return
        // console.log(fileName, '2333')

        const exportPageNameStatement = sourceFile.getExportSymbols().find(item => item.getName() === 'pageName')

        const pageName = (exportPageNameStatement?.getValueDeclaration()?.getType().getText() ?? '"默认页面名"').slice(1, -1)

        const newInterfaceItem = indexFile.addInterface({
            name: fileName,
            docs: [
                {
                    description: pageName,
                },
            ],
            properties: routerParamsInterface.getProperties().map(item => {
                return {
                    name: item.getName(),
                    type: item.getTypeNode()?.getText(),
                    docs: item.getJsDocs().map(doc => {
                        return {
                            description: doc.getDescription(),
                            tags: doc.getTags().map(tag => {
                                return {
                                    tagName: tag.getTagName(),
                                    text: tag.getText(),
                                }
                            })
                        }
                    })
                }
            })
        })
    });

    const allInterfaces = indexFile.getInterfaces()

    const routerParamsMappingInterface = indexFile.addInterface({
        name: 'RouterParamsMapping',
        docs: [
            {
                description: '路由参数映射',
            },
        ],
        properties: allInterfaces.map(v => {
            return {
                name: v.getName(),
                type: v.getName(),
            }
        }),
    });

    project.saveSync()
}


main()
