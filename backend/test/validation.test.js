import test from 'node:test';
import assert from 'node:assert/strict';
import { cartItemSchema, checkoutSchema, productSchema, registerSchema } from '../src/validation.js';

test('accepts a complete valid product',()=>{
  const result=productSchema.safeParse({categoryId:1,name:'Calm Cream',slug:'calm-cream',description:'A gentle daily cream for sensitive skin.',price:28,imageUrl:'https://example.com/cream.jpg',inventory:10,featured:false,active:true});
  assert.equal(result.success,true);
});
test('rejects negative inventory and unsafe slug',()=>{
  const result=productSchema.safeParse({categoryId:1,name:'Cream',slug:'Cream!',description:'A gentle daily cream for sensitive skin.',price:28,imageUrl:'https://example.com/a.jpg',inventory:-1,featured:false,active:true});
  assert.equal(result.success,false);
});

test('requires a secure registration password',()=>{
  assert.equal(registerSchema.safeParse({name:'Naina',email:'naina@example.com',password:'short'}).success,false);
  assert.equal(registerSchema.safeParse({name:'Naina',email:'NAINA@example.com',password:'strongpass'}).data.email,'naina@example.com');
});

test('limits cart quantities',()=>{
  assert.equal(cartItemSchema.safeParse({productId:1,quantity:2}).success,true);
  assert.equal(cartItemSchema.safeParse({productId:1,quantity:21}).success,false);
});

test('validates required checkout fields',()=>{
  const checkout={customerName:'Naina Malik',email:'naina@example.com',addressLine1:'123 Main Street',city:'Brooklyn',state:'NY',postalCode:'11201'};
  assert.equal(checkoutSchema.safeParse(checkout).success,true);
  assert.equal(checkoutSchema.safeParse({...checkout,postalCode:''}).success,false);
});
