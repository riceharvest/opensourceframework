const npmBasicAppPath = 'src/__tests__/__apps__/npm-basic';
const yarnWorkspacesAppPath = 'src/__tests__/__apps__/yarn-workspaces/app';
const yarnWorkspacesSymlinksAppPath = 'src/__tests__/__apps__/yarn-workspaces-symlinks/app';
const pnpmAppPath = 'src/__tests__/__apps__/pnpm';
const swcAppPath = 'src/__tests__/__apps__/swc/app';
const withAppDirAppPath = 'src/__tests__/__apps__/with-app-dir/app';

module.exports = {
  launch: {
    headless: true,
    slowMo: false,
    devtools: true,
  },
  server: [
    {
      command: `npm run start --prefix=${npmBasicAppPath} -- --port 3500`,
      launchTimeout: 20000,
      port: 3500,
    },
    {
      command: `yarn --cwd ${yarnWorkspacesAppPath} run start --port 3501`,
      launchTimeout: 20000,
      port: 3501,
    },
    {
      command: `yarn --cwd ${yarnWorkspacesSymlinksAppPath} run start --port 3502`,
      launchTimeout: 20000,
      port: 3502,
    },
    {
      command: `yarn --cwd ${pnpmAppPath} run start --port 3505`,
      launchTimeout: 20000,
      port: 3505,
    },
    {
      command: `yarn --cwd ${swcAppPath} run start --port 3506`,
      launchTimeout: 20000,
      port: 3506,
    },
    {
      command: `yarn --cwd ${withAppDirAppPath} run start --port 3507`,
      launchTimeout: 20000,
      port: 3507,
    },
  ],
};
