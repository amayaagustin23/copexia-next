const textStyle = require('@tiptap/extension-text-style');
const color = require('@tiptap/extension-color');

console.log('TextStyle exports:', Object.keys(textStyle));
console.log('TextStyle default:', textStyle.default ? 'Yes' : 'No');
console.log('Color exports:', Object.keys(color));
console.log('Color default:', color.default ? 'Yes' : 'No');
