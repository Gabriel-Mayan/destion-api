const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Você deve informar o nome do módulo. Ex: node generate-module.js vehicle');
  process.exit(1);
}

const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const dir = path.join(__dirname, '../../src/app', 'modules', moduleName);
const entitiesDir = path.join(dir, 'entities');

// Cria diretório
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(entitiesDir, { recursive: true });

// Templates
const files = {
  [`${moduleName}.controller.ts`]: `import { Controller } from '@nestjs/common';

import { ${className}Service } from './${moduleName}.service';

@Controller('${moduleName}s')
export class ${className}Controller {
  constructor(private readonly ${moduleName}Service: ${className}Service) { }

}
`,

  [`${moduleName}.service.ts`]: `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Service {
  constructor() { }

}
`,

  [`${moduleName}.repository.ts`]: `import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ${className} } from './entities/${moduleName}.entity';

@Injectable()
export class ${className}Repository extends Repository<${className}> {
  constructor(private dataSource: DataSource) {
    super(${className}, dataSource.createEntityManager());
  }

}
`,

  [`${moduleName}.module.ts`]: `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ${className} } from './entities/${moduleName}.entity';
import { ${className}Service } from './${moduleName}.service';
import { ${className}Controller } from './${moduleName}.controller';
import { ${className}Repository } from './${moduleName}.repository';

@Module({
  imports: [TypeOrmModule.forFeature([${className}])],
  controllers: [${className}Controller],
  providers: [${className}Service, ${className}Repository],
})
export class ${className}Module {}
`,
};

// Criação dos arquivos
for (const [fileName, content] of Object.entries(files)) {
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, content);
  console.log(`✅ Criado: ${fileName}`);
};

const entityPath = path.join(entitiesDir, `${moduleName}.entity.ts`);
const entityContent = `import { Entity } from 'typeorm';

import { BaseEntity } from '@shared/utils/base_entity.util';

@Entity()
export class ${className} extends BaseEntity<${className}> {

}
`;
fs.writeFileSync(entityPath, entityContent);
console.log(`✅ Criado: entities/${moduleName}.entity.ts`);