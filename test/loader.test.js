import feathers from 'feathers';
import memory from 'feathers-memory';
import assert from 'assert';

import loader from '../src/loader';
import plugins from '../src/services/plugins';

// `npm ls` fails on some CI environments
const desc = process.env.CI ? describe.skip : describe;

desc('Application tests', () => {
  const app = feathers()
    .use('/plugins', plugins())
    .use('/actions', memory());

  const pluginService = app.service('plugins');

  it('loads and initializes the locally installed weather plugin', done => {
    const dfd = loader(false).call(app, false);
    dfd.then(() => {
      pluginService.find(function(err, data) {
        assert.equal(data.length, 1);
        assert.equal(data[0].name, 'mysam-weather');
        done();
      });
    });
  });
});
