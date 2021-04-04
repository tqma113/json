import fs from 'fs'
import path from 'path'
import { parse, createParser, TokenKind } from '../src'

describe('parser', () => {
  it('sample', () => {
    const filepath = path.resolve(__dirname, './fixtures/bar.jc')
    const content = fs.readFileSync(filepath, 'utf-8')

    const document = parse({ filepath, content })

    expect(document.statements.length).toBe(20)
  })

  describe('base', () => {
    it('parseBooleanLiteralNode', () => {
      const filepath = 'parseBooleanLiteralNode.jc'
      const content = 'true false'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseBooleanLiteralNode()).toMatchObject({
        value: { kind: 'boolean', word: 'true' },
      })

      expect(parser.parseBooleanLiteralNode()).toMatchObject({
        value: { kind: 'boolean', word: 'false' },
      })
    })

    it('parseNumberLiteralNode', () => {
      const filepath = 'parseNumberLiteralNode.jc'
      const content = '123'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseNumberLiteralNode()).toMatchObject({
        value: { kind: 'number', word: '123' },
      })
    })

    it('parseStringLiteralNode', () => {
      const filepath = 'parseStringLiteralNode.jc'
      const content = '"foo"'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseStringLiteralNode()).toMatchObject({
        value: { kind: 'string', word: 'foo' },
      })
    })

    it('parseSpecialTypeNode', () => {
      const filepath = 'parseSpecialTypeNode.jc'
      const content = 'any none'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseSpecialTypeNode()).toMatchObject({
        specialType: { kind: 'special type', word: 'any' },
      })

      expect(parser.parseSpecialTypeNode()).toMatchObject({
        specialType: { kind: 'special type', word: 'none' },
      })
    })

    it('parsePrimitiveTypeNode', () => {
      const filepath = 'parsePrimitiveTypeNode.jc'
      const content = 'string number boolean null'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'string' },
      })

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'number' },
      })

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'boolean' },
      })

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'null' },
      })
    })

    it('parseNameNode', () => {
      const filepath = 'parseNameNode.jc'
      const content = 'foo'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseNameNode()).toMatchObject({
        name: { kind: 'name', word: 'foo' },
      })
    })

    it('parseTupleTypeNode', () => {
      const filepath = 'parseTupleTypeNode.jc'
      const content = '(number, string)'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseTupleTypeNode()).toMatchObject({
        fields: [
          {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
          {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
        ],
      })
    })

    it('parseObjectTypeNode', () => {
      const filepath = 'parseObjectTypeNode.jc'
      const content = '{ foo: number, bar: string }'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseObjectTypeNode()).toMatchObject({
        fields: [
          [
            { name: { kind: 'name', word: 'foo' } },
            {
              primitiveType: { kind: 'primitive type', word: 'number' },
            },
          ],
          [
            { name: { kind: 'name', word: 'bar' } },
            {
              primitiveType: { kind: 'primitive type', word: 'string' },
            },
          ],
        ],
      })
    })

    it('parseListTypeNode', () => {
      const filepath = 'parseListTypeNode.jc'
      const content = '[string]'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseListTypeNode()).toMatchObject({
        type: {
          primitiveType: { kind: 'primitive type', word: 'string' },
        },
      })
    })

    it('parseTypeNode', () => {
      const filepath = 'parseTypeNode.jc'
      const content = 'string | number string & number'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseTypeNode()).toMatchObject({
        kind: 'union type',
        types: [
          {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
          {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
        ],
      })

      expect(parser.parseTypeNode()).toMatchObject({
        kind: 'intersection type',
        types: [
          {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
          {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
        ],
      })
    })

    it('parseExportStatement', () => {
      const filepath = 'parseExportStatement.jc'
      const content = 'export { foo, bar }'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseExportStatement()).toMatchObject({
        names: [
          {
            name: { kind: 'name', word: 'foo' },
          },
          {
            name: { kind: 'name', word: 'bar' },
          },
        ],
      })
    })

    it('parseImportStatement', () => {
      const filepath = 'parseImportStatement.jc'
      const content = 'import { foo, bar as baz } from "./sample.jc"'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseImportStatement()).toMatchObject({
        names: [
          [
            {
              name: { kind: 'name', word: 'foo' },
            },
            {
              name: { kind: 'name', word: 'foo' },
            },
          ],
          [
            {
              name: { kind: 'name', word: 'bar' },
            },
            {
              name: { kind: 'name', word: 'baz' },
            },
          ],
        ],
        path: {
          path: { kind: 'string', word: './sample.jc' },
        },
      })
    })

    it('parseCallDeclaration', () => {
      const filepath = 'parseCallDeclaration.jc'
      const content = 'call fooCall: number => string'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseCallDeclaration()).toMatchObject({
        name: {
          name: { kind: 'name', word: 'fooCall' },
        },
        input: {
          primitiveType: { kind: 'primitive type', word: 'number' },
        },
        output: {
          primitiveType: { kind: 'primitive type', word: 'string' },
        },
      })
    })

    it('parseDeriveDeclaration', () => {
      const filepath = 'parseDeriveDeclaration.jc'
      const content = 'derive Date from string'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseDeriveDeclaration()).toMatchObject({
        name: {
          name: { kind: 'name', word: 'Date' },
        },
        type: {
          primitiveType: { kind: 'primitive type', word: 'string' },
        },
      })
    })

    it('parseTypeDeclaration', () => {
      const filepath = 'parseTypeDeclaration.jc'
      const content = 'type foo = number'

      const parser = createParser({ filepath, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseTypeDeclaration()).toMatchObject({
        name: {
          name: { kind: 'name', word: 'foo' },
        },
        type: {
          primitiveType: { kind: 'primitive type', word: 'number' },
        },
      })
    })
  })
})
