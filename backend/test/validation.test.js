import test from 'node:test';
import assert from 'node:assert/strict';
import { productSchema } from '../src/validation.js';

test('accepts a complete valid product',()=>{
  const result=productSchema.safeParse({categoryId:1,name:'Calm Cream',slug:'calm-cream',description:'A gentle daily cream for sensitive skin.',price:28,imageUrl:'https://example.com/cream.jpg',inventory:10,featured:false,active:true});
  assert.equal(result.success,true);
});
test('rejects negative inventory and unsafe slug',()=>{
  const result=productSchema.safeParse({categoryId:1,name:'Cream',slug:'Cream!',description:'A gentle daily cream for sensitive skin.',price:28,imageUrl:'https://example.com/a.jpg',inventory:-1,featured:false,active:true});
  assert.equal(result.success,false);
});
