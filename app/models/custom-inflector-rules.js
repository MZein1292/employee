import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

//inflector.irregular('formula', 'formulae');
inflector.uncountable('employee');

// Meet Ember Inspector's expectation of an export
export default {};
