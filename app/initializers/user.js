export function initialize(application) {
  application.inject('route', 'user', 'service:user');
  application.inject('controller', 'user', 'service:user');
}

export default {
  name: 'user',
  initialize
};
