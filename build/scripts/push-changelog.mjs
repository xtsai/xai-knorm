import { execSync } from 'child_process';
import pkg from '../../package.json' with { type: 'json' };

async function main() {
  // const { default: pkg } = await import('../../package.json', {
  //   assert: {
  //     type: 'json',
  //   },
  // });

  const commandAdd = `git add .`;
  const commandCommit = `git commit -am "chore(): release v${pkg.version}"`;
  const commandPush = `git push`;
  try {
    await execSync(commandAdd, { stdio: 'inherit' });
    await execSync(commandCommit, { stdio: 'inherit' });
  } catch (ex) {
    globalThis.console.error(ex);
  } finally {
    await execSync(commandPush, { stdio: 'inherit' });
  }
}

main();
