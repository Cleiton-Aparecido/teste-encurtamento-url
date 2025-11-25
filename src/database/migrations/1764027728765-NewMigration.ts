import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  resolveDateDefault,
  resolveDateType,
  resolveGenerationStrategy,
  resolveIdDefault,
  resolveIdType,
} from '../util/data';

export class NewMigration1764027728765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    await queryRunner.createTable(
      new Table({
        name: 'url',
        columns: [
          {
            name: 'id',
            type: resolveIdType(dbType),
            isPrimary: true,
            isNullable: false,
            generationStrategy: resolveGenerationStrategy(dbType),
            default: resolveIdDefault(dbType),
          },
          {
            name: 'originalUrl',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'shortCode',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'clickCount',
            type: 'int',
            isNullable: false,
            default: 0, // ou "'0'" se preferir string
          },
          {
            name: 'userId',
            type: resolveIdType(dbType),
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: resolveDateType(dbType),
            default: resolveDateDefault(dbType),
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: resolveDateType(dbType),
            default: resolveDateDefault(dbType),
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: resolveDateType(dbType),
            isNullable: true,
          },
        ],
      }),
      true,
    );

    foreignKeys: [
      {
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ];
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('url');
  }
}
