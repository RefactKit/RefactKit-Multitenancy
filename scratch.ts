import { auth } from './lib/auth';
async function test() {
  try {
    const res = await auth.api.hasPermission({
      body: {
        permission: { project: ['delete'] },
        organizationId: 'fake-org-id'
      },
      headers: new Headers()
    });
    console.log(res);
  } catch (e) {
    console.error(e.message);
  }
}
test();
